from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from schemas.user import User

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=1)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: Optional[str] = None
    email: Optional[str] = None

class AuthResponse(BaseModel):
    user: User
    access_token: str
    token_type: str = "bearer" 