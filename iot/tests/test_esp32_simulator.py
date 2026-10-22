import pytest
from iot.simulator.esp32_simulator import ESP32DeviceSimulator, AgronomicScenario


def test_esp32_crc32_format_and_consistency():
    device = ESP32DeviceSimulator("ESP-TEST-001", farm_plot_id=1)
    payload_str = "ESP-TEST-001:1:28.50:24.00:60.00:0.00:1"
    crc1 = device.calculate_crc32(payload_str)
    crc2 = device.calculate_crc32(payload_str)
    
    assert crc1.startswith("CRC32-")
    assert len(crc1) == 14  # 'CRC32-' + 8 hex chars
    assert crc1 == crc2


def test_esp32_reading_scenarios():
    # Normal Scenario
    dev_normal = ESP32DeviceSimulator("ESP-NORM-01", scenario=AgronomicScenario.NORMAL)
    frame_norm = dev_normal.simulate_telemetry_reading()
    assert 15.0 <= frame_norm["temperature"] <= 40.0
    assert 15.0 <= frame_norm["moisture"] <= 45.0
    assert frame_norm["sequence_number"] == 1
    
    # Drought Scenario
    dev_drought = ESP32DeviceSimulator("ESP-DRT-01", scenario=AgronomicScenario.DROUGHT)
    frame_drt = dev_drought.simulate_telemetry_reading()
    assert frame_drt["temperature"] >= 34.0
    assert frame_drt["moisture"] <= 20.0
    assert frame_drt["rainfall"] == 0.0
    
    # Flood Scenario
    dev_flood = ESP32DeviceSimulator("ESP-FLD-01", scenario=AgronomicScenario.FLOOD)
    frame_fld = dev_flood.simulate_telemetry_reading()
    assert frame_fld["rainfall"] > 30.0
    assert frame_fld["moisture"] >= 45.0
    assert frame_fld["humidity"] >= 85.0


def test_esp32_offline_buffering():
    device = ESP32DeviceSimulator("ESP-OFFLINE-01", farm_plot_id=1)
    device.is_connected = False  # Simulate cellular / WiFi dropout
    
    frame1 = device.simulate_telemetry_reading()
    frame2 = device.simulate_telemetry_reading()
    
    sent1 = device.transmit_frame(frame1)
    sent2 = device.transmit_frame(frame2)
    
    assert sent1 is False
    assert sent2 is False
    assert len(device.offline_buffer) == 2
    assert device.offline_buffer[0]["sequence_number"] == 1
    assert device.offline_buffer[1]["sequence_number"] == 2
