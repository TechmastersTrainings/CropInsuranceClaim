from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Date
from sqlalchemy.orm import relationship
from backend.app.db.base import Base


class FarmPlot(Base):
    __tablename__ = "farm_plots"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(200), nullable=False)
    survey_number = Column(String(100), index=True, nullable=False)
    area_acres = Column(Float, nullable=False, default=1.0)
    village = Column(String(100), nullable=False)
    taluk = Column(String(100), default="Navalgund")
    district = Column(String(100), default="Dharwad")
    state = Column(String(100), default="Karnataka")
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    soil_type = Column(String(100), default="Black Cotton Soil")
    irrigation_type = Column(String(100), default="Borewell + Drip")
    active_crop_name = Column(String(100), default="Cotton")
    document_ref = Column(String(255), default="DOC-LAND-VERIFIED.pdf")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    farmer = relationship("User", back_populates="farms")
    claims = relationship("Claim", back_populates="farm_plot")
    devices = relationship("SensorDevice", back_populates="farm_plot")
    enrollments = relationship("PolicyEnrollment", back_populates="farm_plot")
