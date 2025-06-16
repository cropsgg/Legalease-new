from pydantic_settings import BaseSettings
from typing import Optional, List
from functools import lru_cache

class Settings(BaseSettings):
    PROJECT_NAME: str = "LegalEase API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_ANON_KEY: str
    SUPABASE_JWT_SECRET: str
    
    # Database connection details
    user: str
    password: str
    host: str
    port: str
    dbname: str
    
    # JWT - use computed field for SECRET_KEY
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS - will be parsed from comma-separated string
    BACKEND_CORS_ORIGINS: str = "http://localhost:3000"
    
    # Computed properties
    @property
    def DATABASE_URL(self) -> str:
        # return f"postgresql+asyncpg://postgres:Ronitraj_964@db.ijcparkwogetqcknallb.supabase.co:5432/postgres"
        return f"postgresql+asyncpg://{self.user}:{self.password}@{self.host}:{self.port}/{self.dbname}"
    
    @property
    def SECRET_KEY(self) -> str:
        return self.SUPABASE_JWT_SECRET
    
    @property
    def CORS_ORIGINS_LIST(self) -> List[str]:
        return [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()