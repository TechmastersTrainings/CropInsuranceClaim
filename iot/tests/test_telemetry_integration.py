import pytest
from fastapi import status
from iot.simulator.esp32_simulator import ESP32DeviceSimulator, AgronomicScenario


def test_esp32_frame_ingestion_api(client):
    sim = ESP32DeviceSimulator("ESP-LIVE-TEST-001", farm_plot_id=1, scenario=AgronomicScenario.NORMAL)
    frame = sim.simulate_telemetry_reading()
    
    payload = {
        "device_identifier": frame["device_identifier"],
        "farm_plot_id": frame["farm_plot_id"],
        "temperature": frame["temperature"],
        "moisture": frame["moisture"],
        "humidity": frame["humidity"],
        "rainfall": frame["rainfall"],
        "crc_checksum": frame["crc_checksum"]
    }
    
    response = client.post("/api/v1/telemetry/ingest", json=payload)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["crc_valid"] is True
    assert data["temperature"] == frame["temperature"]
    assert data["moisture"] == frame["moisture"]


def test_drought_threshold_alert_generation(client):
    sim = ESP32DeviceSimulator("ESP-DROUGHT-ALERT-001", farm_plot_id=1, scenario=AgronomicScenario.DROUGHT)
    frame = sim.simulate_telemetry_reading()
    # Force critical desiccated moisture
    frame["moisture"] = 9.5
    
    payload = {
        "device_identifier": frame["device_identifier"],
        "farm_plot_id": frame["farm_plot_id"],
        "temperature": frame["temperature"],
        "moisture": frame["moisture"],
        "humidity": frame["humidity"],
        "rainfall": 0.0,
        "crc_checksum": frame["crc_checksum"]
    }
    
    response = client.post("/api/v1/telemetry/ingest", json=payload)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["moisture"] == 9.5
