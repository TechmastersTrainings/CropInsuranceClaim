from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.models.user import User, UserRole
from backend.app.models.farm import FarmPlot
from backend.app.models.crop import CropRegistry
from backend.app.schemas.farm import FarmCreate, FarmResponse
from backend.app.schemas.crop import CropResponse
from backend.app.api.deps import get_current_user, require_farmer

router = APIRouter(tags=["Farms & Crops"])


@router.get("/farms", response_model=List[FarmResponse])
def get_farms(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves farm plots. Farmers access their own plots; Insurers and Admins access all registered plots."""
    if current_user.role in [UserRole.INSURER, UserRole.ADMIN, UserRole.AUDITOR]:
        return db.query(FarmPlot).order_by(FarmPlot.id.desc()).all()
    return db.query(FarmPlot).filter(FarmPlot.farmer_id == current_user.id).order_by(FarmPlot.id.desc()).all()


@router.post("/farms", response_model=FarmResponse, status_code=status.HTTP_201_CREATED)
def create_farm(
    farm_in: FarmCreate,
    current_user: User = Depends(require_farmer),
    db: Session = Depends(get_db)
):
    """Registers a new farm plot linked to the authenticated farmer."""
    new_farm = FarmPlot(
        farmer_id=current_user.id,
        name=farm_in.name,
        survey_number=farm_in.survey_number,
        area_acres=farm_in.area_acres,
        village=farm_in.village,
        taluk=farm_in.taluk,
        district=farm_in.district,
        state=farm_in.state,
        latitude=farm_in.latitude,
        longitude=farm_in.longitude,
        soil_type=farm_in.soil_type,
        irrigation_type=farm_in.irrigation_type,
        active_crop_name=farm_in.active_crop_name
    )
    db.add(new_farm)
    db.commit()
    db.refresh(new_farm)
    return new_farm


@router.get("/farms/{farm_id}", response_model=FarmResponse)
def get_farm_by_id(
    farm_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves a single farm plot by identifier with tenant ownership enforcement."""
    farm = db.query(FarmPlot).filter(FarmPlot.id == farm_id).first()
    if not farm:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farm plot not found")
    if current_user.role == UserRole.FARMER and farm.farmer_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access to other farmer's plot forbidden")
    return farm


@router.get("/crops", response_model=List[CropResponse])
def get_crops(db: Session = Depends(get_db)):
    """Retrieves all active crops from the multi-crop agronomic registry."""
    return db.query(CropRegistry).filter(CropRegistry.is_active == True).order_by(CropRegistry.id.asc()).all()


@router.get("/crops/{crop_name}/agronomic-profile")
def get_crop_agronomic_profile(crop_name: str):
    """Retrieves agronomic stage vulnerability and parametric trigger thresholds for the specified crop."""
    from backend.app.core.agronomic_rules import get_crop_profile
    return get_crop_profile(crop_name)

