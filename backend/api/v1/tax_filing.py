"""Tax filing API endpoints"""
from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import Optional, Dict, Any
from .automation import get_tax_filing_task, active_sessions
import uuid
import json

# Define new Pydantic models for request/response
class TaxFilingRequest(BaseModel):
    pan_number: str
    assessment_year: str = "2023-24"
    itr_type: str = "ITR-2"
    income_details: Optional[Dict[str, float]] = None
    deductions: Optional[Dict[str, float]] = None

class FilingResponse(BaseModel):
    status: str
    message: str
    acknowledgment_number: Optional[str] = None
    session_id: str

router = APIRouter(prefix="/tax-filing", tags=["tax-filing"])

@router.websocket("/ws/{session_id}")
async def tax_filing_websocket(websocket: WebSocket, session_id: str):
    """WebSocket endpoint for tax filing automation updates"""
    await websocket.accept()
    
    try:
        # Store the websocket connection
        active_sessions[session_id] = {
            'websocket': websocket,
            'status': 'connected',
            'agent': None
        }
        
        # Keep connection alive until client disconnects
        while True:
            data = await websocket.receive_text()
            try:
                message = json.loads(data)
                if message.get('type') == 'start_filing':
                    # Get filing details from message
                    filing_details = message.get('filing_details', {})
                    
                    # Create tax filing task
                    task = get_tax_filing_task(
                        f"File ITR for PAN: {filing_details.get('pan_number')}, "
                        f"Assessment Year: {filing_details.get('assessment_year', '2023-24')}, "
                        f"ITR Type: {filing_details.get('itr_type', 'ITR-2')}"
                    )
                    
                    # Send task created message
                    await websocket.send_text(json.dumps({
                        "type": "task_created",
                        "message": "Tax filing task created successfully",
                        "task": task[:200] + "..." if len(task) > 200 else task
                    }))
                    
            except json.JSONDecodeError:
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "message": "Invalid message format"
                }))
                
    except WebSocketDisconnect:
        if session_id in active_sessions:
            del active_sessions[session_id]
    except Exception as e:
        await websocket.send_text(json.dumps({
            "type": "error",
            "message": str(e)
        }))
    finally:
        if session_id in active_sessions:
            del active_sessions[session_id]

@router.post("/initiate", response_model=FilingResponse)
async def initiate_tax_filing(request: TaxFilingRequest):
    """
    Initiate tax filing automation and return session ID for WebSocket connection
    """
    try:
        # Generate a session ID for this filing
        session_id = str(uuid.uuid4())
        
        return FilingResponse(
            status="ready",
            message="Connect to WebSocket endpoint to start tax filing",
            session_id=session_id
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to initiate tax filing: {str(e)}"
        )

@router.get("/status/{session_id}")
async def get_filing_status(session_id: str):
    """
    Get status of filed return using session ID
    """
    if session_id not in active_sessions:
        raise HTTPException(
            status_code=404,
            detail="Filing session not found"
        )
    
    status = active_sessions[session_id]['status']
    return {
        "status": status,
        "message": f"Tax filing {status}"
    } 