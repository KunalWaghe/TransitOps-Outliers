from sqlalchemy.orm import Session
from models.trip import Trip, TripStatus
from models.vehicle import Vehicle, VehicleStatus
from models.driver import Driver, DriverStatus
from schemas.trip import TripCreate, TripComplete
from fastapi import HTTPException
from typing import Optional
from datetime import datetime, date

def get_trips(db: Session, skip: int = 0, limit: int = 20, status: Optional[str] = None):
    query = db.query(Trip)
    if status:
        query = query.filter(Trip.status == status)
    return query.offset(skip).limit(limit).all()

def get_trip(db: Session, trip_id: int):
    return db.query(Trip).filter(Trip.id == trip_id).first()

def create_trip(db: Session, trip: TripCreate):
    # Validate vehicle
    vehicle = db.query(Vehicle).filter(Vehicle.id == trip.vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    if vehicle.status != VehicleStatus.AVAILABLE:
        raise HTTPException(status_code=400, detail="Vehicle is not available for a trip")
    if trip.cargo_weight_kg > vehicle.max_capacity_kg:
        raise HTTPException(status_code=400, detail="Cargo weight exceeds vehicle capacity")
        
    # Validate driver
    driver = db.query(Driver).filter(Driver.id == trip.driver_id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    if driver.status != DriverStatus.AVAILABLE:
        raise HTTPException(status_code=400, detail="Driver is not available for a trip")
    if driver.license_expiry < date.today():
        raise HTTPException(status_code=400, detail="Driver license is expired")
        
    db_trip = Trip(**trip.model_dump())
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return db_trip

def dispatch_trip(db: Session, trip_id: int):
    trip = get_trip(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if trip.status != TripStatus.DRAFT:
        raise HTTPException(status_code=400, detail="Only Draft trips can be dispatched")
        
    vehicle = db.query(Vehicle).filter(Vehicle.id == trip.vehicle_id).first()
    driver = db.query(Driver).filter(Driver.id == trip.driver_id).first()
    
    if vehicle.status != VehicleStatus.AVAILABLE:
        raise HTTPException(status_code=409, detail="Vehicle is no longer available")
    if driver.status != DriverStatus.AVAILABLE:
        raise HTTPException(status_code=409, detail="Driver is no longer available")
        
    trip.status = TripStatus.DISPATCHED
    trip.dispatched_at = datetime.utcnow()
    vehicle.status = VehicleStatus.ON_TRIP
    driver.status = DriverStatus.ON_TRIP
    
    db.commit()
    db.refresh(trip)
    return trip

def complete_trip(db: Session, trip_id: int, complete_data: TripComplete):
    trip = get_trip(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if trip.status != TripStatus.DISPATCHED:
        raise HTTPException(status_code=400, detail="Only Dispatched trips can be completed")
        
    trip.status = TripStatus.COMPLETED
    trip.completed_at = datetime.utcnow()
    trip.actual_distance_km = complete_data.actual_distance_km
    trip.fuel_consumed_liters = complete_data.fuel_consumed_liters
    
    vehicle = db.query(Vehicle).filter(Vehicle.id == trip.vehicle_id).first()
    driver = db.query(Driver).filter(Driver.id == trip.driver_id).first()
    
    if vehicle:
        vehicle.status = VehicleStatus.AVAILABLE
        # Also update vehicle odometer
        vehicle.odometer_km += complete_data.actual_distance_km
    if driver:
        driver.status = DriverStatus.AVAILABLE
        
    db.commit()
    db.refresh(trip)
    return trip

def cancel_trip(db: Session, trip_id: int):
    trip = get_trip(db, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if trip.status in [TripStatus.COMPLETED, TripStatus.CANCELLED]:
        raise HTTPException(status_code=400, detail="Trip cannot be cancelled")
        
    was_dispatched = trip.status == TripStatus.DISPATCHED
    trip.status = TripStatus.CANCELLED
    
    if was_dispatched:
        vehicle = db.query(Vehicle).filter(Vehicle.id == trip.vehicle_id).first()
        driver = db.query(Driver).filter(Driver.id == trip.driver_id).first()
        
        if vehicle and vehicle.status == VehicleStatus.ON_TRIP:
            vehicle.status = VehicleStatus.AVAILABLE
        if driver and driver.status == DriverStatus.ON_TRIP:
            driver.status = DriverStatus.AVAILABLE
            
    db.commit()
    db.refresh(trip)
    return trip
