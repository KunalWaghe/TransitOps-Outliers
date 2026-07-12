from sqlalchemy import Column, Integer, String, Date, DateTime, Float, Enum as SQLEnum
from datetime import datetime
from database import Base
import enum

class LicenseCategory(str, enum.Enum):
    A = "A"
    B = "B"
    C = "C"
    D = "D"
    E = "E"

class DriverStatus(str, enum.Enum):
    AVAILABLE = "Available"
    ON_TRIP = "On Trip"
    OFF_DUTY = "Off Duty"
    SUSPENDED = "Suspended"

class Driver(Base):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    license_number = Column(String, unique=True, index=True)
    license_category = Column(String)
    license_expiry = Column(Date)
    contact_number = Column(String)
    safety_score = Column(Float)
    status = Column(String, default=DriverStatus.AVAILABLE.value, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
