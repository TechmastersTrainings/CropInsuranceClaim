import pytest
from fastapi import status


def test_unauthenticated_request_strictly_rejected(client):
    response = client.get("/api/v1/farms")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_privilege_escalation_blocked(client, farmer_token):
    headers = {"Authorization": f"Bearer {farmer_token}"}
    response = client.get("/api/v1/admin/users", headers=headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_section_25_ai_information_confidentiality(client, farmer_token):
    """Section 25 Compliance: Verify that internal AI weights, architectures, internal prompts, or checkpoints are NOT exposed in public API responses."""
    headers = {"Authorization": f"Bearer {farmer_token}"}
    response = client.get("/api/v1/claims/1", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    claim_data = response.json()
    
    # Allowed business indicators:
    assert "ai_condition_indicator" in claim_data
    assert "ai_loss_percentage" in claim_data
    
    # Strictly forbidden internal AI artifacts:
    forbidden_keys = [
        "model_weights",
        "checkpoint_path",
        "internal_architecture",
        "hyperparameters",
        "training_dataset_path",
        "system_prompt",
        "hidden_instructions",
        "loss_gradient"
    ]
    for key in forbidden_keys:
        assert key not in claim_data


def test_blockchain_block_explorer_endpoint(client):
    response = client.get("/api/v1/blockchain/blocks")
    assert response.status_code == status.HTTP_200_OK
    blocks = response.json()
    assert len(blocks) >= 2
    assert blocks[0]["channel_name"] == "cropinsurancechannel"
    assert "tx_hash" in blocks[0]
