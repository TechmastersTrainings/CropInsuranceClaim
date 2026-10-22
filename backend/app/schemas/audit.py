from datetime import datetime
from pydantic import BaseModel


class AuditLogResponse(BaseModel):
    id: int
    actor_email: str
    actor_role: str
    action: str
    target_entity: str
    ip_address: str
    created_at: datetime

    class Config:
        from_attributes = True


class NotificationResponse(BaseModel):
    id: int
    recipient_role: str
    title: str
    message: str
    notification_type: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class BlockResponse(BaseModel):
    id: int
    block_number: int
    tx_hash: str
    channel_name: str
    event_name: str
    claim_number: str
    endorser_msp: str
    status: str
    timestamp: str

    class Config:
        from_attributes = True
