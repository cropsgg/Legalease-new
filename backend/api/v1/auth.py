from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any

from core.database import get_db
from schemas.auth import UserRegister, UserLogin, AuthResponse
from schemas.user import User
from auth.auth_service import register_user, login_user
from auth.dependencies import get_current_active_user

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.post("/register", response_model=AuthResponse)
async def register(
    user_data: UserRegister,
    db: AsyncSession = Depends(get_db)
):
    """
    Register a new user with email and password.
    
    - **email**: Valid email address
    - **password**: Password (minimum 6 characters)
    - **full_name**: User's full name
    """
    user, access_token = await register_user(db, user_data)
    
    return AuthResponse(
        user=user,
        access_token=access_token,
        token_type="bearer"
    )

@router.post("/login", response_model=AuthResponse)
async def login(
    credentials: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    """
    Login with email and password.
    
    - **email**: Registered email address
    - **password**: User's password
    """
    user, access_token = await login_user(db, credentials)
    
    return AuthResponse(
        user=user,
        access_token=access_token,
        token_type="bearer"
    )

@router.get("/me", response_model=User)
async def get_current_user_info(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get current authenticated user information.
    
    Requires authentication token in header.
    """
    return current_user 