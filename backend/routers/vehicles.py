from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from dependencies import get_db
from dependencies import get_current_user
from schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleResponse
from services import vehicle_service
from models.user import User
from models.vehicle import VehicleStatus

router = APIRouter(
    prefix="/api/vehicles",
    tags=["vehicles"],
    responses={404: {"description": "Not found"}},
)

def require_fleet_manager(current_user: User = Depends(get_current_user)):
    if current_user.role.name != "fleet_manager":
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user

@router.get("/available", response_model=List[VehicleResponse])
def read_available_vehicles(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Used for dispatch dropdown
    return vehicle_service.get_vehicles(db, status=VehicleStatus.AVAILABLE, limit=1000)

@router.get("/", response_model=List[VehicleResponse])
def read_vehicles(
    skip: int = 0, 
    limit: int = 20, 
    status: Optional[str] = None, 
    type: Optional[str] = None, 
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return vehicle_service.get_vehicles(db, skip=skip, limit=limit, status=status, type=type, search=search)

@router.get("/{vehicle_id}", response_model=VehicleResponse)
def read_vehicle(vehicle_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_vehicle = vehicle_service.get_vehicle(db, vehicle_id=vehicle_id)
    if db_vehicle is None:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return db_vehicle

@router.post("/", response_model=VehicleResponse)
def create_vehicle(vehicle: VehicleCreate, db: Session = Depends(get_db), current_user: User = Depends(require_fleet_manager)):
    return vehicle_service.create_vehicle(db=db, vehicle=vehicle)

@router.put("/{vehicle_id}", response_model=VehicleResponse)
def update_vehicle(vehicle_id: int, vehicle: VehicleUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_fleet_manager)):
    return vehicle_service.update_vehicle(db=db, vehicle_id=vehicle_id, vehicle=vehicle)

@router.delete("/{vehicle_id}", response_model=VehicleResponse)
def delete_vehicle(vehicle_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_fleet_manager)):
    return vehicle_service.delete_vehicle(db=db, vehicle_id=vehicle_id)
