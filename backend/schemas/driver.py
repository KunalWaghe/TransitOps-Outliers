from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date, datetime
from models.driver import LicenseCategory, DriverStatus

class DriverBase(BaseModel):
    name: str
    license_number: str
    license_category: LicenseCategory
    license_expiry: date
    contact_number: str
    safety_score: float
    status: Optional[DriverStatus] = DriverStatus.AVAILABLE

class DriverCreate(DriverBase):
    pass

class DriverUpdate(BaseModel):
    name: Optional[str] = None
    license_category: Optional[LicenseCategory] = None
    license_expiry: Optional[date] = None
    contact_number: Optional[str] = None
    safety_score: Optional[float] = None
    status: Optional[DriverStatus] = None

class DriverResponse(DriverBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
