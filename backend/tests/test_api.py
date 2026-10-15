"""Integration and unit tests for PCOS Saathi Stateless API."""
import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_endpoint():
    """Verify GET /api/health returns status: ok."""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_analyze_endpoint_example():
    """Verify POST /api/analyze with user specification payload."""
    payload = {
        "text": "My periods come every two or three months",
        "language": "en",
        "age": 22
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["detected_language"] == "en"
    assert isinstance(data["symptoms"], list)
    assert len(data["symptoms"]) > 0
    assert "Irregular or infrequent periods" in data["symptoms"]
    assert isinstance(data["possible_relation"], str)
    assert len(data["possible_relation"]) > 0
    assert data["urgency"] in ("routine", "soon", "urgent", "emergency")
    assert isinstance(data["red_flags"], list)
    assert data["recommended_specialist"] in ("gynecologist", "endocrinologist", "general physician")
    assert isinstance(data["questions_for_doctor"], list)
    assert len(data["questions_for_doctor"]) > 0
    assert isinstance(data["self_care_tips"], list)
    assert len(data["self_care_tips"]) > 0
    assert data["disclaimer"] == "This is information, not a diagnosis."
    assert isinstance(data["reply_text"], str)
    assert len(data["reply_text"]) > 0


def test_analyze_red_flag_detection():
    """Verify red flags trigger urgent triage without storing health data."""
    payload = {
        "text": "I have high fever and severe pelvic pain since yesterday",
        "language": "en"
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["urgency"] in ("urgent", "emergency")
    assert len(data["red_flags"]) > 0


def test_analyze_validation_empty_text():
    """Verify validation error on empty text with helpful message."""
    response = client.post("/api/analyze", json={"text": "   "})
    assert response.status_code == 422
    data = response.json()
    assert data["error"] == "VALIDATION_ERROR"
    assert len(data["details"]) > 0


def test_analyze_validation_text_length_limit():
    """Verify text length limits (max 2000 chars)."""
    response = client.post("/api/analyze", json={"text": "a" * 2001})
    assert response.status_code == 422
    data = response.json()
    assert data["error"] == "VALIDATION_ERROR"


def test_cycle_endpoint_example():
    """Verify POST /api/cycle with user specification payload."""
    payload = {
        "period_start_dates": [
            "2026-01-01",
            "2026-02-10",
            "2026-03-25"
        ]
    }
    response = client.post("/api/cycle", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert len(data["cycles"]) == 2
    assert data["cycles"][0] == {
        "start_date": "2026-01-01",
        "end_date": "2026-02-10",
        "length_days": 40
    }
    assert data["cycles"][1] == {
        "start_date": "2026-02-10",
        "end_date": "2026-03-25",
        "length_days": 43
    }
    assert data["average_cycle_length"] == 41.5
    assert data["shortest_cycle"] == 40
    assert data["longest_cycle"] == 43
    assert data["variation_days"] == 3
    assert data["regularity"] == "irregular"
    assert data["predicted_next_period"] == "2026-05-06"
    assert isinstance(data["insights"], list)
    assert len(data["insights"]) > 0
    assert data["disclaimer"] == "This is information, not a diagnosis."


def test_cycle_validation_invalid_date():
    """Verify invalid date format is rejected cleanly."""
    response = client.post("/api/cycle", json={"period_start_dates": ["not-a-date"]})
    assert response.status_code == 422
    data = response.json()
    assert data["error"] == "VALIDATION_ERROR"


def test_summary_endpoint_example():
    """Verify POST /api/summary with user specification structure."""
    payload = {
        "symptoms": ["Irregular periods", "Acne", "Mild pelvic cramps"],
        "duration": "3 months",
        "cycle_data": {
            "averageCycleDays": 42,
            "irregularityScore": "irregular"
        },
        "insights": ["3 cycles > 35 days"],
        "language": "en"
    }
    response = client.post("/api/summary", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert isinstance(data["narrative"], str)
    assert len(data["narrative"]) > 0
    assert isinstance(data["main_symptoms"], list)
    assert len(data["main_symptoms"]) == 3
    assert data["recommended_specialist"] == "gynecologist"
    assert isinstance(data["questions_for_doctor"], list)
    assert len(data["questions_for_doctor"]) > 0
    assert isinstance(data["printable_text"], str)
    assert "PCOS SAATHI" in data["printable_text"]
    assert data["disclaimer"] == "This is information, not a diagnosis."


def test_cors_headers():
    """Verify CORS headers are returned for allowed origins."""
    response = client.options(
        "/api/analyze",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "POST",
        }
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"


def test_apiverve_forecast_validation():
    """Verify APIVerve endpoint strictly validates input parameter constraints."""
    # Invalid date
    res = client.post("/api/cycle/apiverve-forecast", json={"last_period": "not-a-date"})
    assert res.status_code == 422

    # Cycle length out of range (< 21)
    res = client.post("/api/cycle/apiverve-forecast", json={"last_period": "2026-03-01", "cycle_length": 15})
    assert res.status_code == 422

    # Period length out of range (> 10)
    res = client.post("/api/cycle/apiverve-forecast", json={"last_period": "2026-03-01", "period_length": 15})
    assert res.status_code == 422

    # Cycle count out of range (> 12)
    res = client.post("/api/cycle/apiverve-forecast", json={"last_period": "2026-03-01", "cycles": 20})
    assert res.status_code == 422


def test_apiverve_forecast_missing_key_error(monkeypatch):
    """Verify transparent 503 error when APIVERVE_API_KEY is not configured."""
    from app.services.apiverve_service import apiverve_service
    monkeypatch.setattr(apiverve_service, "api_key", "")
    
    res = client.post(
        "/api/cycle/apiverve-forecast",
        json={"last_period": "2026-03-01", "cycle_length": 28, "period_length": 5, "cycles": 3}
    )
    assert res.status_code == 503
    data = res.json()
    assert "error" in data["detail"] or "message" in data["detail"]


def test_apiverve_forecast_successful_integration():
    """Verify successful live API call when valid API key is present."""
    from app.core.config import settings
    if not settings.has_apiverve:
        pytest.skip("APIVERVE_API_KEY not configured in environment")

    res = client.post(
        "/api/cycle/apiverve-forecast",
        json={
            "last_period": "2026-03-01",
            "cycle_length": 28,
            "period_length": 5,
            "cycles": 3
        }
    )
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "ok"
    assert body["source"] == "apiverve_live_api"
    assert "data" in body
    d = body["data"]
    assert d["last_period_date"] == "2026-03-01"
    assert d["cycle_length"] == 28
    assert d["period_length"] == 5
    assert len(d["cycles"]) == 3

    c1 = d["cycles"][0]
    assert "period" in c1
    assert "start_date" in c1["period"]
    assert "end_date" in c1["period"]
    assert "ovulation" in c1
    assert "date" in c1["ovulation"]
    assert "fertile_window" in c1
    assert "start_date" in c1["fertile_window"]

    # Security invariant: API key must NEVER be leaked in response
    assert settings.APIVERVE_API_KEY not in res.text

