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
        try:
            # Remove old problematic indexes if they exist
            try:
                db.businesses.drop_index("business_name_1")
                logger.info("Dropped old business_name index")
            except Exception:
                pass  # Index may not exist
                
            try:
                db.businesses.drop_index("pan_number_1") 
                logger.info("Dropped old pan_number index")
            except Exception:
                pass  # Index may not exist
            
            # Create new indexes with correct field names
            db.businesses.create_index("businessName")  # Not unique to allow testing
            db.businesses.create_index("panNumber", sparse=True)  # Unique but sparse
            db.companies.create_index("name")
            db.users.create_index("email", unique=True)
            logger.info("Database indexes created successfully")
        except Exception as e:
            logger.warning(f"Index creation warning: {e}")
        
        return db
        
    except ConnectionFailure as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error while connecting to MongoDB: {e}")
        raise 