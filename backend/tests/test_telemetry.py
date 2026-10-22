import pytest
from fastapi import status


def test_telemetry_ingestion_and_crc_verification(client):
    payload = {
        "device_identifier": "ESP-DEV-001",
        "farm_plot_id": 1,
        "temperature": 38.6,
        "moisture": 11.4,
        "humidity": 42.0,
        "rainfall": 0.0,
        "crc_checksum": "CRC32-A9F21B"
    }
    response = client.post("/api/v1/telemetry/ingest", json=payload)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["crc_valid"] is True
    assert data["temperature"] == 38.6
    assert data["moisture"] == 11.4


def test_telemetry_readings_query(client):
    response = client.get("/api/v1/telemetry/readings?farm_plot_id=1&limit=10")
    assert response.status_code == status.HTTP_200_OK
    readings = response.json()
    assert isinstance(readings, list)
    assert len(readings) >= 1


def test_device_registry_query(client):
    response = client.get("/api/v1/devices")
    assert response.status_code == status.HTTP_200_OK
    devices = response.json()
    assert len(devices) >= 2
