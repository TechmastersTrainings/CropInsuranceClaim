from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.models.crop import CropRegistry
from backend.app.models.policy import InsurancePolicy
from backend.app.schemas.user import UserResponse
from backend.app.schemas.crop import CropCreate, CropResponse
from backend.app.schemas.policy import PolicyCreate, PolicyResponse
from backend.app.api.deps import require_admin

router = APIRouter(prefix="/admin", tags=["System Administration"])


@router.post("/crops", response_model=CropResponse, status_code=status.HTTP_201_CREATED)
def add_crop_config(
    crop_in: CropCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Section 5: Provisions new crop varieties and agronomic parameters into the registry."""
    existing = db.query(CropRegistry).filter(CropRegistry.crop_code == crop_in.crop_code).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Crop code already exists")
        
    crop = CropRegistry(
        crop_code=crop_in.crop_code,
        name=crop_in.name,
        season=crop_in.season,
        cycle_days=crop_in.cycle_days,
        min_temp=crop_in.min_temp,
        max_temp=crop_in.max_temp,
        min_rain=crop_in.min_rain,
        soil_type=crop_in.soil_type,
        moisture_threshold=crop_in.moisture_threshold,
        is_active=True
    )
    db.add(crop)
    db.commit()
    db.refresh(crop)
    return crop


@router.post("/policies", response_model=PolicyResponse, status_code=status.HTTP_201_CREATED)
def publish_policy_template(
    pol_in: PolicyCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Publishes a new underwritten parametric insurance policy."""
    policy = InsurancePolicy(
        policy_code=pol_in.policy_code,
        title=pol_in.title,
        underwriter_name=pol_in.underwriter_name,
        license_number=pol_in.license_number,
        crop_name=pol_in.crop_name,
        season=pol_in.season,
        premium_per_acre=pol_in.premium_per_acre,
        coverage_per_acre=pol_in.coverage_per_acre,
        trigger_parameter=pol_in.trigger_parameter,
        deductible_percent=pol_in.deductible_percent,
        valid_until=pol_in.valid_until,
        is_active=True
    )
    db.add(policy)
    db.commit()
    db.refresh(policy)
    return policy


@router.get("/users", response_model=List[UserResponse])
def get_all_users(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Lists all registered platform users for access auditing."""
    return db.query(User).order_by(User.id.asc()).all()
