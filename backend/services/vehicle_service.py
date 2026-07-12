from sqlalchemy.orm import Session
from models.vehicle import Vehicle, VehicleStatus
from schemas.vehicle import VehicleCreate, VehicleUpdate
from fastapi import HTTPException
from typing import Optional

def get_vehicle(db: Session, vehicle_id: int):
    return db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()

def get_vehicle_by_registration(db: Session, reg_number: str):
    return db.query(Vehicle).filter(Vehicle.registration_number == reg_number).first()

def get_vehicles(db: Session, skip: int = 0, limit: int = 20, status: Optional[str] = None, type: Optional[str] = None, search: Optional[str] = None):
    query = db.query(Vehicle)
    if status:
        query = query.filter(Vehicle.status == status)
    if type:
        query = query.filter(Vehicle.type == type)
    if search:
        query = query.filter((Vehicle.name.ilike(f"%{search}%")) | (Vehicle.registration_number.ilike(f"%{search}%")))
    return query.offset(skip).limit(limit).all()

def create_vehicle(db: Session, vehicle: VehicleCreate):
    db_vehicle = get_vehicle_by_registration(db, reg_number=vehicle.registration_number)
    if db_vehicle:
        raise HTTPException(status_code=400, detail="Registration number already registered")
    
    db_item = Vehicle(**vehicle.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_vehicle(db: Session, vehicle_id: int, vehicle: VehicleUpdate):
    db_item = get_vehicle(db, vehicle_id=vehicle_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Vehicle not found")
        
    update_data = vehicle.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_item, key, value)
        
    db.commit()
    db.refresh(db_item)
    return db_item

def delete_vehicle(db: Session, vehicle_id: int):
    db_item = get_vehicle(db, vehicle_id=vehicle_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    if db_item.status == VehicleStatus.ON_TRIP:
        raise HTTPException(status_code=400, detail="Cannot delete vehicle currently on a trip")
        
    db.delete(db_item)
    db.commit()
    return db_item
