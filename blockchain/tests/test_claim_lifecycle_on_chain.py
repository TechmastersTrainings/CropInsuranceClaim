import pytest
from blockchain.client.gateway import FabricLedgerGateway


def test_full_claim_lifecycle_audit_trail():
    gateway = FabricLedgerGateway()
    claim_num = "CLM-2026-901"

    # 1. Submit Claim
    sub_res = gateway.anchor_claim_submission(
        claim_number=claim_num,
        farmer_id=1,
        farm_plot_id=1,
        policy_id=1,
        claimed_amount=150000.0,
        damage_reason="Scorching Heat & Desiccation",
        damage_event_date="2026-09-18"
    )
    assert sub_res["block_number"] == 1
    assert sub_res["tx_id"].startswith("0x")

    # 2. Telemetry Batch Merkle Anchor
    telemetry_batch = [
        {"device_identifier": "ESP-DEV-001", "temperature": 38.5, "moisture": 11.2, "rainfall": 0.0, "timestamp": "2026-09-18T10:00:00Z"},
        {"device_identifier": "ESP-DEV-001", "temperature": 39.1, "moisture": 10.8, "rainfall": 0.0, "timestamp": "2026-09-18T14:00:00Z"},
        {"device_identifier": "ESP-DEV-001", "temperature": 37.4, "moisture": 10.5, "rainfall": 0.0, "timestamp": "2026-09-18T18:00:00Z"}
    ]
    merkle_res = gateway.anchor_telemetry_batch(farm_plot_id=1, readings=telemetry_batch)
    assert merkle_res["block_number"] == 2
    assert len(merkle_res["merkle_root"]) == 64

    # 3. Anchor AI Assessment
    ai_res = gateway.anchor_ai_assessment(
        claim_number=claim_num,
        condition_indicator="Severe Drought Desiccation",
        loss_percentage=68.5,
        weather_correlation_score=0.94,
        advisory_rationale="Physical sensor telemetry and satellite green index corroborate drought desiccation."
    )
    assert ai_res["block_number"] == 3
    assert len(ai_res["assessment_hash"]) == 64

    # 4. Under Review State Transition
    trans1 = gateway.anchor_state_transition(
        claim_number=claim_num,
        from_state="Submitted",
        to_state="Under Review",
        actor_name="Officer Suresh",
        actor_role="Insurer",
        remarks="Initiating algorithmic telemetry verification"
    )
    assert trans1["block_number"] == 4

    # 5. Approved State Transition
    trans2 = gateway.anchor_state_transition(
        claim_number=claim_num,
        from_state="Under Review",
        to_state="Approved",
        actor_name="Officer Suresh",
        actor_role="Insurer",
        remarks="Parametric threshold verified. Approved payout."
    )
    assert trans2["block_number"] == 5

    # 6. Settled State Transition
    trans3 = gateway.anchor_state_transition(
        claim_number=claim_num,
        from_state="Approved",
        to_state="Settled",
        actor_name="Automated Settlement Oracle",
        actor_role="Settlement System",
        remarks="Funds disbursed via DBT to Farmer Bank Account"
    )
    assert trans3["block_number"] == 6

    # Verify Audit History
    history = gateway.get_claim_history(claim_num)
    assert len(history) == 4
    assert history[0]["to_state"] == "Submitted"
    assert history[1]["to_state"] == "Under Review"
    assert history[2]["to_state"] == "Approved"
    assert history[3]["to_state"] == "Settled"

    # Verify Ledger Integrity
    is_valid, _ = gateway.verify_ledger_integrity()
    assert is_valid is True
