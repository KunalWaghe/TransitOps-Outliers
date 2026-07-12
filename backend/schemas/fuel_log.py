from pydantic import BaseModel, ConfigDict
from datetime import datetime

class FuelLogBase(BaseModel):
    vehicle_id: int
    liters: float
    cost: float
    odometer_km: float

class FuelLogCreate(FuelLogBase):
    pass

class FuelLogResponse(FuelLogBase):
    id: int
    date: datetime
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
