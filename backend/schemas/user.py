from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str
    role_id: int

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    password: Optional[str] = None
    role_id: Optional[int] = None

class UserResponse(UserBase):
    id: int
    role_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
