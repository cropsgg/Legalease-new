from pydantic import BaseModel, EmailStr, UUID4
from datetime import datetime
from typing import Optional
from models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.USER

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[UserRole] = None

class User(BaseModel):
    id: UUID4
    email: EmailStr
    full_name: str
    role: UserRole
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 