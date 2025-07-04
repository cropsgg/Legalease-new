import asyncio
import base64
import json
import uuid
from typing import Dict, Any, Optional, Generator
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from browser_use.agent.service import Agent
from browser_use.llm import ChatOpenAI
from core.config import settings
import os
import logging
from datetime import datetime
from fastapi.exceptions import HTTPException
from starlette.websockets import WebSocketState
from contextlib import contextmanager
import traceback

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/automation", tags=["automation"])

# Store active sessions
active_sessions: Dict[str, Dict[str, Any]] = {}

# Directory to store recordings
recording_dir = "./tmp/record_videos"
os.makedirs(recording_dir, exist_ok=True)

# Chat history storage
chat_sessions: Dict[str, list] = {}

# Store active WebSocket connections
active_connections: Dict[str, WebSocket] = {}

# Store automation agents
automation_agents: Dict[str, Agent] = {}

# Store screenshot tasks
screenshot_tasks: Dict[str, asyncio.Task] = {}

# Custom exceptions
class AutomationError(Exception):
    """Base exception for automation errors"""
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(message)
        self.details = details or {}

class BrowserError(AutomationError):
    """Exception for browser-related errors"""
    pass

class AgentError(AutomationError):
    """Exception for agent-related errors"""
    pass

class SessionError(AutomationError):
    """Exception for session-related errors"""
    pass

class AutomationSession:
    def __init__(self, session_id: str, websocket: WebSocket):
        self.session_id = session_id
        self.websocket = websocket
        self.agent: Optional[Agent] = None
        self.screenshot_task: Optional[asyncio.Task] = None
        self.last_activity = datetime.now()
        self.status = "connected"
        self.current_task: Optional[str] = None
        self.step_count = 0
        self.current_step: Optional[str] = None
        self.error: Optional[str] = None

    async def send_status(self, status_type: str, message: str, **kwargs):
        """Send a status update to the client"""
        try:
            await self.websocket.send_text(json.dumps({
                "type": status_type,
                "message": message,
                "timestamp": datetime.now().isoformat(),
                "session_id": self.session_id,
                "status": self.status,
                "current_task": self.current_task,
                "step_count": self.step_count,
                "current_step": self.current_step,
                "error": self.error,
                **kwargs
            }))
        except Exception as e:
            logger.error(f"Failed to send status update: {e}")

def analyze_user_intent(user_message: str) -> Dict[str, Any]:
    """Analyze user message to determine intent"""
    user_message_lower = user_message.lower()
    
    # Check for tax filing keywords
    tax_keywords = ['tax', 'itr', 'income tax', 'filing', 'return', 'assessment']
    if any(keyword in user_message_lower for keyword in tax_keywords):
        return {
            "intent": "tax_filing",
            "requires_automation": True,
            "task_type": "tax_filing"
        }
    
    # Check for form filling keywords
    form_keywords = ['form', 'application', 'government', 'fill', 'submit']
    if any(keyword in user_message_lower for keyword in form_keywords):
        return {
            "intent": "form_filling",
            "requires_automation": True,
            "task_type": "form_filling"
        }
    
    # Default to chat response
    return {
        "intent": "chat",
        "requires_automation": False,
        "task_type": "chat"
    }

async def get_chat_response(user_message: str, session_id: str) -> str:
    """Get chat response from OpenAI"""
    try:
        from openai import OpenAI
        
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        
        # Get or create chat history
        if session_id not in chat_sessions:
            chat_sessions[session_id] = [
                {
                    "role": "system",
                    "content": "You are a helpful AI assistant for LegalEase, specializing in legal automation, tax filing, and document processing. When users ask about tax filing or automation tasks, guide them appropriately. Be concise and helpful."
                }
            ]
        
        # Add user message to history
        chat_sessions[session_id].append({
            "role": "user",
            "content": user_message
        })
        
        # Get response from OpenAI
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=chat_sessions[session_id],
            max_tokens=200,
            temperature=0.7
        )
        
        ai_response = response.choices[0].message.content
        
        # Add AI response to history
        chat_sessions[session_id].append({
            "role": "assistant",
            "content": ai_response
        })
        
        return ai_response
        
    except Exception as e:
        logger.error(f"Chat response error: {e}")
        return "I'm having trouble responding right now. Please try again."

