from typing import Optional
import uuid
from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from fastapi_users import schemas
from models.user import User

class UserRead(schemas.BaseUser[uuid.UUID]):
    role: str

class UserCreate(schemas.BaseUserCreate):
    role: str = "user"

class UserUpdate(schemas.BaseUserUpdate):
    role: Optional[str] = None

class UserDB(User, SQLAlchemyBaseUserTableUUID):
    pass