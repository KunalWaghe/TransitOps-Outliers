from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from dependencies import get_current_user
from schemas.maintenance import MaintenanceCreate, MaintenanceResponse
from services import maintenance_service
from models.user import User

router = APIRouter(
    prefix="/api/maintenance",
    tags=["maintenance"],
    responses={404: {"description": "Not found"}},
)

def require_fleet_manager(current_user: User = Depends(get_current_user)):
    if current_user.role.name != "fleet_manager":
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user

@router.get("/", response_model=List[MaintenanceResponse])
def read_maintenance_logs(
    skip: int = 0, 
    limit: int = 20, 
    vehicle_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return maintenance_service.get_maintenance_logs(db, skip=skip, limit=limit, vehicle_id=vehicle_id, status=status)

@router.post("/", response_model=MaintenanceResponse)
def create_maintenance_log(maintenance: MaintenanceCreate, db: Session = Depends(get_db), current_user: User = Depends(require_fleet_manager)):
    return maintenance_service.create_maintenance_log(db=db, maintenance=maintenance)

@router.post("/{log_id}/close", response_model=MaintenanceResponse)
def close_maintenance_log(log_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_fleet_manager)):
    return maintenance_service.close_maintenance_log(db=db, log_id=log_id)
