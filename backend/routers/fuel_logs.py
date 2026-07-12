from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from database import SessionLocal
from dependencies import get_db, get_current_user
from models.fuel_log import FuelLog
from models.user import User
from schemas.fuel_log import FuelLogCreate, FuelLogResponse

router = APIRouter(prefix="/api/fuel-logs", tags=["fuel-logs"])

@router.get("", response_model=List[FuelLogResponse])
def get_fuel_logs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(FuelLog).all()

@router.post("", response_model=FuelLogResponse)
def create_fuel_log(log: FuelLogCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_log = FuelLog(**log.model_dump())
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log
