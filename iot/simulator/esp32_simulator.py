import os
import time
import math
import zlib
import json
import random
import urllib.request
import urllib.error
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone


class AgronomicScenario:
    NORMAL = "NORMAL"
    DROUGHT = "DROUGHT"
    FLOOD = "FLOOD"
    HEATWAVE = "HEATWAVE"


class ESP32DeviceSimulator:
    """Emulates in-situ ESP32 agro-meteorological ground station firmware.
    
    Features:
    - Diurnal environmental physics modeling (temp, humidity, soil moisture, precipitation)
    - Hardware CRC32 frame checksumming
    - Replay protection with monotonically increasing sequence numbers
    - Store-and-forward offline buffer for intermittent rural connectivity
    - Configurable scenario injection
    """

    def __init__(
        self,
        device_id: str = "ESP-DEV-001",
        farm_plot_id: int = 1,
        scenario: str = AgronomicScenario.NORMAL,
        server_url: str = "http://127.0.0.1:8000/api/v1/telemetry/ingest"
    ):
        self.device_id = device_id
        self.farm_plot_id = farm_plot_id
        self.scenario = scenario
        self.server_url = server_url
        self.sequence_number = 1
        self.offline_buffer: List[Dict[str, Any]] = []
        self.is_connected = True
        self.battery_mv = 4150  # LiPo 4.2V nominal
        self.simulated_hour = 10.0

    @staticmethod
    def calculate_crc32(payload_str: str) -> str:
        """Calculates standard IEEE 802.3 CRC32 checksum."""
        crc = zlib.crc32(payload_str.encode("utf-8")) & 0xFFFFFFFF
        return f"CRC32-{crc:08X}"

    def simulate_telemetry_reading(self) -> Dict[str, Any]:
        """Generates realistic sensor data based on the active scenario and diurnal time."""
        self.simulated_hour = (self.simulated_hour + 0.5) % 24.0
        diurnal_temp_factor = math.sin((self.simulated_hour - 9.0) * math.pi / 12.0)
        
        if self.scenario == AgronomicScenario.DROUGHT:
            # High temp, low humidity, desiccated soil, zero rainfall
            temp = 36.0 + diurnal_temp_factor * 4.5 + random.uniform(-0.5, 0.5)
            moisture = max(6.0, 12.5 - (self.sequence_number * 0.05) + random.uniform(-0.3, 0.3))
            humidity = max(18.0, 32.0 - diurnal_temp_factor * 6.0 + random.uniform(-1.0, 1.0))
            rainfall = 0.0
            
        elif self.scenario == AgronomicScenario.FLOOD:
            # Torrential rainfall, saturated soil, high humidity
            temp = 23.5 + diurnal_temp_factor * 1.5 + random.uniform(-0.4, 0.4)
            moisture = min(58.0, 48.0 + random.uniform(0.0, 5.0))
            humidity = min(98.0, 90.0 + random.uniform(0.0, 5.0))
            rainfall = round(random.uniform(45.0, 110.0), 1)
            
        elif self.scenario == AgronomicScenario.HEATWAVE:
            # Extreme peak temp, low humidity
            temp = 41.5 + diurnal_temp_factor * 4.0 + random.uniform(-0.3, 0.3)
            moisture = max(10.0, 16.0 - (self.sequence_number * 0.04))
            humidity = max(15.0, 25.0 - diurnal_temp_factor * 5.0)
            rainfall = 0.0
            
        else:  # NORMAL
            # Standard temperate diurnal oscillation
            temp = 26.5 + diurnal_temp_factor * 4.0 + random.uniform(-0.5, 0.5)
            moisture = 26.0 + random.uniform(-1.5, 1.5)
            humidity = 65.0 - diurnal_temp_factor * 10.0 + random.uniform(-2.0, 2.0)
            rainfall = round(random.expovariate(1.0 / 1.5), 1) if random.random() < 0.15 else 0.0

        # Discharging battery slightly
        self.battery_mv = max(3300, self.battery_mv - 1)
        
        raw_token = f"{self.device_id}:{self.farm_plot_id}:{temp:.2f}:{moisture:.2f}:{humidity:.2f}:{rainfall:.2f}:{self.sequence_number}"
        crc = self.calculate_crc32(raw_token)
        
        frame = {
            "device_identifier": self.device_id,
            "farm_plot_id": self.farm_plot_id,
            "temperature": round(float(temp), 2),
            "moisture": round(float(moisture), 2),
            "humidity": round(float(humidity), 2),
            "rainfall": round(float(rainfall), 2),
            "crc_checksum": crc,
            "sequence_number": self.sequence_number,
            "battery_millivolts": self.battery_mv,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        self.sequence_number += 1
        return frame

    def transmit_frame(self, frame: Dict[str, Any]) -> bool:
        """Sends telemetry frame to the central ingestion endpoint with offline fallback."""
        if not self.is_connected:
            self.offline_buffer.append(frame)
            return False

        try:
            payload = {
                "device_identifier": frame["device_identifier"],
                "farm_plot_id": frame["farm_plot_id"],
                "temperature": frame["temperature"],
                "moisture": frame["moisture"],
                "humidity": frame["humidity"],
                "rainfall": frame["rainfall"],
                "crc_checksum": frame["crc_checksum"]
            }
            req_data = json.dumps(payload).encode("utf-8")
            req = urllib.request.Request(
                self.server_url,
                data=req_data,
                headers={"Content-Type": "application/json"},
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=3.0) as resp:
                if resp.status == 201:
                    return True
                else:
                    self.offline_buffer.append(frame)
                    return False
        except Exception:
            # Network drop — buffer locally
            self.offline_buffer.append(frame)
            return False

    def flush_offline_buffer(self) -> int:
        """Flushes buffered offline frames upon network link restoration."""
        if not self.offline_buffer:
            return 0
        
        flushed_count = 0
        remaining_buffer = []
        
        for frame in self.offline_buffer:
            try:
                payload = {
                    "device_identifier": frame["device_identifier"],
                    "farm_plot_id": frame["farm_plot_id"],
                    "temperature": frame["temperature"],
                    "moisture": frame["moisture"],
                    "humidity": frame["humidity"],
                    "rainfall": frame["rainfall"],
                    "crc_checksum": frame["crc_checksum"]
                }
                req_data = json.dumps(payload).encode("utf-8")
                req = urllib.request.Request(
                    self.server_url,
                    data=req_data,
                    headers={"Content-Type": "application/json"},
                    method="POST"
                )
                with urllib.request.urlopen(req, timeout=3.0) as resp:
                    if resp.status == 201:
                        flushed_count += 1
                    else:
                        remaining_buffer.append(frame)
            except Exception:
                remaining_buffer.append(frame)

        self.offline_buffer = remaining_buffer
        return flushed_count

    def run_stream(self, count: int = 10, interval_seconds: float = 1.0) -> List[Dict[str, Any]]:
        """Runs an emission stream of sensor frames."""
        emitted = []
        for i in range(count):
            frame = self.simulate_telemetry_reading()
            success = self.transmit_frame(frame)
            status_str = "TRANSMITTED" if success else "BUFFERED_OFFLINE"
            print(f"[{self.device_id} #{frame['sequence_number']}] {frame['temperature']}°C | "
                  f"Moist: {frame['moisture']}% | Rain: {frame['rainfall']}mm | {frame['crc_checksum']} -> {status_str}")
            emitted.append(frame)
            if i < count - 1 and interval_seconds > 0:
                time.sleep(interval_seconds)
        return emitted


def run_fleet_demo():
    print("=== Launching AgriClaim Shield ESP32 Multi-Device Fleet Simulator ===")
    devices = [
        ESP32DeviceSimulator("ESP-DEV-001", farm_plot_id=1, scenario=AgronomicScenario.DROUGHT),
        ESP32DeviceSimulator("ESP-DEV-002", farm_plot_id=2, scenario=AgronomicScenario.FLOOD),
        ESP32DeviceSimulator("ESP-DEV-003", farm_plot_id=3, scenario=AgronomicScenario.NORMAL),
    ]
    
    for cycle in range(3):
        print(f"\n--- Simulation Cycle #{cycle + 1} ---")
        for dev in devices:
            frame = dev.simulate_telemetry_reading()
            ok = dev.transmit_frame(frame)
            state = "OK (Ingested)" if ok else "Locally Buffered"
            print(f"[{dev.device_id} Plot {dev.farm_plot_id}] {dev.scenario}: Temp {frame['temperature']}°C, "
                  f"Moist {frame['moisture']}%, Rain {frame['rainfall']}mm [{state}]")
            time.sleep(0.3)


if __name__ == "__main__":
    run_fleet_demo()
