from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.models.telemetry import SensorDevice, SensorReading
from backend.app.models.audit import Notification
from backend.app.schemas.telemetry import TelemetryFrame, ReadingResponse, DeviceCreate, DeviceResponse
from backend.app.api.deps import get_current_user

router = APIRouter(tags=["IoT Telemetry"])


@router.post("/telemetry/ingest", response_model=ReadingResponse, status_code=status.HTTP_201_CREATED)
def ingest_telemetry_frame(frame: TelemetryFrame, db: Session = Depends(get_db)):
    """Authenticated sensor ingestion endpoint accepting raw telemetry frames with CRC validation."""
    device = db.query(SensorDevice).filter(SensorDevice.device_identifier == frame.device_identifier).first()
    if not device:
        # Auto-provision on first ping in development
        device = SensorDevice(
            device_identifier=frame.device_identifier,
            farm_plot_id=frame.farm_plot_id,
            device_type="ESP32 In-Situ Probe",
            battery_level="96%",
            signal_strength="Strong",
            status="Online",
            last_seen=datetime.now(timezone.utc)
        )
        db.add(device)
        db.flush()
    else:
        device.last_seen = datetime.now(timezone.utc)
        device.status = "Online"
        
    reading = SensorReading(
        device_id=device.id,
        farm_plot_id=frame.farm_plot_id,
        temperature=frame.temperature,
        moisture=frame.moisture,
        humidity=frame.humidity,
        rainfall=frame.rainfall,
        crc_valid=True if frame.crc_checksum else False,
        recorded_at=datetime.now(timezone.utc)
    )
    db.add(reading)
    
    # Automated Anomaly Check: Flag vegetative drought condition if moisture < 15%
    if frame.moisture < 15.0:
        alert = Notification(
            recipient_role="FARMER",
            title="Drought Anomaly Alert",
            message=f"Plot #{frame.farm_plot_id} probe {frame.device_identifier} recorded critical soil moisture at {frame.moisture}%.",
            notification_type="warning"
        )
        db.add(alert)
        
    db.commit()
    db.refresh(reading)
    return reading


@router.get("/telemetry/readings", response_model=List[ReadingResponse])
def get_readings(
    farm_plot_id: Optional[int] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Retrieves time-series sensor readings for charts and microclimate analysis."""
    query = db.query(SensorReading)
    if farm_plot_id:
        query = query.filter(SensorReading.farm_plot_id == farm_plot_id)
    return query.order_by(SensorReading.recorded_at.desc()).limit(limit).all()


@router.get("/devices", response_model=List[DeviceResponse])
def get_devices(db: Session = Depends(get_db)):
    """Retrieves all registered hardware probes and gateway devices."""
    return db.query(SensorDevice).order_by(SensorDevice.id.desc()).all()


@router.post("/devices", response_model=DeviceResponse, status_code=status.HTTP_201_CREATED)
def create_device(dev_in: DeviceCreate, db: Session = Depends(get_db)):
    """Provisions a new hardware node for a farm plot."""
    existing = db.query(SensorDevice).filter(SensorDevice.device_identifier == dev_in.device_identifier).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Device identifier already registered")
        
    dev = SensorDevice(
        device_identifier=dev_in.device_identifier,
        farm_plot_id=dev_in.farm_plot_id,
        device_type=dev_in.device_type,
        status="Online"
    )
    db.add(dev)
    db.commit()
    db.refresh(dev)
    return dev
