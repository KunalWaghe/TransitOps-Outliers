from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class VehicleDocumentBase(BaseModel):
    name: str
    type: str
    expiry_date: Optional[datetime] = None

class VehicleDocumentCreate(VehicleDocumentBase):
    pass

class VehicleDocumentResponse(VehicleDocumentBase):
    id: int
    vehicle_id: int
    file_path: str
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)
