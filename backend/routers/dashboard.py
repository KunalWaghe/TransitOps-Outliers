from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import SessionLocal
from dependencies import get_db, get_current_user
from models.trip import Trip
from models.expense import Expense
from models.fuel_log import FuelLog
from models.vehicle import Vehicle
from models.user import User

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/kpis")
def get_dashboard_kpis(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    active_trips = db.query(Trip).filter(Trip.status == "Dispatched").count()
    pending_trips = db.query(Trip).filter(Trip.status == "Draft").count()
    
    total_expenses = db.query(func.sum(Expense.amount)).scalar() or 0.0
    total_fuel_cost = db.query(func.sum(FuelLog.cost)).scalar() or 0.0
    
    active_vehicles = db.query(Vehicle).filter(Vehicle.status == "Available").count()
    
    return {
        "active_trips": active_trips,
        "pending_trips": pending_trips,
        "total_expenses": float(total_expenses),
        "total_fuel_cost": float(total_fuel_cost),
        "active_vehicles": active_vehicles
    }
