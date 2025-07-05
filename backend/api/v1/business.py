import logging
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from typing import List, Dict, Optional
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

# Set up logging
logger = logging.getLogger(__name__)

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

# ONBOARDING ENDPOINTS MATCHING FRONTEND EXACTLY

@router.post("/onboarding/start")
async def start_onboarding(
    data: dict,
    db = Depends(get_database)
):
    """Start the onboarding process with basic info (Step 1)"""
    try:
        logger.info(f"Starting onboarding for business: {data.get('businessName')}")
        
        # Validate required fields for step 1
        required_fields = ["businessName", "companyDescription", "legalEntityType", "industry", "incorporationDate"]
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            logger.warning(f"Missing required fields for onboarding: {missing_fields}")
            raise HTTPException(
                status_code=400,
                detail=f"Missing required fields: {', '.join(missing_fields)}"
            )
        
        # Create onboarding record
        onboarding = {
            "businessName": data["businessName"],
            "companyDescription": data["companyDescription"],
            "legalEntityType": data["legalEntityType"],
            "industry": data["industry"],
            "incorporationDate": data["incorporationDate"],
            "currentStep": 1,
            "status": "in_progress",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = db.businesses.insert_one(onboarding)
        business_id = str(result.inserted_id)
        
        # Get created record
        created_onboarding = db.businesses.find_one({"_id": result.inserted_id})
        created_onboarding["id"] = business_id
        del created_onboarding["_id"]
        
        logger.info(f"Successfully started onboarding for business ID: {business_id}")
        
        return {
            "business": created_onboarding,
            "message": "Onboarding started successfully",
            "next_step": 2
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error starting onboarding: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to start onboarding: {str(e)}"
        )

@router.put("/onboarding/{business_id}/business-details")
async def update_business_details(
    business_id: str,
    data: dict,
    db = Depends(get_database)
):
    """Update business details (Step 2)"""
    try:
        # Check if business exists
        business = db.businesses.find_one({"_id": ObjectId(business_id)})
        if not business:
            raise HTTPException(status_code=404, detail="Business not found")
        
        # Validate required fields for step 2
        required_fields = ["panNumber", "registeredAddress", "contactInfo"]
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required fields: {', '.join(missing_fields)}"
            )
        
        # Validate nested required fields
        if data.get("registeredAddress"):
            addr_required = ["street", "city", "state", "pincode"]
            addr_missing = [field for field in addr_required 
                          if not data["registeredAddress"].get(field)]
            if addr_missing:
                raise HTTPException(
                    status_code=400,
                    detail=f"Missing address fields: {', '.join(addr_missing)}"
                )
        
        if data.get("contactInfo"):
            contact_required = ["phone", "email"]
            contact_missing = [field for field in contact_required 
                             if not data["contactInfo"].get(field)]
            if contact_missing:
                raise HTTPException(
                    status_code=400,
                    detail=f"Missing contact fields: {', '.join(contact_missing)}"
                )
        
        # Update business record
        update_data = {
            "panNumber": data["panNumber"],
            "gstin": data.get("gstin"),
            "registeredAddress": data["registeredAddress"],
            "contactInfo": data["contactInfo"],
            "bankDetails": data.get("bankDetails"),
            "currentStep": 2,
            "updated_at": datetime.utcnow()
        }
        
        result = db.businesses.update_one(
            {"_id": ObjectId(business_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Business not found")
        
        # Get updated record
        updated_business = db.businesses.find_one({"_id": ObjectId(business_id)})
        updated_business["id"] = str(updated_business["_id"])
        del updated_business["_id"]
        
        return {
            "business": updated_business,
            "message": "Business details updated successfully",
            "next_step": 3
        }
        
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update business details: {str(e)}"
        )

@router.post("/onboarding/{business_id}/documents")
async def upload_documents(
    business_id: str,
    data: dict,
    db = Depends(get_database)
):
    """Upload documents - receive MongoDB file IDs (Step 3)"""
    try:
        # Check if business exists
        business = db.businesses.find_one({"_id": ObjectId(business_id)})
        if not business:
            raise HTTPException(status_code=404, detail="Business not found")
        
        # Validate required documents
        if not data.get("incorporation") or not data.get("panCard"):
            raise HTTPException(
                status_code=400,
                detail="Incorporation certificate and PAN card file IDs are required"
            )
        
        documents = {}
        
        # Process document file IDs from our MongoDB storage
        document_fields = [
            ("incorporation", True),
            ("panCard", True),
            ("gstCertificate", False),
            ("bankStatements", False)
        ]
        
        for doc_type, is_required in document_fields:
            if data.get(doc_type):
                file_id = data[doc_type]
                
                # Validate that the file exists in our database
                file_metadata = db.file_metadata.find_one({"_id": ObjectId(file_id)})
                if not file_metadata:
                    raise HTTPException(
                        status_code=400,
                        detail=f"File ID {file_id} for {doc_type} not found in database"
                    )
                
                # Validate file type
                if file_metadata.get("content_type") != "application/pdf":
                    raise HTTPException(
                        status_code=400,
                        detail=f"File {file_id} for {doc_type} must be a PDF"
                    )
                
                # Create document record
                documents[doc_type] = {
                    "name": file_metadata.get("filename", f"{doc_type}_document"),
                    "type": doc_type,
                    "file_id": file_id,
                    "filename": file_metadata.get("filename"),
                    "file_size": file_metadata.get("file_size"),
                    "file_hash": file_metadata.get("file_hash"),
                    "uploaded_at": datetime.utcnow(),
                    "status": "uploaded",
                    "source": "mongodb_gridfs"
                }
            elif is_required:
                raise HTTPException(
                    status_code=400,
                    detail=f"Required document {doc_type} is missing"
                )
        
        # Update business record
        update_data = {
            "documents": documents,
            "currentStep": 3,
            "updated_at": datetime.utcnow()
        }
        
        result = db.businesses.update_one(
            {"_id": ObjectId(business_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Business not found")
        
        logger.info(f"Successfully saved document references for business {business_id}")
        
        return {
            "documents": documents,
            "message": "Documents uploaded successfully",
            "next_step": 4
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading documents: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload documents: {str(e)}"
        )

@router.post("/onboarding/{business_id}/complete")
async def complete_onboarding(
    business_id: str,
    data: dict,
    db = Depends(get_database)
):
    """Complete onboarding (Step 4 - Verification)"""
    try:
        # Check if business exists
        business = db.businesses.find_one({"_id": ObjectId(business_id)})
        if not business:
            raise HTTPException(status_code=404, detail="Business not found")
        
        # Validate required fields
        if not data.get("termsAccepted"):
            raise HTTPException(
                status_code=400,
                detail="Terms and conditions must be accepted"
            )
        
        # Check if all previous steps are completed
        required_steps = ["businessName", "panNumber", "registeredAddress", "contactInfo", "documents"]
        missing_steps = [step for step in required_steps if not business.get(step)]
        
        if missing_steps:
            raise HTTPException(
                status_code=400,
                detail=f"Complete previous steps first. Missing: {', '.join(missing_steps)}"
            )
        
        # Update business record to complete onboarding
        update_data = {
            "termsAccepted": data["termsAccepted"],
            "blockchainHashing": data.get("blockchainHashing", True),
            "currentStep": 4,
            "status": "completed",
            "completed_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = db.businesses.update_one(
            {"_id": ObjectId(business_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Business not found")
        
        # Get completed business record
        completed_business = db.businesses.find_one({"_id": ObjectId(business_id)})
        completed_business["id"] = str(completed_business["_id"])
        del completed_business["_id"]
        
        return {
            "business": completed_business,
            "message": "Onboarding completed successfully!",
            "status": "completed"
        }
        
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=500,
            detail=f"Failed to complete onboarding: {str(e)}"
        )

@router.get("/onboarding/{business_id}")
async def get_onboarding_status(
    business_id: str,
    db = Depends(get_database)
):
    """Get onboarding status and data"""
    try:
        business = db.businesses.find_one({"_id": ObjectId(business_id)})
        if not business:
            raise HTTPException(status_code=404, detail="Business not found")
        
        # Convert ObjectId to string for response
        business["id"] = str(business["_id"])
        del business["_id"]
        
        return {
            "business": business,
            "currentStep": business.get("currentStep", 1),
            "status": business.get("status", "in_progress"),
            "progress": {
                "step1_complete": bool(business.get("businessName")),
                "step2_complete": bool(business.get("panNumber") and business.get("registeredAddress")),
                "step3_complete": bool(business.get("documents")),
                "step4_complete": bool(business.get("termsAccepted")),
            }
        }
        
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get onboarding status: {str(e)}"
        )

@router.get("/onboarding")
async def list_onboarding_businesses(
    status: Optional[str] = None,
    db = Depends(get_database)
):
    """List all onboarding businesses"""
    try:
        query = {}
        if status:
            query["status"] = status
        
        businesses = list(db.businesses.find(query))
        
        # Convert ObjectId to string for response
        for business in businesses:
            business["id"] = str(business["_id"])
            del business["_id"]
        
        return {
            "businesses": businesses,
            "total": len(businesses)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to list businesses: {str(e)}"
        )

# EXISTING BUSINESS MANAGEMENT ENDPOINTS

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