def get_tax_filing_task(user_prompt: str) -> str:
    """Convert user prompt into detailed tax filing task"""
    base_task = f"""
    User request: '{user_prompt}'
    
    Based on the user request, perform tax filing automation:
    
    Follow these steps precisely to complete the tax filing process:

    1. LOGIN PHASE:
       - Navigate to: https://income-tax-ai-alphaq.vercel.app/
       - Verify login form elements are present
       - Enter PAN: ABCDE1234F
       - Read and enter the captcha shown on screen
       - Click "Get OTP" button
       - When OTP field appears, enter: 123456
       - Click final login button
       - Verify successful login by checking dashboard

    2. START FILING PHASE:
       - Look for "File ITR" section on dashboard
       - Click "Start Filing" button
       - In the filing form:
         * Click Assessment Year dropdown and select "2023-24"
         * Select ITR Type: "ITR-2"
         * Choose Filing Mode: "Online Filing"
       - Click "Continue" button

    3. PRE-FILLED INFO PHASE:
       - Review pre-filled information
       - Verify personal details are correct
       - Click "Continue to Income & Deductions"

    4. INCOME & DEDUCTIONS PHASE:
       - Under "Other Income" section:
         * Click "Add Income" button
         * Select "Rental Income" from dropdown
         * Enter amount: 25235
         * Click "Add Income" button again
         * Select "Interest Income" from dropdown
         * Enter amount: 3252530

       - Under "Deductions" section:
         * Click "Add Deduction" button
         * Select "80D - Health Insurance Premium"
         * Enter description: "Health Insurance Premium"
         * Enter amount: 25000
         * Click "Add Deduction" button again
         * Select "80C - Tax Saving Investment"
         * Enter description: "Investment"
         * Enter amount: 150000

       - Click "Continue to Tax Summary"

    5. TAX SUMMARY & PAYMENT PHASE:
       - Review tax calculation summary
       - Click "Continue to Payment"
       - Select any available payment method
       - Click "Make Payment"

    6. FINAL SUBMISSION:
       - Review all information in submission page
       - Check "I accept the above declaration" checkbox
       - Click "Submit Return"
       - Verify successful submission message
       - Note down acknowledgment number if provided

    Important Instructions:
    - Take your time with each step
    - If any element is not found, wait a moment and try again
    - Document each successful action
    - If any step fails, provide detailed error information
    - Ensure each page loads completely before proceeding
    """
    return base_task

@contextmanager
async def error_handler(session: AutomationSession, error_type: str) -> Generator:
    """Context manager for handling errors and sending error messages to client"""
    try:
        yield
    except Exception as e:
        error_message = str(e)
        error_details = {
            "type": error_type,
            "traceback": traceback.format_exc(),
            "session_id": session.session_id
        }
        
        logger.error(f"Error in {error_type}: {error_message}", extra=error_details)
        
        if isinstance(e, AutomationError):
            error_details.update(e.details)
        
        if session.websocket.client_state == WebSocketState.CONNECTED:
            try:
                await session.send_status(
                    "error",
                    error_message,
                    error_type=error_type,
                    details=error_details
                )
            except Exception as ws_error:
                logger.error(f"Failed to send error message: {ws_error}")
        
        # Update session state
        session.status = "error"
        session.error = error_message
        
        # Cleanup if necessary
        if error_type in ["browser", "agent"]:
            await cleanup_session(session.session_id)
        
        raise

