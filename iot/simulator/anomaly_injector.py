import zlib
import json
import urllib.request
import urllib.error
from typing import Dict, Any


class TelemetryAnomalyInjector:
    """Injects synthetic micro-climate anomalies and malformed frames to validate ingest defenses."""

    def __init__(self, server_url: str = "http://127.0.0.1:8000/api/v1/telemetry/ingest"):
        self.server_url = server_url

    def _post(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        req_data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            self.server_url,
            data=req_data,
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        try:
            with urllib.request.urlopen(req, timeout=3.0) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                return {"status_code": resp.status, "response": data}
        except urllib.error.HTTPError as e:
            try:
                err_data = json.loads(e.read().decode("utf-8"))
            except Exception:
                err_data = {"error": str(e)}
            return {"status_code": e.code, "response": err_data}
        except Exception as e:
            return {"status_code": 500, "response": {"error": str(e)}}

    def inject_flash_flood(self, device_id: str = "ESP-DEV-001", farm_plot_id: int = 1) -> Dict[str, Any]:
        """Injects extreme precipitation spike and waterlogging saturation."""
        raw_token = f"{device_id}:{farm_plot_id}:22.50:56.80:96.00:185.00:999"
        crc = f"CRC32-{zlib.crc32(raw_token.encode('utf-8')) & 0xFFFFFFFF:08X}"
        payload = {
            "device_identifier": device_id,
            "farm_plot_id": farm_plot_id,
            "temperature": 22.5,
            "moisture": 56.8,
            "humidity": 96.0,
            "rainfall": 185.0,
            "crc_checksum": crc
        }
        res = self._post(payload)
        return {"scenario": "FLASH_FLOOD", "payload": payload, "status_code": res["status_code"], "response": res["response"]}

    def inject_severe_drought(self, device_id: str = "ESP-DEV-001", farm_plot_id: int = 1) -> Dict[str, Any]:
        """Injects extreme soil moisture desiccation and heatwave."""
        raw_token = f"{device_id}:{farm_plot_id}:42.20:8.40:24.00:0.00:999"
        crc = f"CRC32-{zlib.crc32(raw_token.encode('utf-8')) & 0xFFFFFFFF:08X}"
        payload = {
            "device_identifier": device_id,
            "farm_plot_id": farm_plot_id,
            "temperature": 42.2,
            "moisture": 8.4,
            "humidity": 24.0,
            "rainfall": 0.0,
            "crc_checksum": crc
        }
        res = self._post(payload)
        return {"scenario": "SEVERE_DROUGHT", "payload": payload, "status_code": res["status_code"], "response": res["response"]}

    def inject_corrupted_crc(self, device_id: str = "ESP-DEV-001", farm_plot_id: int = 1) -> Dict[str, Any]:
        """Injects frame with invalid CRC to verify telemetry integrity rejection."""
        payload = {
            "device_identifier": device_id,
            "farm_plot_id": farm_plot_id,
            "temperature": 27.0,
            "moisture": 25.0,
            "humidity": 60.0,
            "rainfall": 0.0,
            "crc_checksum": "CRC32-CORRUPTED_HEX_DEADBEEF"
        }
        res = self._post(payload)
        return {"scenario": "CORRUPTED_CRC", "payload": payload, "status_code": res["status_code"], "response": res["response"]}


if __name__ == "__main__":
    injector = TelemetryAnomalyInjector()
    print("Testing local anomaly injector payload methods...")
    print("Drought payload:", injector.inject_severe_drought()["payload"])
