from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from models.vehicle import VehicleType, VehicleStatus

class VehicleBase(BaseModel):
    registration_number: str
    name: str
    type: VehicleType
    max_capacity_kg: float
    odometer_km: float
    acquisition_cost: float
    region: Optional[str] = None
    status: Optional[VehicleStatus] = VehicleStatus.AVAILABLE

class VehicleCreate(VehicleBase):
    pass

class VehicleUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[VehicleType] = None
    max_capacity_kg: Optional[float] = None
    odometer_km: Optional[float] = None
    acquisition_cost: Optional[float] = None
    region: Optional[str] = None
    status: Optional[VehicleStatus] = None

class VehicleResponse(VehicleBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