async def initialize_automation_agent(session_id: str) -> Agent:
    """Initialize a new browser automation agent for a session"""
    try:
        agent = Agent(
            task="Initialize browser for automation",
            llm=ChatOpenAI(
                model="gpt-4.1",
                temperature=0.1,
                api_key=settings.OPENAI_API_KEY,
            ),
            headless=False,
            ignore_https_errors=True,
            timeout=30000,
            source=f"session_{session_id}",
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
        return agent
    except Exception as e:
        raise AgentError(f"Failed to initialize automation agent: {str(e)}")

async def start_screenshot_stream(session: AutomationSession):
    """Start streaming screenshots for a session"""
    with error_handler(session, "screenshot"):
        while True:
            if session.session_id not in active_sessions:
                break
            
            if not session.agent or not hasattr(session.agent, 'browser_context'):
                await asyncio.sleep(1)
                continue
            
            try:
                # Capture screenshot
                screenshot_bytes = await session.agent.browser_context.page.screenshot(
                    type="jpeg",
                    quality=70,
                    full_page=False
                )
                screenshot_base64 = base64.b64encode(screenshot_bytes).decode('utf-8')
                
                # Get current URL and title
                current_url = await session.agent.browser_context.page.url()
                page_title = await session.agent.browser_context.page.title()
                
                # Send update
                await session.send_status(
                    "screenshot",
                    "Screenshot update",
                    screenshot=screenshot_base64,
                    url=current_url,
                    title=page_title,
                    timestamp=datetime.now().isoformat()
                )
                
            except Exception as e:
                logger.error(f"Screenshot capture error: {e}")
                if session.websocket.client_state == WebSocketState.CONNECTED:
                    await session.send_status(
                        "error",
                        "Failed to capture screenshot",
                        error_type="screenshot",
                        recoverable=True
                    )
            
            # Wait before next capture
            await asyncio.sleep(1)

async def cleanup_session(session_id: str):
    """Clean up session resources"""
    try:
        if session_id in active_sessions:
            session = active_sessions[session_id]
            
            # Cancel screenshot task
            if session.screenshot_task:
                session.screenshot_task.cancel()
                try:
                    await session.screenshot_task
                except asyncio.CancelledError:
                    pass
            
            # Close agent
            if session.agent:
                try:
                    await session.agent.close()
                except Exception as e:
                    logger.error(f"Error closing agent: {e}")
            
            # Remove session
            del active_sessions[session_id]
            logger.info(f"Cleaned up session {session_id}")
            
    except Exception as e:
        logger.error(f"Error during session cleanup: {e}")
        raise SessionError(f"Failed to clean up session: {str(e)}")

async def handle_automation_step(session: AutomationSession, agent: Agent):
    """Handle automation step updates"""
    try:
        # Step start callback
        async def on_step_start(agent_instance: Agent):
            try:
                session.step_count += 1
                if hasattr(agent_instance.state, 'current_step'):
                    session.current_step = str(agent_instance.state.current_step)
                
                if hasattr(agent_instance.browser_context, 'page'):
                    current_url = await agent_instance.browser_context.page.url()
                    page_title = await agent_instance.browser_context.page.title()
                    
                    await session.send_status(
                        "step_start",
                        f"Starting step {session.step_count}",
                        url=current_url,
                        title=page_title,
                        step=session.current_step
                    )
            except Exception as e:
                logger.error(f"Step start callback error: {e}")

        # Step end callback
        async def on_step_end(agent_instance: Agent):
            try:
                if hasattr(agent_instance.state, 'history'):
                    last_action = None
                    if agent_instance.state.history.history:
                        last_entry = agent_instance.state.history.history[-1]
                        if hasattr(last_entry, 'result') and last_entry.result:
                            last_action = str(last_entry.result[-1])
                    
                    if hasattr(agent_instance.browser_context, 'page'):
                        current_url = await agent_instance.browser_context.page.url()
                        page_title = await agent_instance.browser_context.page.title()
                        
                        await session.send_status(
                            "step_complete",
                            f"Completed step {session.step_count}",
                            url=current_url,
                            title=page_title,
                            action=last_action
                        )
            except Exception as e:
                logger.error(f"Step end callback error: {e}")

        # Run automation with callbacks
        result = await agent.run(
            on_step_start=on_step_start,
            on_step_end=on_step_end
        )
        
        return result
        
    except Exception as e:
        session.error = str(e)
        logger.error(f"Automation step error: {e}")
        await session.send_status(
            "error",
            f"Automation step failed: {str(e)}",
            step=session.current_step
        )
        raise

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for browser automation"""
    session_id = str(uuid.uuid4())
    session = None
    
    try:
        # Accept connection
        await websocket.accept()
        logger.info(f"New WebSocket connection: {session_id}")
        
        # Initialize session
        session = AutomationSession(session_id, websocket)
        active_sessions[session_id] = session
        
        # Initialize agent
        with error_handler(session, "agent"):
            session.agent = await initialize_automation_agent(session_id)
        
        # Send connection confirmation
        await session.send_status(
            "connection",
            "Connected to automation service",
            capabilities=["tax_filing", "form_filling", "document_processing"]
        )
        
        # Start screenshot stream
        session.screenshot_task = asyncio.create_task(
            start_screenshot_stream(session)
        )
        
        # Main message loop
        while True:
            try:
                # Receive message
                message = await websocket.receive_text()
                data = json.loads(message)
                
                # Update last activity
                session.last_activity = datetime.now()
                
                # Handle different message types
                if data["type"] == "chat_message":
                    with error_handler(session, "automation"):
                        # Reset step counter
                        session.step_count = 0
                        session.current_step = None
                        session.error = None
                        
                        # Update task
                        session.current_task = data["message"]
                        session.status = "running"
                        
                        # Send acknowledgment
                        await session.send_status(
                            "status_update",
                            "Starting automation task..."
                        )
                        
                        # Update agent task
                        session.agent.task = data["message"]
                        
                        # Run automation with step handling
                        result = await handle_automation_step(session, session.agent)
                        
                        # Send completion
                        session.status = "completed"
                        await session.send_status(
                            "task_complete",
                            "Task completed successfully",
                            result=str(result)
                        )
                
                elif data["type"] == "stop_task":
                    if session.agent:
                        await session.agent.stop()
                    session.status = "stopped"
                    await session.send_status(
                        "status_update",
                        "Task stopped by user"
                    )
                
            except json.JSONDecodeError:
                logger.error("Invalid message format")
                if session:
                    await session.send_status(
                        "error",
                        "Invalid message format",
                        error_type="message",
                        recoverable=True
                    )
                continue
                
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected: {session_id}")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        if session and session.websocket.client_state == WebSocketState.CONNECTED:
            await session.send_status(
                "error",
                "WebSocket connection error",
                error_type="connection",
                details={"error": str(e)}
            )
    finally:
        # Clean up
        if session_id in active_sessions:
            await cleanup_session(session_id)

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "active_sessions": len(active_sessions),
        "timestamp": datetime.now().isoformat()
    } 