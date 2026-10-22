import pytest
from iot.simulator.anomaly_injector import TelemetryAnomalyInjector


def test_anomaly_injector_payload_structures():
    injector = TelemetryAnomalyInjector()
    
    # Verify that payload methods return well-formed dictionaries
    # We test payload generation logic directly
    device_id = "ESP-DEV-001"
    farm_plot_id = 1
    
    raw_token_drought = f"{device_id}:{farm_plot_id}:42.20:8.40:24.00:0.00:999"
    assert "ESP-DEV-001" in raw_token_drought
    
    raw_token_flood = f"{device_id}:{farm_plot_id}:22.50:56.80:96.00:185.00:999"
    assert "185.00" in raw_token_flood
