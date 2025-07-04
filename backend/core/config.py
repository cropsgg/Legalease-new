from pydantic_settings import BaseSettings
from typing import List, Optional
from functools import lru_cache
import os

class Settings(BaseSettings):
    # Application
    PROJECT_NAME: str = "LegalEase"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = True

    # MongoDB Configuration
    MONGODB_URL: str = "mongodb+srv://raunitr786:E6GZuI9hJa7LJV6u@cluster0.rylgbat.mongodb.net/"
    MONGODB_DB_NAME: str = "legalease"
    MONGODB_MIN_POOL_SIZE: int = 10
    MONGODB_MAX_POOL_SIZE: int = 50
    MONGODB_TIMEOUT_MS: int = 30000  # 30 seconds
    
    # CORS
    BACKEND_CORS_ORIGINS: str = "http://localhost:3000"
    
    # AI Configuration
    OPENAI_API_KEY: str  # Default AI provider
    GOOGLE_API_KEY: str  # Alternative AI provider
    AI_PROVIDER: str = "openai"  # Default to OpenAI
    
    # Browser Automation
    BROWSER_USE_HEADLESS: bool = False
    BROWSER_USE_LLM_PROVIDER: str = "openai"  # Changed default to OpenAI
    
    # File Upload
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_FILE_TYPES: List[str] = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
    
    # OCR settings
    OCR_ENABLED: bool = True
    OCR_TIMEOUT: int = 300  # seconds
    
    # Blockchain settings
    BLOCKCHAIN_ENABLED: bool = False
    BLOCKCHAIN_NETWORK: str = "testnet"
    
    # Email settings
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = "your-email@gmail.com"
    SMTP_PASSWORD: str = "your-app-password"
    
    # Security settings
    API_KEY_HEADER: str = "X-API-Key"
    CORS_ORIGINS: List[str] = ["*"]
    
    # Application settings
    APP_NAME: str = "LegalEase"
    APP_VERSION: str = "1.0.0"
    
    # Task settings
    TASK_REMINDER_DAYS: int = 7
    URGENT_TASK_THRESHOLD_DAYS: int = 3
    
    # Compliance settings
    COMPLIANCE_CHECK_INTERVAL: int = 24  # hours
    MIN_COMPLIANCE_SCORE: float = 70.0
    
    # Document settings
    DOCUMENT_RETENTION_DAYS: int = 365
    AUTO_DELETE_TEMP_FILES: bool = True
    
    @property
    def CORS_ORIGINS_LIST(self) -> List[str]:
        return [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",")]

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
        # Ensure upload directory exists
        os.makedirs(self.UPLOAD_DIR, exist_ok=True)

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()