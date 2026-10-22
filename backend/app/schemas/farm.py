from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class FarmCreate(BaseModel):
    name: str
    survey_number: str
    area_acres: float
    village: str
    taluk: Optional[str] = "Navalgund"
    district: Optional[str] = "Dharwad"
    state: Optional[str] = "Karnataka"
    latitude: Optional[float] = 15.3647
    longitude: Optional[float] = 75.1240
    soil_type: Optional[str] = "Black Cotton Soil"
    irrigation_type: Optional[str] = "Borewell + Drip"
    active_crop_name: Optional[str] = "Cotton"


class FarmResponse(FarmCreate):
    id: int
    farmer_id: int
    document_ref: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
