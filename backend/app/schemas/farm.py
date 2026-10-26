from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class FarmCreate(BaseModel):
    name: str
    survey_number: str
    area_acres: float
    village: str
    taluk: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    soil_type: Optional[str] = None
    irrigation_type: Optional[str] = None
    active_crop_name: Optional[str] = None


class FarmResponse(FarmCreate):
    id: int
    farmer_id: int
    document_ref: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
