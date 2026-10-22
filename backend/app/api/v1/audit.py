from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.models.audit import AuditLog, Notification
from backend.app.schemas.audit import AuditLogResponse, NotificationResponse
from backend.app.api.deps import get_current_user

router = APIRouter(tags=["Audit & Notifications"])


@router.get("/audit/logs", response_model=List[AuditLogResponse])
def get_audit_logs(
    limit: int = 100,
    actor_email: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Retrieves immutable system audit records with optional actor filter."""
    query = db.query(AuditLog)
    if actor_email:
        query = query.filter(AuditLog.actor_email.ilike(f"%{actor_email}%"))
    return query.order_by(AuditLog.id.desc()).limit(limit).all()


@router.get("/notifications", response_model=List[NotificationResponse])
def get_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves operational notices and extreme weather anomaly alerts."""
    return db.query(Notification).order_by(Notification.id.desc()).limit(30).all()


@router.patch("/notifications/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db)
):
    """Marks a notification alert as read."""
    notif = db.query(Notification).filter(Notification.id == notification_id).first()
    if notif:
        notif.is_read = True
        db.commit()
    return {"status": "success"}
