from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from core.database import engine, Base
from auth.setup import fastapi_users, auth_backend
from auth.base_user import UserCreate, UserRead, UserUpdate
from api import companies
import asyncio
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS_LIST,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix=f"{settings.API_V1_STR}/auth/jwt",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix=f"{settings.API_V1_STR}/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix=f"{settings.API_V1_STR}/users",
    tags=["users"],
)
app.include_router(companies.router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def startup():
    try:
        logger.info("Attempting to connect to database...")
        logger.info(f"Database URL: {settings.DATABASE_URL}")
        
        # Create tables
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        
        logger.info("Database connected successfully!")
    except Exception as e:
        logger.error(f"Failed to connect to database: {e}")
        logger.error("The application will start but database operations will fail.")
        # Don't raise the exception to allow the app to start
        # This allows for debugging and testing the configuration

@app.get("/")
async def root():
    return {"message": "Welcome to LegalEase API"}

@app.get("/health")
async def health_check():
    try:
        # Test database connection
        async with engine.begin() as conn:
            await conn.execute("SELECT 1")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}