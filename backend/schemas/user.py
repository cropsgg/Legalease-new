from pydantic import BaseModel, EmailStr, UUID4
from datetime import datetime
from typing import Optional
from models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr
    role: UserRole = UserRole.USER

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[UserRole] = None

class UserInDB(UserBase):
    id: UUID4
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class User(UserInDB):
    pass 