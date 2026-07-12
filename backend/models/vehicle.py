from sqlalchemy import Column, Integer, String, Float, DateTime, Enum as SQLEnum
from datetime import datetime
from database import Base
import enum

class VehicleType(str, enum.Enum):
    TRUCK = "Truck"
    VAN = "Van"
    CAR = "Car"
    BUS = "Bus"

class VehicleStatus(str, enum.Enum):
    AVAILABLE = "Available"
    ON_TRIP = "On Trip"
    IN_SHOP = "In Shop"
    RETIRED = "Retired"

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    registration_number = Column(String, unique=True, index=True)
    name = Column(String)
    type = Column(SQLEnum(VehicleType))
    max_capacity_kg = Column(Float)
    odometer_km = Column(Float)
    acquisition_cost = Column(Float)
    region = Column(String)
    status = Column(SQLEnum(VehicleStatus), default=VehicleStatus.AVAILABLE, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
