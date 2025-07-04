import logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from .config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_database():
    """Get MongoDB database connection"""
    try:
        # Configure MongoDB client with basic settings
        client = MongoClient(
            settings.MONGODB_URL,
            serverSelectionTimeoutMS=5000,
            maxPoolSize=50
        )
        
        # Test the connection
        client.admin.command('ping')
        logger.info("Successfully connected to MongoDB")
        
        # Get database instance
        db = client[settings.MONGODB_DB_NAME]
        
        # Create basic indexes if they don't exist
        db.businesses.create_index("business_name", unique=True)
        db.businesses.create_index("pan_number", unique=True, sparse=True)
        
        return db
        
    except ConnectionFailure as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error while connecting to MongoDB: {e}")
        raise 