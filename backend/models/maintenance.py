from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base
import enum

class MaintenanceType(str, enum.Enum):
    OIL_CHANGE = "Oil Change"
    TIRE = "Tire Replacement"
    ENGINE = "Engine Repair"
    BRAKE = "Brake Service"
    INSPECTION = "General Inspection"

class MaintenanceStatus(str, enum.Enum):
    ACTIVE = "Active"
    CLOSED = "Closed"

class MaintenanceLog(Base):
    __tablename__ = "maintenance_logs"

    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id", ondelete="CASCADE"), index=True)
    type = Column(String)
    cost = Column(Float)
    notes = Column(String, nullable=True)
    status = Column(String, default=MaintenanceStatus.ACTIVE.value, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    closed_at = Column(DateTime, nullable=True)

    vehicle = relationship("Vehicle")
