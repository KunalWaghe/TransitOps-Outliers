from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AppSettingBase(BaseModel):
    depot_name: Optional[str] = "Main Depot"
    currency: Optional[str] = "USD"
    distance_unit: Optional[str] = "Kilometers"

class AppSettingUpdate(AppSettingBase):
    pass

class AppSettingResponse(AppSettingBase):
    id: int
    updated_at: datetime

    class Config:
        from_attributes = True
