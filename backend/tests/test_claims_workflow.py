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
