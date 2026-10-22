from typing import Optional
from pydantic import BaseModel


class CropCreate(BaseModel):
    crop_code: str
    name: str
    season: str
    cycle_days: int = 120
    min_temp: float = 18.0
    max_temp: float = 38.0
    min_rain: float = 500.0
    soil_type: str = "Loamy Soil"
    moisture_threshold: float = 20.0


class CropResponse(CropCreate):
    id: int
    is_active: bool

    class Config:
        from_attributes = True
