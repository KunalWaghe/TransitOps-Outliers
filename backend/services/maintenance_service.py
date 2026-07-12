from sqlalchemy.orm import Session
from models.maintenance import MaintenanceLog, MaintenanceStatus
from models.vehicle import Vehicle, VehicleStatus
from schemas.maintenance import MaintenanceCreate
from fastapi import HTTPException
from typing import Optional
from datetime import datetime

def get_maintenance_logs(db: Session, skip: int = 0, limit: int = 20, vehicle_id: Optional[int] = None, status: Optional[str] = None):
    query = db.query(MaintenanceLog)
    if vehicle_id:
        query = query.filter(MaintenanceLog.vehicle_id == vehicle_id)
    if status:
        query = query.filter(MaintenanceLog.status == status)
    return query.offset(skip).limit(limit).all()

def get_maintenance_log(db: Session, log_id: int):
    return db.query(MaintenanceLog).filter(MaintenanceLog.id == log_id).first()

def create_maintenance_log(db: Session, maintenance: MaintenanceCreate):
    vehicle = db.query(Vehicle).filter(Vehicle.id == maintenance.vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
        
    db_item = MaintenanceLog(**maintenance.model_dump())
    db.add(db_item)
    
    # BR9: Pull from dispatch pool -> In Shop
    if vehicle.status != VehicleStatus.RETIRED:
        vehicle.status = VehicleStatus.IN_SHOP
        
    db.commit()
    db.refresh(db_item)
    return db_item

def close_maintenance_log(db: Session, log_id: int):
    log = get_maintenance_log(db, log_id)
    if not log:
        raise HTTPException(status_code=404, detail="Maintenance log not found")
    if log.status == MaintenanceStatus.CLOSED:
        raise HTTPException(status_code=400, detail="Maintenance log is already closed")
        
    log.status = MaintenanceStatus.CLOSED
    log.closed_at = datetime.utcnow()
    
    # BR10: Restore to Available (unless Retired)
    vehicle = db.query(Vehicle).filter(Vehicle.id == log.vehicle_id).first()
    if vehicle and vehicle.status == VehicleStatus.IN_SHOP:
        # Check if there are other active maintenance logs for this vehicle
        active_logs = db.query(MaintenanceLog).filter(
            MaintenanceLog.vehicle_id == vehicle.id, 
            MaintenanceLog.status == MaintenanceStatus.ACTIVE,
            MaintenanceLog.id != log.id
        ).count()
        
        if active_logs == 0:
            vehicle.status = VehicleStatus.AVAILABLE
            
    db.commit()
    db.refresh(log)
    return log
