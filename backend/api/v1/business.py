from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from typing import List, Dict
from bson import ObjectId
import os
import magic
import hashlib
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorDatabase

from core.mongodb import get_db
from core.config import settings
from core.database import get_database
from services.business_service import BusinessService
from schemas.business import (
    Business,
    Document,
    Task,
    ComplianceEvent,
    DocumentType,
    TaskStatus,
    TaskPriority
)

router = APIRouter()

def verify_file_type(file: UploadFile) -> bool:
    """Verify if file type is allowed"""
    mime = magic.Magic(mime=True)
    file_content = file.file.read(2048)  # Read first 2KB
    file.file.seek(0)  # Reset file pointer
    file_type = mime.from_buffer(file_content)
    return file_type in settings.ALLOWED_FILE_TYPES

async def save_file(file: UploadFile, business_id: str, doc_type: str) -> str:
    """Save uploaded file and return file path"""
    # Create upload directory if it doesn't exist
    upload_dir = os.path.join(settings.UPLOAD_DIR, business_id)
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename
    file_ext = os.path.splitext(file.filename)[1]
    filename = f"{doc_type}_{datetime.utcnow().timestamp()}{file_ext}"
    file_path = os.path.join(upload_dir, filename)
    
    # Save file
    with open(file_path, "wb") as f:
        f.write(await file.read())
    
    return file_path

async def calculate_file_hash(file_path: str) -> str:
    """Calculate SHA-256 hash of file"""
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

async def get_business_service(db: AsyncIOMotorDatabase = Depends(get_database)) -> BusinessService:
    return BusinessService(db)

@router.post("/businesses", response_model=Business)
async def create_business(
    business_data: dict,
    business_service: BusinessService = Depends(get_business_service)
):
    """Create a new business"""
    return await business_service.create_business(business_data)

@router.get("/businesses/{business_id}", response_model=Business)
async def get_business(
    business_id: str,
    business_service: BusinessService = Depends(get_business_service)
):
    """Get business details"""
    return await business_service.get_business_by_id(business_id)

@router.put("/businesses/{business_id}", response_model=Business)
async def update_business(
    business_id: str,
    update_data: dict,
    business_service: BusinessService = Depends(get_business_service)
):
    """Update business details"""
    return await business_service.update_business(business_id, update_data)

@router.post("/businesses/{business_id}/documents", response_model=Document)
async def upload_document(
    business_id: str,
    doc_type: DocumentType,
    file: UploadFile = File(...),
    business_service: BusinessService = Depends(get_business_service)
):
    """Upload a document"""
    return await business_service.upload_document(business_id, doc_type, file)

@router.get("/businesses/{business_id}/documents/stats", response_model=Dict)
async def get_document_stats(
    business_id: str,
    business_service: BusinessService = Depends(get_business_service)
):
    """Get document statistics"""
    return await business_service.get_document_stats(business_id)

@router.post("/businesses/{business_id}/tasks", response_model=Task)
async def create_task(
    business_id: str,
    task_data: dict,
    business_service: BusinessService = Depends(get_business_service)
):
    """Create a new task"""
    return await business_service.create_task(business_id, task_data)

@router.get("/businesses/{business_id}/tasks/upcoming", response_model=List[Task])
async def get_upcoming_tasks(
    business_id: str,
    days: int = 30,
    business_service: BusinessService = Depends(get_business_service)
):
    """Get upcoming tasks"""
    return await business_service.get_upcoming_tasks(business_id, days)

@router.post("/businesses/{business_id}/compliance/events", response_model=ComplianceEvent)
async def create_compliance_event(
    business_id: str,
    event_data: dict,
    business_service: BusinessService = Depends(get_business_service)
):
    """Create a compliance event"""
    return await business_service.create_compliance_event(business_id, event_data)

@router.get("/businesses/{business_id}/compliance/score", response_model=float)
async def get_compliance_score(
    business_id: str,
    business_service: BusinessService = Depends(get_business_service)
):
    """Get compliance score"""
    return await business_service.get_compliance_score(business_id)

@router.put("/businesses/{business_id}/settings", response_model=Business)
async def update_settings(
    business_id: str,
    settings_data: dict,
    business_service: BusinessService = Depends(get_business_service)
):
    """Update business settings"""
    return await business_service.update_settings(business_id, settings_data)

