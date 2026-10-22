from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from backend.app.db.base import Base


class AuditLog(Base):
    __tablename__ = "system_audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    actor_email = Column(String(255), nullable=False, index=True)
    actor_role = Column(String(50), nullable=False)
    action = Column(String(150), nullable=False)
    target_entity = Column(String(150), nullable=False)
    ip_address = Column(String(50), default="127.0.0.1")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)


class Notification(Base):
    __tablename__ = "system_notifications"

    id = Column(Integer, primary_key=True, index=True)
    recipient_role = Column(String(50), default="ALL")
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), default="info")
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class BlockchainBlockRecord(Base):
    __tablename__ = "blockchain_blocks"

    id = Column(Integer, primary_key=True, index=True)
    block_number = Column(Integer, unique=True, index=True, nullable=False)
    tx_hash = Column(String(255), unique=True, index=True, nullable=False)
    channel_name = Column(String(100), default="cropinsurancechannel")
    event_name = Column(String(100), nullable=False)
    claim_number = Column(String(100), nullable=False, index=True)
    endorser_msp = Column(String(150), default="Org1MSP, Org2MSP")
    status = Column(String(50), default="VALID")
    timestamp = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
