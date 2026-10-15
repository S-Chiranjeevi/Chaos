"""Test suite for the LunaHer Pattern Screening Model."""
from __future__ import annotations

import io
from fastapi.testclient import TestClient
from PIL import Image

try:
    from app.main import app
except ImportError:
    from backend.app.main import app

client = TestClient(app)


def test_screening_health_endpoint():
    """Verify health endpoint reports model status."""
    response = client.get("/api/pcos-screening/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ("healthy", "degraded")
    assert "model_loaded" in data
    assert data["version"] == "1.0.0"


def test_screening_model_info_endpoint():
    """Verify model-info endpoint returns accurate metadata and disclaimer."""
    response = client.get("/api/pcos-screening/model-info")
    assert response.status_code == 200
    data = response.json()
    assert data["model_name"] == "LunaHer Pattern Screening Model"
    assert data["algorithm"] == "XGBoost (Extreme Gradient Boosting)"
    assert data["feature_count"] == 42
    assert "validation_metrics" in data
    assert "disclaimer" in data
    assert len(data["supported_features"]) >= 20


def test_clinical_screening_low_risk_profile():
    """Test inference with a normal/low-risk clinical profile."""
    payload = {
        "age": 25,
        "weight_kg": 54,
        "height_cm": 165,
        "waist_inch": 28,
        "hip_inch": 36,
        "pulse_bpm": 70,
        "rbs_mg_dl": 88,
        "cycle_regularity": "regular",
        "cycle_length_days": 28,
        "hair_growth": False,
        "skin_darkening": False,
        "hair_loss": False,
        "pimples_acne": False,
        "weight_gain": False,
        "follicles_left": 4,
        "follicles_right": 5,
    }
    response = client.post("/api/pcos-screening/clinical", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["prediction"] in (0, 1)
    assert 0.0 <= data["risk_score_percentage"] <= 100.0
    assert "calculated_metrics" in data
    assert "bmi" in data["calculated_metrics"]
    assert "waist_hip_ratio" in data["calculated_metrics"]
    assert "clinical_disclaimer" in data
    assert "NOT A MEDICAL DIAGNOSIS" in data["clinical_disclaimer"]
    assert len(data["limitations"]) > 0


def test_clinical_screening_elevated_risk_profile():
    """Test inference with features that strongly correlate with polycystic morphology."""
    payload = {
        "age": 28,
        "weight_kg": 76,
        "height_cm": 158,
        "waist_inch": 36,
        "hip_inch": 39,
        "pulse_bpm": 80,
        "rbs_mg_dl": 115,
        "cycle_regularity": "irregular",
        "cycle_length_days": 55,
        "hair_growth": True,
        "skin_darkening": True,
        "hair_loss": True,
        "pimples_acne": True,
        "weight_gain": True,
        "amh_ng_ml": 8.5,
        "lh_miu_ml": 14.2,
        "fsh_miu_ml": 4.1,
        "follicles_left": 15,
        "follicles_right": 16,
    }
    response = client.post("/api/pcos-screening/clinical", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["prediction"] == 1
    assert data["confidence_tier"] in ("elevated", "moderate")
    assert data["risk_score_percentage"] >= 50.0
    assert len(data["top_contributing_factors"]) > 0


def test_clinical_screening_empty_or_partial_payload():
    """Test inference when user provides minimal optional parameters."""
    payload = {
        "age": 29,
        "cycle_regularity": "irregular",
    }
    response = client.post("/api/pcos-screening/clinical", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["prediction"] in (0, 1)
    assert "risk_score_percentage" in data


def test_ultrasound_analysis_valid_image():
    """Test ultrasound image processing with a synthetic ultrasound-like scan."""
    # Generate a synthetic grayscale test image (512x512 with dark circular spots)
    img = Image.new("L", (300, 300), color=180)
    # Save to memory buffer
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)

    files = {"file": ("test_ultrasound.png", buf, "image/png")}
    response = client.post("/api/pcos-screening/ultrasound", files=files)
    assert response.status_code == 200
    data = response.json()
    assert "left_follicle_estimate" in data
    assert "right_follicle_estimate" in data
    assert data["status"] == "success"
    assert "disclaimer" in data


def test_ultrasound_analysis_unsupported_file_format():
    """Test that non-image formats are strictly rejected."""
    buf = io.BytesIO(b"Fake PDF contents")
    files = {"file": ("scan_document.pdf", buf, "application/pdf")}
    response = client.post("/api/pcos-screening/ultrasound", files=files)
    assert response.status_code == 400
    assert "Unsupported file format" in response.json()["message"]
