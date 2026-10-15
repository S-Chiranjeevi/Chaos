"""Unit tests for MongoDB integration endpoints in PCOS Saathi / SakhiCare backend."""
import pytest
from fastapi.testclient import TestClient

from backend.app.main import app
from backend.app.core.database import mongo_manager

client = TestClient(app)


def test_db_status_endpoint():
    """Verify the /api/db/status endpoint returns structured JSON with connectivity and counts."""
    response = client.get("/api/db/status")
    assert response.status_code == 200
    data = response.json()
    assert "connected" in data
    assert "db_name" in data
    assert "collections" in data
    assert "health_entries" in data["collections"]
    assert "cycle_entries" in data["collections"]
    assert "doctor_summaries" in data["collections"]


def test_db_configure_endpoint_invalid_or_offline():
    """Verify the /api/db/configure endpoint gracefully handles unreachable endpoints."""
    payload = {
        "uri": "mongodb://invalid-host-999.test:27017",
        "db_name": "test_sakhicare",
        "timeout_ms": 500,
    }
    response = client.post("/api/db/configure", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is False
    assert "Could not connect" in data["message"]


def test_db_endpoints_when_offline_return_503():
    """Verify data endpoints return clean 503 errors when MongoDB is disconnected, preserving stability."""
    mongo_manager.is_connected = False
    
    # Health entries
    res_health = client.get("/api/db/health-entries")
    assert res_health.status_code == 503
    assert "offline" in res_health.json()["message"].lower()

    # Cycle entries
    res_cycles = client.get("/api/db/cycle-entries")
    assert res_cycles.status_code == 503

    # Doctor summaries
    res_summaries = client.get("/api/db/doctor-summaries")
    assert res_summaries.status_code == 503

    # Sync
    res_sync = client.post("/api/db/sync", json={"health_entries": []})
    assert res_sync.status_code == 503
