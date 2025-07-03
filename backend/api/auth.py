from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from core.supabase_client import SupabaseAuth
from schemas.auth import UserAuth, UserResponse, Token, GoogleToken, PasswordReset
from typing import Dict, Any

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> Dict[str, Any]:
    return await SupabaseAuth.get_user(token)

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserAuth):
    """Register a new user with email and password"""
    response = await SupabaseAuth.sign_up(user_data.email, user_data.password)
    return response["user"]

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login with email and password"""
    response = await SupabaseAuth.sign_in(form_data.username, form_data.password)
    return {
        "access_token": response["session"]["access_token"],
        "token_type": "bearer",
        "expires_in": response["session"]["expires_in"],
        "refresh_token": response["session"].get("refresh_token")
    }

@router.post("/google/login", response_model=Token)
async def google_login(token: GoogleToken):
    """Login with Google OAuth token"""
    response = await SupabaseAuth.sign_in_with_google(token.access_token)
    return {
        "access_token": response["session"]["access_token"],
        "token_type": "bearer",
        "expires_in": response["session"]["expires_in"],
        "refresh_token": response["session"].get("refresh_token")
    }

@router.post("/logout")
async def logout(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Logout the current user"""
    await SupabaseAuth.sign_out(current_user["session"]["access_token"])
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Get current user information"""
    return current_user["user"]

@router.post("/password-reset")
async def request_password_reset(email_data: PasswordReset):
    """Request a password reset email"""
    await SupabaseAuth.reset_password_for_email(email_data.email)
    return {"message": "Password reset email sent if user exists"} 