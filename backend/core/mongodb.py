from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.database import Database
from .config import settings
import logging

logger = logging.getLogger(__name__)

class MongoDB:
    client: AsyncIOMotorClient = None
    db: Database = None

async def connect_to_mongo():
    """Create database connection."""
    try:
        MongoDB.client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            minPoolSize=settings.MONGODB_MIN_POOL_SIZE,
            maxPoolSize=settings.MONGODB_MAX_POOL_SIZE,
            serverSelectionTimeoutMS=settings.MONGODB_TIMEOUT_MS,
            connectTimeoutMS=settings.MONGODB_TIMEOUT_MS,
            retryWrites=True,
            w="majority"
        )
        MongoDB.db = MongoDB.client[settings.MONGODB_DB_NAME]
        
        # Verify connection
        await MongoDB.client.admin.command('ping')
        logger.info("Successfully connected to MongoDB")
        
        # Create indexes
        await create_indexes()
        
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {str(e)}")
        raise
    
async def close_mongo_connection():
    """Close database connection."""
    try:
        if MongoDB.client is not None:
            MongoDB.client.close()
            logger.info("MongoDB connection closed")
    except Exception as e:
        logger.error(f"Error closing MongoDB connection: {str(e)}")

def get_db() -> Database:
    """Get database instance."""
    if MongoDB.db is None:
        raise Exception("Database not initialized")
    return MongoDB.db

async def create_indexes():
    """Create necessary indexes."""
    try:
        # Create indexes for businesses collection
        await MongoDB.db.businesses.create_index([("user_id", 1)])
        await MongoDB.db.businesses.create_index([("status", 1)])
        await MongoDB.db.businesses.create_index([("created_at", -1)])
        
        # Create text index for business name
        await MongoDB.db.businesses.create_index([("basic_info.business_name", "text")])
        
        # Create unique index for business PAN and GSTIN
        await MongoDB.db.businesses.create_index(
            [("business_details.pan_number", 1)],
            unique=True,
            sparse=True
        )
        await MongoDB.db.businesses.create_index(
            [("business_details.gstin", 1)],
            unique=True,
            sparse=True
        )
        
        logger.info("Successfully created MongoDB indexes")
    except Exception as e:
        logger.error(f"Error creating MongoDB indexes: {str(e)}")
        raise 