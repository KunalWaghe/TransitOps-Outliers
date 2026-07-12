from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from models.trip import TripStatus

class TripBase(BaseModel):
    source: str
    destination: str
    vehicle_id: int
    driver_id: int
    cargo_weight_kg: float
    planned_distance_km: float
    revenue: Optional[float] = None
    status: Optional[TripStatus] = TripStatus.DRAFT

class TripCreate(TripBase):
    pass

class TripComplete(BaseModel):
    actual_distance_km: float
    fuel_consumed_liters: float

class TripResponse(TripBase):
    id: int
    actual_distance_km: Optional[float] = None
    fuel_consumed_liters: Optional[float] = None
    created_at: datetime
    dispatched_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)
