from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class TelemetryFrame(BaseModel):
    device_identifier: str
    farm_plot_id: int
    temperature: float
    moisture: float
    humidity: float
    rainfall: float = 0.0
    crc_checksum: Optional[str] = "CRC32-OK"


class ReadingResponse(BaseModel):
    id: int
    device_id: int
    farm_plot_id: int
    temperature: float
    moisture: float
    humidity: float
    rainfall: float
    crc_valid: bool
    recorded_at: datetime

    class Config:
        from_attributes = True


class DeviceCreate(BaseModel):
    device_identifier: str
    farm_plot_id: int
    device_type: str = "ESP32 Multi-Probe"


class DeviceResponse(BaseModel):
    id: int
    device_identifier: str
    farm_plot_id: int
    device_type: str
    battery_level: str
    signal_strength: str
    status: str
    last_seen: datetime

    class Config:
        from_attributes = True
