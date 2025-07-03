from supabase import create_client, Client
from fastapi import HTTPException, status
from .config import settings
from typing import Dict, Any, Optional
import httpx

class SupabaseAuth:
    _instance: Optional[Client] = None

    @classmethod
    def get_client(cls) -> Client:
        if cls._instance is None:
            cls._instance = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_SERVICE_ROLE_KEY
            )
        return cls._instance

    @classmethod
    async def sign_up(cls, email: str, password: str) -> Dict[str, Any]:
        try:
            client = cls.get_client()
            response = client.auth.sign_up({
                "email": email,
                "password": password
            })
            return response.dict()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )

    @classmethod
    async def sign_in(cls, email: str, password: str) -> Dict[str, Any]:
        try:
            client = cls.get_client()
            response = client.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            return response.dict()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

    @classmethod
    async def sign_in_with_google(cls, access_token: str) -> Dict[str, Any]:
        try:
            client = cls.get_client()
            response = client.auth.sign_in_with_oauth({
                "provider": "google",
                "access_token": access_token
            })
            return response.dict()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )

    @classmethod
    async def get_user(cls, token: str) -> Dict[str, Any]:
        try:
            client = cls.get_client()
            user = client.auth.get_user(token)
            return user.dict()
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token or expired session"
            )

    @classmethod
    async def sign_out(cls, token: str) -> None:
        try:
            client = cls.get_client()
            client.auth.sign_out(token)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )

    @classmethod
    async def reset_password_for_email(cls, email: str) -> None:
        try:
            client = cls.get_client()
            client.auth.reset_password_for_email(email)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            ) 