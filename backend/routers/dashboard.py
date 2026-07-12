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

@router.get("/charts")
def get_dashboard_charts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    utilization_data = []
    statuses = db.query(Vehicle.status, func.count(Vehicle.id)).group_by(Vehicle.status).all()
    for status, count in statuses:
        utilization_data.append({"name": status, "value": count})
        
    expense_data = []
    categories = db.query(Expense.category, func.sum(Expense.amount)).group_by(Expense.category).all()
    for category, total in categories:
        expense_data.append({"name": category, "value": float(total) if total else 0})
        
    trend_data = []
    recent_expenses = db.query(Expense).order_by(Expense.date.desc()).limit(7).all()
    for exp in reversed(recent_expenses):
        trend_data.append({
            "name": exp.date.strftime("%b %d"),
            "Expense": float(exp.amount),
            "Fuel": 0
        })
        
    return {
        "utilization": utilization_data,
        "expensesByCategory": expense_data,
        "trend": trend_data
    }

@router.get("/vehicle-metrics")
def get_vehicle_metrics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    vehicles = db.query(Vehicle).all()
    metrics = []
    
    for v in vehicles:
        total_revenue = sum([t.revenue for t in v.trips if t.revenue is not None])
        total_distance = sum([t.actual_distance_km for t in v.trips if t.actual_distance_km is not None])
        total_fuel_liters = sum([t.fuel_consumed_liters for t in v.trips if t.fuel_consumed_liters is not None])
        
        fuel_efficiency = (total_distance / total_fuel_liters) if total_fuel_liters > 0 else 0
        
        total_fuel_cost = sum([f.cost for f in v.fuel_logs if f.cost is not None])
        total_maintenance = sum([m.cost for m in v.maintenance_logs if m.cost is not None])
        total_maintenance += sum([e.amount for e in v.expenses if e.category.lower() == "maintenance" and e.amount is not None])
        
        roi = 0
        if v.acquisition_cost and v.acquisition_cost > 0:
            roi = (total_revenue - (total_maintenance + total_fuel_cost)) / v.acquisition_cost
            
        metrics.append({
            "vehicle_id": v.id,
            "registration_number": v.registration_number,
            "name": v.name,
            "type": v.type,
            "fuel_efficiency_km_per_l": round(fuel_efficiency, 2),
            "total_revenue": round(total_revenue, 2),
            "operational_cost": round(total_maintenance + total_fuel_cost, 2),
            "roi_percentage": round(roi * 100, 2)
        })
        
    return sorted(metrics, key=lambda x: x["roi_percentage"], reverse=True)
