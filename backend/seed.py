import os
import sys
import random
from datetime import datetime, timedelta

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine, Base
from models.user import Role, User
from models.vehicle import Vehicle, VehicleType, VehicleStatus
from models.driver import Driver, DriverStatus, LicenseCategory
from models.trip import Trip, TripStatus
from models.fuel_log import FuelLog
from models.expense import Expense
from models.maintenance import MaintenanceLog, MaintenanceStatus
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
    
    # 3. Create Demo Vehicles
    vehicles_data = [
        {"registration_number": "TRK-001", "name": "Heavy Hauler A", "type": VehicleType.TRUCK, "max_capacity_kg": 5000, "acquisition_cost": 45000, "status": VehicleStatus.AVAILABLE, "region": "North", "odometer_km": 15000},
        {"registration_number": "VAN-002", "name": "City Sprinter", "type": VehicleType.VAN, "max_capacity_kg": 1500, "acquisition_cost": 25000, "status": VehicleStatus.IN_SHOP, "region": "South", "odometer_km": 8400},
        {"registration_number": "BUS-003", "name": "Transit Bus X", "type": VehicleType.TRUCK, "max_capacity_kg": 8000, "acquisition_cost": 85000, "status": VehicleStatus.ON_TRIP, "region": "East", "odometer_km": 42000},
        {"registration_number": "SDN-004", "name": "Exec Sedan 1", "type": VehicleType.VAN, "max_capacity_kg": 400, "acquisition_cost": 30000, "status": VehicleStatus.AVAILABLE, "region": "West", "odometer_km": 1200},
        {"registration_number": "TRK-005", "name": "Heavy Hauler B", "type": VehicleType.TRUCK, "max_capacity_kg": 5000, "acquisition_cost": 46000, "status": VehicleStatus.AVAILABLE, "region": "North", "odometer_km": 350000},
    ]
    
    for vd in vehicles_data:
        vehicle = db.query(Vehicle).filter(Vehicle.registration_number == vd["registration_number"]).first()
        if not vehicle:
            vehicle = Vehicle(**vd)
            db.add(vehicle)
    db.commit()

    # 4. Create Demo Drivers
    drivers_data = [
        {"license_number": "LIC-1001", "name": "John Doe", "contact_number": "555-0101", "safety_score": 95.0, "license_category": LicenseCategory.A, "status": DriverStatus.AVAILABLE, "license_expiry": datetime.utcnow().date() + timedelta(days=365)},
        {"license_number": "LIC-1002", "name": "Jane Smith", "contact_number": "555-0102", "safety_score": 88.5, "license_category": LicenseCategory.B, "status": DriverStatus.ON_TRIP, "license_expiry": datetime.utcnow().date() + timedelta(days=180)},
        {"license_number": "LIC-1003", "name": "Mike Johnson", "contact_number": "555-0103", "safety_score": 75.0, "license_category": LicenseCategory.C, "status": DriverStatus.OFF_DUTY, "license_expiry": datetime.utcnow().date() + timedelta(days=15)},  # Expiring soon!
        {"license_number": "LIC-1004", "name": "Sarah Connor", "contact_number": "555-0104", "safety_score": 92.0, "license_category": LicenseCategory.D, "status": DriverStatus.AVAILABLE, "license_expiry": datetime.utcnow().date() - timedelta(days=10)}, # Expired!
    ]

    for dd in drivers_data:
        driver = db.query(Driver).filter(Driver.license_number == dd["license_number"]).first()
        if not driver:
            driver = Driver(**dd)
            db.add(driver)
    db.commit()

    # Fetch vehicles and drivers for associations
    vehicles = db.query(Vehicle).all()
    drivers = db.query(Driver).all()
    
    if len(vehicles) >= 3 and len(drivers) >= 2:
        # 5. Create Demo Trips
        if db.query(Trip).count() == 0:
            trips_data = [
                Trip(vehicle_id=vehicles[0].id, driver_id=drivers[0].id, source="Warehouse A", destination="Store 1", status=TripStatus.COMPLETED, planned_distance_km=120, actual_distance_km=125, cargo_weight_kg=4000, fuel_consumed_liters=25, revenue=500.0, dispatched_at=datetime.utcnow()-timedelta(days=2), completed_at=datetime.utcnow()-timedelta(days=1)),
                Trip(vehicle_id=vehicles[2].id, driver_id=drivers[1].id, source="Terminal Center", destination="Airport", status=TripStatus.DISPATCHED, planned_distance_km=45, cargo_weight_kg=1200, dispatched_at=datetime.utcnow()-timedelta(hours=4)),
                Trip(vehicle_id=vehicles[3].id, driver_id=drivers[0].id, source="HQ", destination="Client Site", status=TripStatus.DRAFT, planned_distance_km=15, cargo_weight_kg=50),
                Trip(vehicle_id=vehicles[0].id, driver_id=drivers[2].id, source="Warehouse B", destination="Store 2", status=TripStatus.CANCELLED, planned_distance_km=80, cargo_weight_kg=3500)
            ]
            for t in trips_data:
                db.add(t)
            db.commit()

        # 6. Create Fuel Logs
        if db.query(FuelLog).count() <= 2: # Keep existing ones or add new
            fuel_logs = [
                FuelLog(vehicle_id=vehicles[0].id, liters=45.0, cost=110.0, odometer_km=14500, date=datetime.utcnow()-timedelta(days=5)),
                FuelLog(vehicle_id=vehicles[2].id, liters=120.0, cost=280.0, odometer_km=41500, date=datetime.utcnow()-timedelta(days=2)),
                FuelLog(vehicle_id=vehicles[3].id, liters=30.0, cost=75.0, odometer_km=1100, date=datetime.utcnow()-timedelta(days=1)),
            ]
            for f in fuel_logs:
                db.add(f)
            db.commit()

        # 7. Create Expenses
        if db.query(Expense).count() <= 2:
            expenses = [
                Expense(vehicle_id=vehicles[0].id, category="Toll", amount=25.0, description="Interstate Toll", date=datetime.utcnow()-timedelta(days=2)),
                Expense(vehicle_id=vehicles[1].id, category="Maintenance", amount=1200.0, description="Engine Repair", date=datetime.utcnow()-timedelta(days=10)),
                Expense(vehicle_id=vehicles[2].id, category="Fine", amount=150.0, description="Parking Ticket", date=datetime.utcnow()-timedelta(days=3)),
                Expense(vehicle_id=vehicles[3].id, category="Cleaning", amount=45.0, description="Interior Detail", date=datetime.utcnow()-timedelta(days=5)),
            ]
            for e in expenses:
                db.add(e)
            db.commit()

        # 8. Create Maintenance Logs
        if db.query(MaintenanceLog).count() == 0:
            m_logs = [
                MaintenanceLog(vehicle_id=vehicles[1].id, type="Repair", cost=1200.0, notes="Replaced timing belt and water pump", status=MaintenanceStatus.ACTIVE, created_at=datetime.utcnow()-timedelta(days=10)),
                MaintenanceLog(vehicle_id=vehicles[0].id, type="Routine", cost=150.0, notes="Routine oil and filter change", status=MaintenanceStatus.CLOSED, created_at=datetime.utcnow()-timedelta(days=20), closed_at=datetime.utcnow()-timedelta(days=19)),
            ]
            for m in m_logs:
                db.add(m)
            db.commit()
            
    db.close()
    print("Database seeded with varied sample data successfully!")

if __name__ == "__main__":
    seed_db()
