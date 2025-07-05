#!/usr/bin/env python3
"""
Startup script for LegalEase Browser Automation System
This script helps start the backend server with automation support
"""

import subprocess
import sys
import os
from pathlib import Path
import asyncio
from core.config import settings

def check_environment():
    """Check if we're in the right directory and environment"""
    current_dir = Path.cwd()
    
    # Check if we're in the backend directory
    if not (current_dir / "main.py").exists():
        print("❌ Please run this script from the backend directory")
        print("   Current directory:", current_dir)
        print("   Expected files: main.py, requirements.txt")
        return False
    
    return True

def check_python_version():
    """Check Python version"""
    if sys.version_info < (3, 8):
        print(f"❌ Python 3.8+ required, but found {sys.version}")
        return False
    
    print(f"✓ Python version: {sys.version.split()[0]}")
    return True

def check_dependencies():
    """Check if required dependencies are installed"""
    missing_deps = []
    
    try:
        import browser_use
        print("✓ browser-use installed")
    except ImportError:
        missing_deps.append("browser-use")
    
    try:
        import fastapi
        print("✓ fastapi installed")
    except ImportError:
        missing_deps.append("fastapi")
    
    try:
        import uvicorn
        print("✓ uvicorn installed")
    except ImportError:
        missing_deps.append("uvicorn")
    
    try:
        import openai
        print("✓ openai installed")
    except ImportError:
        missing_deps.append("openai")
    
    if missing_deps:
        print(f"❌ Missing dependencies: {', '.join(missing_deps)}")
        print("Please run: pip install -r requirements.txt")
        return False
    
    return True

async def check_browser():
    """Check if browser-use can launch a browser"""
    try:
        from browser_use.agent.service import Agent
        from browser_use.llm import ChatOpenAI
        
        print("Testing browser launch...")
        
        # Create a simple test agent
        agent = Agent(
            task="Navigate to example.com",
            llm=ChatOpenAI(
                model="gpt-4.1",
                temperature=0.1,
                api_key=settings.OPENAI_API_KEY,
            ),
            headless=False,
            ignore_https_errors=True,
            timeout=30000,
            source="test",
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
        
        # Try to run a simple task
        result = await agent.run()
        
        # Clean up
        await agent.close()
        
        print("✓ Browser test successful")
        return True
        
    except Exception as e:
        print(f"❌ Browser test failed: {e}")
        print("\n💡 Browser configuration tips:")
        print("   - Make sure you have graphical environment")
        print("   - Try running with --no-sandbox if you get sandbox errors")
        print("   - Check if you have required system libraries")
        return False

def check_environment_variables():
    """Check if required environment variables are set"""
    env_file = Path(".env")
    
    if not env_file.exists():
        print("⚠️  .env file not found - creating template...")
        create_env_template()
    
    # Check for OpenAI API key
    from core.config import settings
    
    if not settings.OPENAI_API_KEY:
        print("❌ OPENAI_API_KEY not set")
        print("Please add your OpenAI API key to the .env file:")
        print("   OPENAI_API_KEY=your_api_key_here")
        return False
    
    print("✓ OpenAI API key configured")
    return True

def create_env_template():
    """Create a template .env file"""
    template = """# LegalEase Backend Configuration

# OpenAI API Configuration (Required)
OPENAI_API_KEY=your_openai_api_key_here

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost/legalease

# Security
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Project Settings
PROJECT_NAME=LegalEase
VERSION=1.0.0
API_V1_STR=/api/v1

# Browser Configuration
BROWSER_NO_SANDBOX=true
BROWSER_HEADLESS=false
"""
    
    with open(".env", "w") as f:
        f.write(template)
    
    print("✓ Created .env template file")
    print("  Please edit .env and add your actual configuration values")

def create_directories():
    """Create necessary directories"""
    dirs = [
        "./tmp/record_videos",
        "./logs",
        "./tmp/browser_data"
    ]
    
    for dir_path in dirs:
        os.makedirs(dir_path, exist_ok=True)
    
    print("✓ Created necessary directories")
