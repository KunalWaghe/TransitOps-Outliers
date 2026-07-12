from sqlalchemy.orm import Session
from models.driver import Driver, DriverStatus
from schemas.driver import DriverCreate, DriverUpdate
from fastapi import HTTPException
from typing import Optional
from datetime import date

def get_driver(db: Session, driver_id: int):
    return db.query(Driver).filter(Driver.id == driver_id).first()

def get_driver_by_license(db: Session, license_number: str):
    return db.query(Driver).filter(Driver.license_number == license_number).first()

def get_drivers(db: Session, skip: int = 0, limit: int = 20, status: Optional[str] = None, search: Optional[str] = None):
    query = db.query(Driver)
    if status:
        query = query.filter(Driver.status == status)
    if search:
        query = query.filter((Driver.name.ilike(f"%{search}%")) | (Driver.license_number.ilike(f"%{search}%")))
    return query.offset(skip).limit(limit).all()

def get_available_valid_drivers(db: Session):
    today = date.today()
    return db.query(Driver).filter(
        Driver.status == DriverStatus.AVAILABLE,
        Driver.license_expiry >= today
    ).all()

def create_driver(db: Session, driver: DriverCreate):
    db_driver = get_driver_by_license(db, license_number=driver.license_number)
    if db_driver:
        raise HTTPException(status_code=400, detail="License number already registered")
    
    db_item = Driver(**driver.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_driver(db: Session, driver_id: int, driver: DriverUpdate):
    db_item = get_driver(db, driver_id=driver_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Driver not found")
        
    update_data = driver.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_item, key, value)
        
    db.commit()
    db.refresh(db_item)
    return db_item

def delete_driver(db: Session, driver_id: int):
    db_item = get_driver(db, driver_id=driver_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Driver not found")
    
    if db_item.status == DriverStatus.ON_TRIP:
        raise HTTPException(status_code=400, detail="Cannot delete driver currently on a trip")
        
    db.delete(db_item)
    db.commit()
    return db_item
