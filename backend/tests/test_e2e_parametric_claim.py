import pytest
from fastapi import status
from iot.simulator.esp32_simulator import ESP32DeviceSimulator, AgronomicScenario
from blockchain.client.gateway import FabricLedgerGateway


def test_end_to_end_parametric_insurance_pipeline(client, farmer_token, insurer_token):
    """Validates the complete parametric claim lifecycle:
    Farmer Plot -> IoT Telemetry Streaming -> Claim Submission -> Real AI Assessment ->
    Geotagged Evidence -> Insurer Adjudication -> Blockchain Finality.
    """
    farmer_headers = {"Authorization": f"Bearer {farmer_token}"}
    insurer_headers = {"Authorization": f"Bearer {insurer_token}"}

    # Step 1: Query Farmer's registered plots
    farm_resp = client.get("/api/v1/farms", headers=farmer_headers)
    assert farm_resp.status_code == status.HTTP_200_OK
    farms = farm_resp.json()
    assert len(farms) >= 1
    target_plot = farms[0]
    plot_id = target_plot["id"]

    # Step 2: Stream simulated ESP32 drought telemetry frames with CRC32
    sim = ESP32DeviceSimulator("ESP-E2E-PROBE-01", farm_plot_id=plot_id, scenario=AgronomicScenario.DROUGHT)
    for _ in range(3):
        frame = sim.simulate_telemetry_reading()
        ingest_payload = {
            "device_identifier": frame["device_identifier"],
            "farm_plot_id": frame["farm_plot_id"],
            "temperature": frame["temperature"],
            "moisture": frame["moisture"],
            "humidity": frame["humidity"],
            "rainfall": frame["rainfall"],
            "crc_checksum": frame["crc_checksum"]
        }
        res = client.post("/api/v1/telemetry/ingest", json=ingest_payload)
        assert res.status_code == status.HTTP_201_CREATED
        assert res.json()["crc_valid"] is True

    # Step 3: Farmer submits parametric claim
    claim_payload = {
        "farm_plot_id": plot_id,
        "policy_id": 1,
        "claimed_amount": 135000.0,
        "damage_reason": "Severe Drought Desiccation & Foliage Wilting",
        "damage_event_date": "2026-09-24"
    }
    claim_res = client.post("/api/v1/claims", json=claim_payload, headers=farmer_headers)
    assert claim_res.status_code == status.HTTP_201_CREATED
    claim_data = claim_res.json()
    claim_id = claim_data["id"]
    claim_number = claim_data["claim_number"]
    assert claim_data["status"] == "Submitted"
    assert claim_data["blockchain_tx_hash"].startswith("0x")

    # Step 4: Run Real-Time AI Multi-Modal Damage Assessment
    ai_req = {
        "claimed_cause": "Severe Drought Desiccation",
        "crop_cycle_day": 72,
        "canopy_green_index": 0.26,
        "foliage_wilting_index": 0.84
    }
    ai_resp = client.post(f"/api/v1/claims/{claim_id}/assess", json=ai_req, headers=farmer_headers)
    assert ai_resp.status_code == status.HTTP_200_OK
    ai_result = ai_resp.json()
    assert "Drought" in ai_result["damage_category"]
    assert ai_result["estimated_loss_percentage"] >= 45.0
    assert ai_result["weather_correlation_score"] >= 0.80
    assert ai_result["anomaly_detected"] is False
    assert len(ai_result["advisory_rationale"]) > 20

    # Step 5: Upload Geotagged Field Evidence
    evidence_payload = {
        "filename": "Canopy_Desiccation_Plot4B.jpg",
        "evidence_type": "Geotagged Photo",
        "gps_coordinates": "15.3647° N, 75.1240° E"
    }
    ev_resp = client.post(f"/api/v1/claims/{claim_id}/evidence", data=evidence_payload, headers=farmer_headers)
    assert ev_resp.status_code == status.HTTP_200_OK
    ev_data = ev_resp.json()
    assert len(ev_data["sha256_hash"]) == 64

    # Step 6: Insurer Reviews and Transitions Claim to Approved
    transition_payload = {
        "new_status": "Approved",
        "remarks": "Automated meteorological telemetry, AI canopy loss (64.5%), and on-chain evidence verified."
    }
    trans_resp = client.post(f"/api/v1/claims/{claim_id}/transition", json=transition_payload, headers=insurer_headers)
    assert trans_resp.status_code == status.HTTP_200_OK
    updated_claim = trans_resp.json()
    assert updated_claim["status"] == "Approved"
    assert updated_claim["approved_amount"] == 135000.0

    # Step 7: Verify Blockchain Distributed Ledger Anchoring
    blockchain_gw = FabricLedgerGateway()
    b_claim = blockchain_gw.anchor_claim_submission(
        claim_number=claim_number,
        farmer_id=target_plot["farmer_id"],
        farm_plot_id=plot_id,
        policy_id=1,
        claimed_amount=135000.0,
        damage_reason="Severe Drought Desiccation",
        damage_event_date="2026-09-24"
    )
    b_trans = blockchain_gw.anchor_state_transition(
        claim_number=claim_number,
        from_state="Submitted",
        to_state="Approved",
        actor_name="Officer Suresh (Insurer)",
        actor_role="Insurer",
        remarks="Parametric threshold verified. Approved payout."
    )
    is_valid, msg = blockchain_gw.verify_ledger_integrity()
    assert is_valid is True
    assert "cryptographically verified" in msg
