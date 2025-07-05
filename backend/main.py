import logging
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from core.config import settings
from core.database import get_database
from api.v1 import automation, companies, tax_filing, business, auth, upload

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler(os.path.join('logs', 'app.log'))
    ]
)

logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="LegalEase Business Onboarding API"
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS_LIST,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create required directories
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs('logs', exist_ok=True)

# MongoDB connection
@app.on_event("startup")
async def startup_event():
    try:
        logger.info("Connecting to MongoDB...")
        app.mongodb = get_database()
        logger.info("MongoDB connection established")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {str(e)}")
        raise

# Health check endpoint
@app.get("/health")
async def health_check():
    try:
        # Check database connection
        app.mongodb.command("ping")
        return {
            "status": "healthy",
            "version": settings.VERSION,
            "database": "connected"
        }
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Service unhealthy: {str(e)}"
        )

# Include routers
app.include_router(auth.router, prefix=settings.API_V1_STR, tags=["Authentication"])
app.include_router(upload.router, prefix=settings.API_V1_STR, tags=["File Upload"])
app.include_router(automation.router, prefix=settings.API_V1_STR, tags=["Automation"])
app.include_router(companies.router, prefix=settings.API_V1_STR, tags=["Companies"])
app.include_router(tax_filing.router, prefix=settings.API_V1_STR, tags=["Tax Filing"])
app.include_router(business.router, prefix=settings.API_V1_STR, tags=["Business Onboarding"])

if __name__ == "__main__":
    try:
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except Exception as e:
        logger.error(f"Failed to start server: {str(e)}")
        raise