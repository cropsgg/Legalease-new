import asyncio
import base64
import json
import uuid
from typing import Dict, Any
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from browser_use.agent.service import Agent
from browser_use.llm import ChatOpenAI
from core.config import settings
import os
import logging

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

# Global automation agent
automation_agent = None

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

async def initialize_automation():
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

async def automation_agent_runner(task: str, websocket: WebSocket, session_id: str):
    """Run the browser automation agent"""
    agent = None
    try:
        # Update session status
        if session_id in active_sessions:
            active_sessions[session_id]['status'] = 'initializing'
        
        await websocket.send_text(json.dumps({
            "type": "status_update",
            "status": "initializing",
            "message": "Starting browser automation..."
        }))

        # Define callback functions
        async def on_step_start_callback(agent_instance: Agent):
            try:
                if hasattr(agent_instance.browser_context, 'page'):
                    current_url = await agent_instance.browser_context.page.url()
                    await websocket.send_text(json.dumps({
                        "type": "status_update",
                        "status": "running",
                        "url": current_url,
                        "message": "Executing automation step..."
                    }))
            except Exception as e:
                logger.error(f"Step start callback error: {e}")

        async def on_step_end_callback(agent_instance: Agent):
            try:
                if hasattr(agent_instance.browser_context, 'page'):
                    # Capture screenshot
                    screenshot_bytes = await agent_instance.browser_context.page.screenshot(
                        type="jpeg", 
                        quality=70,
                        full_page=False
                    )
                    screenshot_base64 = base64.b64encode(screenshot_bytes).decode('utf-8')
                    
                    # Get page info
                    current_url = await agent_instance.browser_context.page.url()
                    page_title = await agent_instance.browser_context.page.title()
                    
                    # Get last action
                    last_action = "Processing..."
                    if agent_instance.state.history.history:
                        last_entry = agent_instance.state.history.history[-1]
                        if hasattr(last_entry, 'result') and last_entry.result:
                            action_text = str(last_entry.result[-1])
                            last_action = action_text[:100] + "..." if len(action_text) > 100 else action_text
                    
                    # Send screenshot update
                    await websocket.send_text(json.dumps({
                        "type": "screenshot",
                        "screenshot": screenshot_base64,
                        "url": current_url,
                        "title": page_title
                    }))

                    # Send action log
                    await websocket.send_text(json.dumps({
                        "type": "action_log",
                        "action": last_action,
                        "message": f"Completed action on: {page_title}"
                    }))

            except Exception as e:
                logger.error(f"Step end callback error: {e}")
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "message": f"Screenshot capture failed: {str(e)}"
                }))

        # Create the agent
        agent = Agent(
            task=task,
            llm=ChatOpenAI(
                model="gpt-3.5-turbo",
                temperature=0.1,
                api_key=settings.OPENAI_API_KEY,
            ),
            headless=False,  # Set to False to see the browser
            ignore_https_errors=True,
            timeout=60000,
            source="web-ui",
            context_config={
                "save_recording_path": recording_dir,
                "performance_mode": True,
                "bypass_csp": True,
                "javascript_enabled": True,
                "viewport": {"width": 1920, "height": 1080},
                "record_video": {
                    "dir": recording_dir,
                    "size": {"width": 1920, "height": 1080}
                }
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
            },
            generate_gif=True
        )

        # Update session
        if session_id in active_sessions:
            active_sessions[session_id]['agent'] = agent
            active_sessions[session_id]['status'] = 'running'

        await websocket.send_text(json.dumps({
            "type": "status_update",
            "status": "running",
            "message": "Browser automation is now running..."
        }))

        # Run the agent
        result = await agent.run(
            on_step_start=on_step_start_callback,
            on_step_end=on_step_end_callback
        )
        
        # Send completion
        final_result = result.final_result() if hasattr(result, 'final_result') else str(result)
        await websocket.send_text(json.dumps({
            "type": "task_complete",
            "status": "completed",
            "message": f"✅ Task completed successfully!",
            "result": final_result
        }))

        if session_id in active_sessions:
            active_sessions[session_id]['status'] = 'completed'

    except Exception as e:
        error_msg = f"Automation error: {str(e)}"
        logger.error(error_msg)
        await websocket.send_text(json.dumps({
            "type": "error",
            "status": "error",
            "message": error_msg
        }))
        
        if session_id in active_sessions:
            active_sessions[session_id]['status'] = 'error'
    
    finally:
        # Cleanup
        if agent:
            try:
                await agent.close()
            except Exception as e:
                logger.error(f"Error closing agent: {e}")
        
        if session_id in active_sessions:
            del active_sessions[session_id]
        
        logger.info(f"Session {session_id} cleaned up")

async def send_screenshot(websocket: WebSocket):
    """Send browser screenshot to client"""
    try:
        if automation_agent and automation_agent.browser:
            screenshot = await automation_agent.browser.screenshot()
            current_url = automation_agent.browser.url
            await websocket.send_json({
                "type": "screenshot",
                "screenshot": screenshot,
                "url": current_url
            })
    except Exception as e:
        logger.error(f"Failed to send screenshot: {e}")

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for browser automation"""
    await websocket.accept()
    client_id = str(id(websocket))
    active_connections[client_id] = websocket
    
    try:
        # Send initial connection message
        await websocket.send_json({
            "type": "connection",
            "message": "Connected to automation service! You can now chat or request automation tasks."
        })

        # Start screenshot update loop
        screenshot_task = asyncio.create_task(update_screenshots(websocket))

        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message["type"] == "chat_message":
                # Process chat message and start automation
                await handle_automation_request(websocket, message["message"])
            elif message["type"] == "stop_task":
                # Stop current automation task
                if automation_agent:
                    await automation_agent.stop()
                await websocket.send_json({
                    "type": "status_update",
                    "status": "stopped",
                    "message": "Task stopped by user"
                })

    except WebSocketDisconnect:
        logger.info(f"Client {client_id} disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        active_connections.pop(client_id, None)
        screenshot_task.cancel()

async def update_screenshots(websocket: WebSocket):
    """Continuously update browser screenshots"""
    try:
        while True:
            await send_screenshot(websocket)
            await asyncio.sleep(1)  # Update every second
    except asyncio.CancelledError:
        pass
    except Exception as e:
        logger.error(f"Screenshot update error: {e}")

async def handle_automation_request(websocket: WebSocket, message: str):
    """Handle automation request from user"""
    try:
        if not automation_agent:
            await websocket.send_json({
                "type": "error",
                "message": "Browser automation is not available"
            })
            return

        # Update task
        automation_agent.task = message
        
        # Send acknowledgment
        await websocket.send_json({
            "type": "chat_response",
            "message": "Starting automation task..."
        })

        # Start automation
        result = await automation_agent.run()
        
        # Send completion message
        await websocket.send_json({
            "type": "task_complete",
            "message": "Task completed successfully!"
        })

    except Exception as e:
        logger.error(f"Automation error: {e}")
        await websocket.send_json({
            "type": "error",
            "message": f"Automation failed: {str(e)}"
        })

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "automation": "available" if automation_agent else "not_initialized"
    } 