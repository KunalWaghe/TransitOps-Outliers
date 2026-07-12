from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from models.maintenance import MaintenanceType, MaintenanceStatus

class MaintenanceBase(BaseModel):
    vehicle_id: int
    type: MaintenanceType
    cost: float
    notes: Optional[str] = None
    status: Optional[MaintenanceStatus] = MaintenanceStatus.ACTIVE

class MaintenanceCreate(MaintenanceBase):
    pass

class MaintenanceResponse(MaintenanceBase):
    id: int
    created_at: datetime
    closed_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)