@router.get("/businesses/{business_id}/dashboard", response_model=Dict)
async def get_dashboard_data(
    business_id: str,
    business_service: BusinessService = Depends(get_business_service)
):
    """Get dashboard data"""
    business = await business_service.get_business_by_id(business_id)
    
    # Get various statistics
    doc_stats = await business_service.get_document_stats(business_id)
    compliance_score = await business_service.get_compliance_score(business_id)
    upcoming_tasks = await business_service.get_upcoming_tasks(business_id)
    
    # Calculate task statistics
    urgent_tasks = sum(1 for task in upcoming_tasks if task.priority == TaskPriority.URGENT)
    normal_tasks = len(upcoming_tasks) - urgent_tasks
    
    return {
        "business_name": business.name,
        "compliance_score": compliance_score,
        "document_stats": doc_stats,
        "tasks": {
            "total": len(upcoming_tasks),
            "urgent": urgent_tasks,
            "normal": normal_tasks
        },
        "recent_activity": {
            "documents": [doc.dict() for doc in business.documents[-3:]],
            "tasks": [task.dict() for task in business.tasks[-3:]],
            "compliance_events": [event.dict() for event in business.compliance_events[-3:]]
        }
    }

@router.post("/businesses/{business_id}/verify", response_model=BusinessOnboarding)
async def complete_verification(
    business_id: str,
    terms_accepted: bool,
    blockchain_enabled: bool = False,
    business_service: BusinessService = Depends(get_business_service)
):
    """Complete the verification step"""
    return await business_service.complete_verification(
        business_id,
        terms_accepted,
        blockchain_enabled
    )

@router.get("/businesses/{business_id}/progress", response_model=Dict)
async def get_onboarding_progress(
    business_id: str,
    business_service: BusinessService = Depends(get_business_service)
):
    """Get onboarding progress details"""
    return await business_service.get_onboarding_progress(business_id)

@router.post("/onboarding/basic-info", response_model=BusinessOnboarding)
async def create_business_onboarding(
    basic_info: BasicInfo,
    db = Depends(get_db)
):
    """Step 1: Create business onboarding with basic info"""
    business = BusinessOnboarding(
        basic_info=basic_info
    )
    result = await db.businesses.insert_one(business.dict())
    return await db.businesses.find_one({"_id": result.inserted_id})

@router.put("/onboarding/{business_id}/business-details")
async def update_business_details(
    business_id: str,
    details: BusinessDetails,
    db = Depends(get_db)
):
    """Step 2: Update business details"""
    business = await db.businesses.find_one({
        "_id": ObjectId(business_id)
    })
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    result = await db.businesses.update_one(
        {"_id": ObjectId(business_id)},
        {
            "$set": {
                "business_details": details.dict(),
                "current_step": 3,
                "updated_at": datetime.utcnow()
            }
        }
    )
    return {"status": "success"}

@router.post("/onboarding/{business_id}/documents/{doc_type}")
async def upload_document(
    business_id: str,
    doc_type: str,
    file: UploadFile = File(...),
    db = Depends(get_db)
):
    """Step 3: Upload business documents"""
    # Verify business exists
    business = await db.businesses.find_one({
        "_id": ObjectId(business_id)
    })
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    # Verify file type
    if not verify_file_type(file):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type"
        )
    
    # Save file
    file_path = await save_file(file, business_id, doc_type)
    
    # Calculate hash
    file_hash = await calculate_file_hash(file_path)
    
    # Create document record
    document = Document(
        doc_type=doc_type,
        file_name=file.filename,
        file_path=file_path,
        hash=file_hash,
        ocr_status="pending"
    )
    
    # Update business record
    result = await db.businesses.update_one(
        {"_id": ObjectId(business_id)},
        {
            "$push": {"documents": document.dict()},
            "$set": {
                "current_step": 4,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {"status": "success", "document": document}

@router.put("/onboarding/{business_id}/team")
async def setup_team(
    business_id: str,
    team_setup: TeamSetup,
    db = Depends(get_db)
):
    """Step 4: Setup team members"""
    business = await db.businesses.find_one({
        "_id": ObjectId(business_id)
    })
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    result = await db.businesses.update_one(
        {"_id": ObjectId(business_id)},
        {
            "$set": {
                "team_setup": team_setup.dict(),
                "current_step": 5,
                "updated_at": datetime.utcnow()
            }
        }
    )
    return {"status": "success"}

@router.post("/onboarding/{business_id}/complete")
async def complete_onboarding(
    business_id: str,
    db = Depends(get_db)
):
    """Step 5: Complete onboarding"""
    business = await db.businesses.find_one({
        "_id": ObjectId(business_id)
    })
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    # Verify all steps are completed
    if not all([
        business.get("basic_info"),
        business.get("business_details"),
        business.get("documents"),
        business.get("team_setup")
    ]):
        raise HTTPException(
            status_code=400,
            detail="All onboarding steps must be completed"
        )
    
    result = await db.businesses.update_one(
        {"_id": ObjectId(business_id)},
        {
            "$set": {
                "status": "completed",
                "updated_at": datetime.utcnow()
            }
        }
    )
    return {"status": "success"}

@router.get("/onboarding/{business_id}", response_model=BusinessOnboarding)
async def get_business_onboarding(
    business_id: str,
    db = Depends(get_db)
):
    """Get business onboarding details"""
    business = await db.businesses.find_one({
        "_id": ObjectId(business_id)
    })
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    return business 