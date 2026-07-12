from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class ExpenseBase(BaseModel):
    vehicle_id: int
    category: str
    amount: float
    description: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseResponse(ExpenseBase):
    id: int
    date: datetime
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
