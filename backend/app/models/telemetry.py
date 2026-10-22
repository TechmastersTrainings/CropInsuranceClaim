from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from backend.app.db.base import Base


class SensorDevice(Base):
    __tablename__ = "sensor_devices"

    id = Column(Integer, primary_key=True, index=True)
    device_identifier = Column(String(100), unique=True, index=True, nullable=False)
    farm_plot_id = Column(Integer, ForeignKey("farm_plots.id"), nullable=False, index=True)
    device_type = Column(String(100), default="ESP32 Multi-Probe")
    battery_level = Column(String(20), default="95%")
    signal_strength = Column(String(50), default="Strong (WiFi)")
    status = Column(String(50), default="Online", index=True)
    auth_token_hash = Column(String(255), nullable=True)
    last_seen = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    farm_plot = relationship("FarmPlot", back_populates="devices")
    readings = relationship("SensorReading", back_populates="device", cascade="all, delete-orphan")


class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("sensor_devices.id"), nullable=False, index=True)
    farm_plot_id = Column(Integer, nullable=False, index=True)
    temperature = Column(Float, nullable=False)
    moisture = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    rainfall = Column(Float, default=0.0)
    crc_valid = Column(Boolean, default=True)
    recorded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    device = relationship("SensorDevice", back_populates="readings")
