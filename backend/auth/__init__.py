"""Authentication module for LegalEase API"""

from .auth_service import register_user, login_user, create_access_token, verify_token, get_current_user_id
from .dependencies import get_current_user, get_current_active_user

__all__ = [
    "register_user",
    "login_user",
    "create_access_token",
    "verify_token",
    "get_current_user_id",
    "get_current_user",
    "get_current_active_user"
] 