from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from backend.app.db.base import Base


class CropRegistry(Base):
    __tablename__ = "crop_registry"

    id = Column(Integer, primary_key=True, index=True)
    crop_code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), unique=True, index=True, nullable=False)
    season = Column(String(50), nullable=False)
    cycle_days = Column(Integer, nullable=False, default=120)
    min_temp = Column(Float, default=18.0)
    max_temp = Column(Float, default=38.0)
    min_rain = Column(Float, default=500.0)
    soil_type = Column(String(150), default="Loamy Soil")
    moisture_threshold = Column(Float, default=20.0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
