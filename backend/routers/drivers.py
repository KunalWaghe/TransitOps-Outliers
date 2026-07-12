from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from dependencies import get_db
from dependencies import get_current_user
from schemas.driver import DriverCreate, DriverUpdate, DriverResponse
from services import driver_service
from models.user import User

router = APIRouter(
    prefix="/api/drivers",
    tags=["drivers"],
    responses={404: {"description": "Not found"}},
)

def require_fleet_or_safety(current_user: User = Depends(get_current_user)):
    if current_user.role.name not in ["fleet_manager", "safety_officer"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user

def require_fleet_manager(current_user: User = Depends(get_current_user)):
    if current_user.role.name != "fleet_manager":
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user

@router.get("/available", response_model=List[DriverResponse])
def read_available_drivers(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Used for dispatch dropdown
    return driver_service.get_available_valid_drivers(db)

@router.get("/", response_model=List[DriverResponse])
def read_drivers(
    skip: int = 0, 
    limit: int = 20, 
    status: Optional[str] = None, 
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return driver_service.get_drivers(db, skip=skip, limit=limit, status=status, search=search)

@router.get("/{driver_id}", response_model=DriverResponse)
def read_driver(driver_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_driver = driver_service.get_driver(db, driver_id=driver_id)
    if db_driver is None:
        raise HTTPException(status_code=404, detail="Driver not found")
    return db_driver

@router.post("/", response_model=DriverResponse)
def create_driver(driver: DriverCreate, db: Session = Depends(get_db), current_user: User = Depends(require_fleet_or_safety)):
    return driver_service.create_driver(db=db, driver=driver)

@router.put("/{driver_id}", response_model=DriverResponse)
def update_driver(driver_id: int, driver: DriverUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_fleet_or_safety)):
    return driver_service.update_driver(db=db, driver_id=driver_id, driver=driver)

@router.delete("/{driver_id}", response_model=DriverResponse)
def delete_driver(driver_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_fleet_manager)):
    return driver_service.delete_driver(db=db, driver_id=driver_id)
