from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base
import enum

class TripStatus(str, enum.Enum):
    DRAFT = "Draft"
    DISPATCHED = "Dispatched"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"

class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    source = Column(String)
    destination = Column(String)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id", ondelete="RESTRICT"))
    driver_id = Column(Integer, ForeignKey("drivers.id", ondelete="RESTRICT"))
    cargo_weight_kg = Column(Float)
    planned_distance_km = Column(Float)
    actual_distance_km = Column(Float, nullable=True)
    fuel_consumed_liters = Column(Float, nullable=True)
    revenue = Column(Float, nullable=True)
    status = Column(SQLEnum(TripStatus), default=TripStatus.DRAFT, index=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    dispatched_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    
    vehicle = relationship("Vehicle")
    driver = relationship("Driver")
