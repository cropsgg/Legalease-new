from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from api.v1 import router as api_v1_router
from api.v1.tax_filing import router as tax_filing_router
from api.v1.automation import router as automation_router
import logging
from browser_use.agent.service import Agent
from browser_use.llm import ChatOpenAI

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global browser automation agent
automation_agent = None

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs"
)

# Enhanced CORS configuration for WebSocket support
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS_LIST + ["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(api_v1_router, prefix=settings.API_V1_STR)
app.include_router(tax_filing_router, prefix=settings.API_V1_STR)
app.include_router(automation_router, prefix=settings.API_V1_STR)

async def initialize_browser_automation():
    """Initialize the browser automation agent"""
    global automation_agent
    try:
        automation_agent = Agent(
            task="Initialize browser for automation",
            llm=ChatOpenAI(
                model="gpt-4.1",
                temperature=0.1,
                api_key=settings.OPENAI_API_KEY,
            ),
            headless=False,
            ignore_https_errors=True,
            timeout=30000,
            source="main",
            context_config={
                "bypass_csp": True,
                "javascript_enabled": True,
                "viewport": {"width": 1920, "height": 1080}
            },
            browser_config={
                "args": [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-accelerated-2d-canvas",
                    "--disable-gpu",
                    "--window-size=1920,1080"
                ]
            }
        )
        await automation_agent.start()
        logger.info("✓ Browser automation initialized")
        return True
    except Exception as e:
        logger.error(f"❌ Failed to initialize browser automation: {e}")
        return False

@app.on_event("startup")
async def startup():
    """Initialize services on startup"""
    try:
        logger.info("Starting LegalEase API...")
        
        # Initialize browser automation
        if await initialize_browser_automation():
            logger.info("✓ Browser automation ready")
        else:
            logger.warning("⚠️ Browser automation not available")
        
        logger.info("✅ LegalEase API started successfully!")
        logger.info(f"📊 API Documentation: http://localhost:8000{settings.API_V1_STR}/docs")
        logger.info("🤖 WebSocket Automation: ws://localhost:8000/api/v1/ws/automation")
        
    except Exception as e:
        logger.error(f"❌ Startup failed: {e}")
        raise

@app.on_event("shutdown")
async def shutdown():
    """Clean up on shutdown"""
    logger.info("Shutting down LegalEase API...")
    if automation_agent:
        await automation_agent.close()

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to LegalEase API",
        "version": settings.VERSION,
        "docs_url": f"{settings.API_V1_STR}/docs",
        "websocket_url": f"ws://localhost:8000{settings.API_V1_STR}/ws/automation",
        "frontend_url": "http://localhost:3000/automation"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": settings.VERSION,
        "services": {
            "automation": "available" if automation_agent else "not_initialized",
            "websocket": "ready"
        }
    }