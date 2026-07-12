from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from enum import Enum as PyEnum
from .base import Base

class VehicleType(str, PyEnum):
    TRUCK = "Truck"
    VAN = "Van"

class VehicleStatus(str, PyEnum):
    AVAILABLE = "Available"
    IN_SHOP = "In Shop"
    ON_TRIP = "On Trip"

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    registration_number = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    max_capacity_kg = Column(Float, nullable=False)
    odometer_km = Column(Float, nullable=False, default=0.0)
    acquisition_cost = Column(Float, nullable=False)
    region = Column(String, nullable=True)
    status = Column(String, nullable=False, default="Available", index=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    trips = relationship("Trip", back_populates="vehicle")
    maintenance_logs = relationship("MaintenanceLog", back_populates="vehicle", cascade="all, delete-orphan")
    fuel_logs = relationship("FuelLog", back_populates="vehicle", cascade="all, delete-orphan")
    expenses = relationship("Expense", back_populates="vehicle", cascade="all, delete-orphan")
    documents = relationship("VehicleDocument", back_populates="vehicle", cascade="all, delete-orphan")
