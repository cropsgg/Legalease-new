from pydantic import BaseModel, EmailStr
from typing import Optional

class UserAuth(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    role: str = "authenticated"
    email_confirmed: bool = False

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    refresh_token: Optional[str] = None

class GoogleToken(BaseModel):
    access_token: str

class PasswordReset(BaseModel):
    email: EmailStr 