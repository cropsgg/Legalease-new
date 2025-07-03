from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from core.database import engine, Base
from api import auth, companies
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
    auth.router,
    prefix=f"{settings.API_V1_STR}/auth",
    tags=["auth"]
)

app.include_router(
    companies.router,
    prefix=f"{settings.API_V1_STR}/companies",
    tags=["companies"]
)

@app.on_event("startup")
async def startup():
    try:
        logger.info("Attempting to connect to database...")
        # Create database tables
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database connected and tables created successfully!")
    except Exception as e:
        logger.error(f"Failed to connect to database: {e}")
        raise

@app.get("/")
async def root():
    return {
        "message": "Welcome to LegalEase API",
        "version": settings.VERSION,
        "docs_url": f"{settings.API_V1_STR}/docs"
    }

@app.get("/health")
async def health_check():
    try:
        # Test database connection
        async with engine.begin() as conn:
            await conn.execute("SELECT 1")
        return {
            "status": "healthy",
            "database": "connected",
            "version": settings.VERSION
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }