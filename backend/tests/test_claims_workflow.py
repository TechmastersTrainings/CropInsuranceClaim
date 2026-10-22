import pytest
from fastapi import status


def test_submit_claim_workflow(client, farmer_token):
    headers = {"Authorization": f"Bearer {farmer_token}"}
    payload = {
        "farm_plot_id": 1,
        "policy_id": 1,
        "claimed_amount": 125000.0,
        "damage_reason": "Excessive Continuous Heatwave & Soil Moisture Deficit",
        "damage_event_date": "2026-09-24"
    }
    response = client.post("/api/v1/claims", json=payload, headers=headers)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["claim_number"].startswith("CLM-2026-")
    assert data["status"] == "Submitted"
    assert data["claimed_amount"] == 125000.0
    assert data["blockchain_tx_hash"].startswith("0x")


def test_claim_adjudication_transition_by_insurer(client, insurer_token):
    headers = {"Authorization": f"Bearer {insurer_token}"}
    payload = {
        "new_status": "Approved",
        "remarks": "Automated meteorological and sensor telemetry confirmed. Payout approved."
    }
    response = client.post("/api/v1/claims/1/transition", json=payload, headers=headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["status"] == "Approved"
    assert data["approved_amount"] > 0
    assert "telemetry confirmed" in data["officer_remarks"]


def test_claim_adjudication_forbidden_for_farmer(client, farmer_token):
    headers = {"Authorization": f"Bearer {farmer_token}"}
    payload = {
        "new_status": "Approved",
        "remarks": "Self-approval attempt"
    }
    response = client.post("/api/v1/claims/1/transition", json=payload, headers=headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_register_claim_evidence(client, farmer_token):
    headers = {"Authorization": f"Bearer {farmer_token}"}
    payload = {
        "filename": "Canopy_Foliage_Damage_EXIF.jpg",
        "evidence_type": "Geotagged Photo",
        "gps_coordinates": "15.3647° N, 75.1240° E"
    }
    response = client.post("/api/v1/claims/1/evidence", data=payload, headers=headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["filename"] == "Canopy_Foliage_Damage_EXIF.jpg"
    assert len(data["sha256_hash"]) == 64  # Valid SHA-256 length


def test_ai_claim_assessment_endpoint(client, farmer_token):
    headers = {"Authorization": f"Bearer {farmer_token}"}
    payload = {
        "claimed_cause": "Severe Drought Desiccation",
        "crop_cycle_day": 70,
        "canopy_green_index": 0.25,
        "foliage_wilting_index": 0.85
    }
    response = client.post("/api/v1/claims/1/assess", json=payload, headers=headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["claim_id"] == 1
    assert "damage_category" in data
    assert "estimated_loss_percentage" in data
    assert 0.0 <= data["estimated_loss_percentage"] <= 100.0
    assert "recommended_payout_percentage" in data
    assert "weather_correlation_score" in data
    assert "advisory_rationale" in data
    assert "anomaly_detected" in data
    assert "environmental_telemetry_summary" in data

