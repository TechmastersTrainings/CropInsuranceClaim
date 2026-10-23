import pytest
from fastapi import status
from backend.app.models.user import UserRole
from backend.app.core.state_machine import ClaimStateMachine, ALLOWED_TRANSITIONS


def test_state_machine_legal_transitions():
    # Submitted -> Under Review (Authorized for Insurer)
    valid, msg = ClaimStateMachine.is_valid_transition("Submitted", "Under Review", UserRole.INSURER)
    assert valid is True

    # Under Review -> Approved (Authorized for Insurer)
    valid, msg = ClaimStateMachine.is_valid_transition("Under Review", "Approved", UserRole.INSURER)
    assert valid is True

    # Approved -> Settlement In Progress (Authorized for Insurer)
    valid, msg = ClaimStateMachine.is_valid_transition("Approved", "Settlement In Progress", UserRole.INSURER)
    assert valid is True


def test_state_machine_illegal_jump_rejected():
    # Draft -> Settled (Illegal graph jump)
    valid, msg = ClaimStateMachine.is_valid_transition("Draft", "Settled", UserRole.INSURER)
    assert valid is False
    assert "Illegal state transition" in msg

    # Closed -> Under Review (Closed is terminal)
    valid, msg = ClaimStateMachine.is_valid_transition("Closed", "Under Review", UserRole.INSURER)
    assert valid is False


def test_state_machine_role_permission_enforcement():
    # Farmer attempting to approve a claim
    valid, msg = ClaimStateMachine.is_valid_transition("Under Review", "Approved", UserRole.FARMER)
    assert valid is False
    assert "Actor role 'FARMER' is unauthorized" in msg


def test_api_enforces_state_machine_rejection(client, insurer_token):
    headers = {"Authorization": f"Bearer {insurer_token}"}
    
    # Claim 1 is 'Under Review' in seed data. Attempt illegal jump to 'Draft'
    payload = {
        "new_status": "Draft",
        "remarks": "Attempting illegal backward jump to Draft"
    }
    response = client.post("/api/v1/claims/1/transition", json=payload, headers=headers)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    data = response.json()
    assert "Illegal state transition" in data["detail"]


def test_state_machine_get_allowed_transitions():
    # Farmer on Draft can only submit
    allowed_farmer = ClaimStateMachine.get_allowed_transitions("Draft", UserRole.FARMER)
    assert "Submitted" in allowed_farmer

    # Insurer on Under Review can approve, reject, or request additional evidence
    allowed_insurer = ClaimStateMachine.get_allowed_transitions("Under Review", UserRole.INSURER)
    assert "Approved" in allowed_insurer
    assert "Rejected" in allowed_insurer
    assert "Additional Evidence Requested" in allowed_insurer


def test_api_get_state_machine_graph(client):
    response = client.get("/api/v1/claims/state-machine/graph")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "transitions" in data
    assert "roles" in data
    assert "Submitted" in data["transitions"]
    assert "Approved" in data["transitions"]


def test_api_get_claim_allowed_transitions(client, insurer_token):
    headers = {"Authorization": f"Bearer {insurer_token}"}
    response = client.get("/api/v1/claims/1/allowed-transitions", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["claim_id"] == 1
    assert data["current_status"] == "Approved"
    assert "Settlement Pending" in data["allowed_next_states"]
    assert "Closed" in data["allowed_next_states"]


def test_api_evaluate_parametric_payout(client, insurer_token):
    headers = {"Authorization": f"Bearer {insurer_token}"}
    payload = {
        "sum_insured": 100000.0,
        "loss_percentage": 55.0,
        "deductible_pct": 10.0
    }
    response = client.post("/api/v1/claims/evaluate-parametric-payout", json=payload, headers=headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["sum_insured"] == 100000.0
    assert data["loss_percentage"] == 55.0
    assert data["payout_amount"] == 50000.0  # (55 - 10) / 90 * 100000 = 50% * 100000 = 50000.0
    assert data["payout_percentage"] == 50.0


def test_api_get_crop_agronomic_profile(client):
    response = client.get("/api/v1/crops/Cotton/agronomic-profile")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["scientific_name"] == "Gossypium hirsutum"
    assert len(data["stages"]) >= 3
    assert "parametric_triggers" in data
