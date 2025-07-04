from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional
from models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.USER

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[UserRole] = None

class User(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    email: EmailStr
    full_name: str
    role: UserRole
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_login: Optional[datetime] = None 