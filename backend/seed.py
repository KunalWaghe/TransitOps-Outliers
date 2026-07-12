import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine, Base
from models.user import Role, User
from models.fuel_log import FuelLog
from models.expense import Expense
from models.vehicle import Vehicle
from services.auth_service import get_password_hash

def seed_db():
    db = SessionLocal()
    
    # 1. Create roles
    roles_data = ["fleet_manager", "dispatcher", "safety_officer", "financial_analyst"]
    roles = {}
    for role_name in roles_data:
        role = db.query(Role).filter(Role.name == role_name).first()
        if not role:
            role = Role(name=role_name, description=f"{role_name.replace('_', ' ').title()}")
            db.add(role)
            db.commit()
            db.refresh(role)
        roles[role_name] = role

    # 2. Create demo users
    users_data = [
        {"email": "admin@transitops.com", "name": "Admin Fleet", "role": "fleet_manager"},
        {"email": "dispatch@transitops.com", "name": "Dispatcher Dan", "role": "dispatcher"},
        {"email": "safety@transitops.com", "name": "Safety Sam", "role": "safety_officer"},
        {"email": "finance@transitops.com", "name": "Finance Fiona", "role": "financial_analyst"},
    ]

    for ud in users_data:
        user = db.query(User).filter(User.email == ud["email"]).first()
        if not user:
            user = User(
                email=ud["email"],
                name=ud["name"],
                password_hash=get_password_hash("password123"),
                role_id=roles[ud["role"]].id
            )
            db.add(user)
    
    db.commit()
    
    # 3. Create demo vehicles (if not exists)
    vehicles_data = [
        {"registration_number": "TRK-001", "name": "Heavy Hauler A", "type": "Truck", "max_capacity_kg": 5000, "acquisition_cost": 45000, "status": "Available"},
        {"registration_number": "VAN-002", "name": "City Sprinter", "type": "Van", "max_capacity_kg": 1500, "acquisition_cost": 25000, "status": "In Shop"}
    ]
    for vd in vehicles_data:
        vehicle = db.query(Vehicle).filter(Vehicle.registration_number == vd["registration_number"]).first()
        if not vehicle:
            vehicle = Vehicle(**vd)
            db.add(vehicle)
    db.commit()

    # 4. Create demo fuel logs and expenses
    vehicle = db.query(Vehicle).first()
    if vehicle:
        if db.query(FuelLog).count() == 0:
            db.add(FuelLog(vehicle_id=vehicle.id, liters=50.5, cost=120.0, odometer_km=15000))
            db.add(FuelLog(vehicle_id=vehicle.id, liters=40.0, cost=95.0, odometer_km=15400))
        if db.query(Expense).count() == 0:
            db.add(Expense(vehicle_id=vehicle.id, category="Maintenance", amount=350.0, description="Oil change"))
            db.add(Expense(vehicle_id=vehicle.id, category="Toll", amount=15.5, description="Highway toll"))
        db.commit()
        
    db.close()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_db()
