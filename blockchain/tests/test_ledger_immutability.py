import pytest
from blockchain.client.gateway import FabricLedgerGateway


def test_genesis_block_and_chain_integrity():
    gateway = FabricLedgerGateway()
    is_valid, msg = gateway.verify_ledger_integrity()
    assert is_valid is True
    assert "cryptographically verified" in msg
    assert len(gateway.blocks) == 1
    assert gateway.blocks[0].block_number == 0


def test_multi_block_immutability_verification():
    gateway = FabricLedgerGateway()
    
    # Anchor multiple operations
    gateway.anchor_claim_submission(
        claim_number="CLM-2026-001",
        farmer_id=1,
        farm_plot_id=1,
        policy_id=1,
        claimed_amount=100000.0,
        damage_reason="Drought Desiccation",
        damage_event_date="2026-09-20"
    )
    gateway.anchor_telemetry_batch(farm_plot_id=1, readings=[{"device": "ESP1", "moisture": 11.2}])
    gateway.anchor_state_transition("CLM-2026-001", "Submitted", "Approved", "Officer Ramesh", "Insurer", "Approved")
    
    assert len(gateway.blocks) == 4
    is_valid, msg = gateway.verify_ledger_integrity()
    assert is_valid is True


def test_tamper_detection_on_block_data():
    gateway = FabricLedgerGateway()
    gateway.anchor_claim_submission(
        claim_number="CLM-2026-002",
        farmer_id=2,
        farm_plot_id=2,
        policy_id=2,
        claimed_amount=80000.0,
        damage_reason="Flash Flood",
        damage_event_date="2026-09-21"
    )
    
    # Intentionally tamper with block #1 data
    gateway.blocks[1].transactions[0]["payload"]["claimed_amount"] = 999999.0
    
    is_valid, msg = gateway.verify_ledger_integrity()
    assert is_valid is False
    assert "Data tampering detected" in msg
