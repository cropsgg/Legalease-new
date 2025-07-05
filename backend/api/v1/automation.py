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
from contextlib import asynccontextmanager
import traceback

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Override OpenAI API key if not set in environment
if not settings.OPENAI_API_KEY:
    settings.OPENAI_API_KEY = "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"

router = APIRouter(prefix="/automation", tags=["automation"])

# Store active sessions
active_sessions: Dict[str, Any] = {}

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
    """Analyze user message to determine intent and extract context"""
    user_message_lower = user_message.lower()
    
    # Check for tax filing keywords
    tax_keywords = ['tax', 'itr', 'income tax', 'filing', 'return', 'assessment', 'tax return', 'file itr']
    if any(keyword in user_message_lower for keyword in tax_keywords):
        intent_data = {
            "intent": "tax_filing",
            "requires_automation": True,
            "task_type": "tax_filing",
            "confidence": 0.9
        }
        
        # Check for specific tax filing actions
        if any(action in user_message_lower for action in ['start', 'begin', 'file', 'submit']):
            intent_data["action"] = "start_filing"
            intent_data["confidence"] = 0.95
        elif any(action in user_message_lower for action in ['check', 'status', 'verify', 'review']):
            intent_data["action"] = "check_status"
            intent_data["confidence"] = 0.8
        elif any(action in user_message_lower for action in ['help', 'guide', 'how', 'explain']):
            intent_data["action"] = "help_guide"
            intent_data["confidence"] = 0.7
        
        return intent_data
    
    # Check for form filling keywords
    form_keywords = ['form', 'application', 'government', 'fill', 'submit', 'portal', 'government portal']
    if any(keyword in user_message_lower for keyword in form_keywords):
        return {
            "intent": "form_filling",
            "requires_automation": True,
            "task_type": "form_filling",
            "confidence": 0.8
        }
    
    # Check for help/guidance keywords
    help_keywords = ['help', 'guide', 'how', 'what', 'explain', 'understand', 'learn']
    if any(keyword in user_message_lower for keyword in help_keywords):
        return {
            "intent": "help",
            "requires_automation": False,
            "task_type": "chat",
            "confidence": 0.6
        }
    
    # Default to chat response
    return {
        "intent": "chat",
        "requires_automation": False,
        "task_type": "chat",
        "confidence": 0.5
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

def extract_user_data(user_message: str) -> Dict[str, Any]:
    """Extract user data from chat message for tax filing"""
    user_data = {
        "pan_number": "ABCDE1234F",  # Default test PAN
        "mobile_number": "9876543210",  # Default test mobile
        "assessment_year": "2023-24",
        "itr_type": "ITR-2",
        "filing_mode": "Online Filing",
        "additional_incomes": [
            {"type": "Rental Income", "amount": 25235},
            {"type": "Interest Income", "amount": 3252530}
        ],
        "deductions": [
            {"type": "80D - Health Insurance Premium", "description": "Health Insurance Premium", "amount": 25000},
            {"type": "80C - Tax Saving Investment", "description": "Investment", "amount": 150000}
        ]
    }
    
    # Extract PAN if provided
    import re
    pan_match = re.search(r'PAN[:\s]*([A-Z]{5}[0-9]{4}[A-Z])', user_message.upper())
    if pan_match:
        user_data["pan_number"] = pan_match.group(1)
    
    # Extract mobile number if provided
    mobile_match = re.search(r'(?:mobile|phone|number)[:\s]*([0-9]{10})', user_message)
    if mobile_match:
        user_data["mobile_number"] = mobile_match.group(1)
    
    # Extract assessment year if provided
    year_match = re.search(r'(?:assessment year|AY|year)[:\s]*([0-9]{4}-[0-9]{2})', user_message)
    if year_match:
        user_data["assessment_year"] = year_match.group(1)
    
    # Extract ITR type if provided
    itr_match = re.search(r'ITR[:\s]*([1-4])', user_message)
    if itr_match:
        user_data["itr_type"] = f"ITR-{itr_match.group(1)}"
    
    return user_data

def get_tax_filing_task(user_prompt: str) -> str:
    """Convert user prompt into detailed tax filing task"""
    user_data = extract_user_data(user_prompt)
    
    # Generate income entries
    income_entries = ""
    for income in user_data["additional_incomes"]:
        income_entries += f"""
         * Click "Add Income" button
         * Select "{income['type']}" from dropdown
         * Enter amount: {income['amount']}"""
    
    # Generate deduction entries
    deduction_entries = ""
    for deduction in user_data["deductions"]:
        deduction_entries += f"""
         * Click "Add Deduction" button
         * Select "{deduction['type']}"
         * Enter description: "{deduction['description']}"
         * Enter amount: {deduction['amount']}"""
    
    base_task = f"""
    User request: '{user_prompt}'
    
    Based on the user request, perform tax filing automation with the following details:
    - PAN Number: {user_data['pan_number']}
    - Mobile: {user_data['mobile_number']}
    - Assessment Year: {user_data['assessment_year']}
    - ITR Type: {user_data['itr_type']}
    
    Follow these steps precisely to complete the tax filing process:

    1. LOGIN PHASE:
       - Navigate to: https://income-tax-ai-alphaq.vercel.app/
       - Verify login form elements are present:
         * PAN Number field
         * Captcha field
         * "Get OTP" button
       - Enter PAN: {user_data['pan_number']}
       - Read and enter the captcha shown on screen (look carefully at the image)
       - Click "Get OTP" button
       - When OTP field appears, enter: 123456
       - Click final login button
       - Verify successful login by checking for dashboard elements

    2. START FILING PHASE:
       - On dashboard, locate "File ITR" section
       - Click "Start Filing" button
       - In the filing form:
         * Click Assessment Year dropdown
         * Select "{user_data['assessment_year']}"
         * Select ITR Type: "{user_data['itr_type']}"
         * Choose Filing Mode: "{user_data['filing_mode']}"
       - Click "Continue" button

    3. PRE-FILLED INFO PHASE:
       - Review pre-filled information
       - Verify personal details are correct
       - Click "Continue to Income & Deductions"

    4. INCOME & DEDUCTIONS PHASE:
       - Under "Other Income" section:{income_entries}

       - Under "Deductions" section:{deduction_entries}

       - If any entry needs deletion, use the red delete button
       - Click "Continue to Tax Summary"

    5. TAX SUMMARY & PAYMENT PHASE:
       - Review tax calculation summary
       - Verify calculated tax amounts
       - Click "Continue to Payment"
       - Select any available payment method (UPI/Net Banking/Card)
       - Click "Make Payment"

    6. FINAL SUBMISSION:
       - Review all information in submission page
       - Verify all details are correct
       - Check "I accept the above declaration" checkbox
       - Click "Submit Return"
       - Verify successful submission message
       - Note down acknowledgment number if provided

    Important Instructions:
    - Take your time with each step and wait for page loads
    - If any element is not found, wait a moment and try again
    - Document each successful action with clear descriptions
    - If any step fails, provide detailed error information
    - Ensure each page loads completely before proceeding
    - If captcha is unclear, describe what you see and try your best guess
    - Take screenshots of any errors or important screens
    """
    return base_task

@asynccontextmanager
async def error_handler(session: AutomationSession, error_type: str):
    """Async context manager for handling errors and sending error messages to client"""
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
    async with error_handler(session, "screenshot"):
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
        async with error_handler(session, "agent"):
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
                    user_message = data["message"]
                    
                    # Analyze user intent
                    intent_data = analyze_user_intent(user_message)
                    
                    if intent_data["requires_automation"]:
                        async with error_handler(session, "automation"):
                            # Reset step counter
                            session.step_count = 0
                            session.current_step = None
                            session.error = None
                            
                            # Update task
                            session.current_task = user_message
                            session.status = "running"
                            
                            # Send acknowledgment with intent info
                            await session.send_status(
                                "status_update",
                                f"Starting {intent_data['task_type']} automation... (Confidence: {intent_data['confidence']*100:.0f}%)"
                            )
                            
                            # Generate appropriate task based on intent
                            if intent_data["task_type"] == "tax_filing":
                                detailed_task = get_tax_filing_task(user_message)
                                session.agent.task = detailed_task
                            else:
                                session.agent.task = user_message
                            
                            # Run automation with step handling
                            result = await handle_automation_step(session, session.agent)
                            
                            # Send completion
                            session.status = "completed"
                            await session.send_status(
                                "task_complete",
                                "Task completed successfully",
                                result=str(result)
                            )
                    else:
                        # Handle as chat message
                        try:
                            # Send typing indicator
                            await session.send_status(
                                "typing",
                                "Thinking..."
                            )
                            
                            chat_response = await get_chat_response(user_message, session_id)
                            await session.send_status(
                                "chat_response",
                                chat_response
                            )
                        except Exception as e:
                            logger.error(f"Chat response error: {e}")
                            await session.send_status(
                                "error",
                                "I'm having trouble responding right now. Please try again.",
                                error_type="chat",
                                recoverable=True
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