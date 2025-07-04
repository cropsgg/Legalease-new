from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import uvicorn
import logging
import os
from core.config import settings
from core.mongodb import connect_to_mongo, close_mongo_connection
from api.v1 import automation, companies, tax_filing, business

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
async def startup_db_client():
    try:
        logger.info("Connecting to MongoDB...")
        app.mongodb_client = AsyncIOMotorClient(settings.MONGODB_URL)
        app.mongodb = app.mongodb_client[settings.MONGODB_DB_NAME]
        
        # Create indexes
        await app.mongodb.businesses.create_index("business_name", unique=True)
        await app.mongodb.businesses.create_index("pan_number", unique=True, sparse=True)

        logger.info("MongoDB connection established")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {str(e)}")
        raise

@app.on_event("shutdown")
async def shutdown_db_client():
    try:
        logger.info("Closing MongoDB connection...")
        app.mongodb_client.close()
        logger.info("MongoDB connection closed")
    except Exception as e:
        logger.error(f"Error closing MongoDB connection: {str(e)}")

# Health check endpoint
@app.get("/health")
async def health_check():
    try:
        # Check database connection
        await app.mongodb.command("ping")
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