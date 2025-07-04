from pydantic_settings import BaseSettings
from typing import List, Optional
from functools import lru_cache

class Settings(BaseSettings):
    # Application
    PROJECT_NAME: str = "LegalEase API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database Configuration
    USER: str = "postgres.urjxmruuystlzadljxld"
    PASSWORD: str = "Ronitraj_963"
    HOST: str = "aws-0-ap-southeast-1.pooler.supabase.com"
    PORT: int = 5432
    DBNAME: str = "postgres"
    
    # Construct Database URL
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql+asyncpg://{self.USER}:{self.PASSWORD}@{self.HOST}:{self.PORT}/{self.DBNAME}"
    
    # Supabase Configuration
    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str
    SUPABASE_ANON_KEY: str
    SUPABASE_JWT_SECRET: str
    
    # Security
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 3600
    
    # CORS
    BACKEND_CORS_ORIGINS: str = "http://localhost:3000"
    
    # AI Configuration
    OPENAI_API_KEY: str  # Default AI provider
    GOOGLE_API_KEY: str  # Alternative AI provider
    AI_PROVIDER: str = "openai"  # Default to OpenAI
    
    # Browser Automation
    BROWSER_USE_HEADLESS: bool = True
    BROWSER_USE_LLM_PROVIDER: str = "openai"  # Changed default to OpenAI
    
    @property
    def CORS_ORIGINS_LIST(self) -> List[str]:
        return [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",")]
    
    @property
    def DATABASE_CONNECTION_URL(self) -> str:
        """Build DATABASE_URL from individual components or use provided URL"""
        if self.DATABASE_URL:
            # Ensure asyncpg format
            url = self.DATABASE_URL
            if "postgresql+psycopg2://" in url:
                return url.replace("postgresql+psycopg2://", "postgresql+asyncpg://")
            elif url.startswith("postgresql://"):
                return url.replace("postgresql://", "postgresql+asyncpg://")
            return url
        
        # Build from components
        if all([self.USER, self.PASSWORD, self.HOST, self.DBNAME]):
            return f"postgresql+asyncpg://{self.USER}:{self.PASSWORD}@{self.HOST}:{self.PORT}/{self.DBNAME}"
        
        raise ValueError("Either DATABASE_URL or all database parameters (USER, PASSWORD, HOST, DBNAME) required")

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()