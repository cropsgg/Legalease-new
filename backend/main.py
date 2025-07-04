from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from core.database import engine, Base, get_supabase
from api.v1 import router as api_v1_router
import logging
from sqlalchemy import text

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS_LIST,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 router
app.include_router(api_v1_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def startup():
    """Initialize services on startup"""
    try:
        logger.info("Starting LegalEase API...")
        
        # Initialize Supabase client
        await get_supabase()
        logger.info("✓ Supabase client initialized")
        
        # Initialize database and create tables
        async with engine.begin() as conn:
            await conn.execute(text("SELECT 1"))
            await conn.run_sync(Base.metadata.create_all)
        logger.info("✓ Database initialized")
        
        logger.info("✅ LegalEase API started successfully!")
        
    except Exception as e:
        logger.error(f"❌ Startup failed: {e}")
        raise

@app.on_event("shutdown")
async def shutdown():
    """Clean up on shutdown"""
    logger.info("Shutting down LegalEase API...")
    await engine.dispose()

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to LegalEase API",
        "version": settings.VERSION,
        "docs_url": f"{settings.API_V1_STR}/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        async with engine.begin() as conn:
            await conn.execute(text("SELECT 1"))
        
        # Test Supabase client
        await get_supabase()
        
        return {
            "status": "healthy",
            "version": settings.VERSION,
            "database": "connected",
            "supabase": "connected"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }