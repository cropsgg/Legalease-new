from typing import Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
import uuid
from sqlalchemy import select

from core.config import settings
from core.database import get_supabase
from models.user import User
from schemas.auth import UserRegister, UserLogin, TokenData
from schemas.user import UserCreate

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
ALGORITHM = "HS256"

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SUPABASE_JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> TokenData:
    """Verify JWT token and return token data"""
    try:
        payload = jwt.decode(token, settings.SUPABASE_JWT_SECRET, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        email: str = payload.get("email")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return TokenData(user_id=user_id, email=email)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def register_user(db: AsyncSession, user_data: UserRegister) -> tuple[User, str]:
    """Register a new user with Supabase and local database"""
    supabase_client = await get_supabase()
    
    try:
        # Create user in Supabase
        auth_response = await supabase_client.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password,
            "options": {
                "data": {
                    "full_name": user_data.full_name
                }
            }
        })
        
        if auth_response.user is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create user"
            )
        
        # Create user in local database
        db_user = User(
            id=uuid.UUID(auth_response.user.id),
            email=user_data.email,
            full_name=user_data.full_name
        )
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        
        # Create access token
        access_token = create_access_token(
            data={"sub": str(db_user.id), "email": db_user.email}
        )
        
        return db_user, access_token
        
    except Exception as e:
        # If Supabase user was created but local DB failed, we should handle this
        # For now, we'll just raise the error
        if "already registered" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

async def login_user(db: AsyncSession, credentials: UserLogin) -> tuple[User, str]:
    """Login user with Supabase and return user data with token"""
    supabase_client = await get_supabase()
    
    try:
        # Authenticate with Supabase
        auth_response = await supabase_client.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password
        })
        
        if auth_response.user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Get user from local database
        stmt = select(User).where(User.id == uuid.UUID(auth_response.user.id))
        result = await db.execute(stmt)
        db_user = result.scalar_one_or_none()
        
        if not db_user:
            # User exists in Supabase but not in local DB - create it
            db_user = User(
                id=uuid.UUID(auth_response.user.id),
                email=auth_response.user.email,
                full_name=auth_response.user.user_metadata.get("full_name", "")
            )
            db.add(db_user)
            await db.commit()
            await db.refresh(db_user)
        
        # Create access token
        access_token = create_access_token(
            data={"sub": str(db_user.id), "email": db_user.email}
        )
        
        return db_user, access_token
        
    except HTTPException:
        raise
    except Exception as e:
        if "invalid" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

def get_current_user_id(token: str) -> str:
    """Get current user ID from token"""
    token_data = verify_token(token)
    return token_data.user_id 