from typing import Optional, List, Dict
from datetime import datetime, timedelta
from bson import ObjectId
from fastapi import HTTPException, UploadFile
import magic
import hashlib
import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorDatabase

from core.config import settings
from schemas.business import (
    Business,
    Document,
    Task,
    ComplianceEvent,
    DocumentType,
    TaskStatus,
    TaskPriority
)

class BusinessService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = self.db.businesses

    async def create_business(self, business_data: dict) -> Business:
        """Create a new business"""
        business = Business(**business_data)
        result = await self.collection.insert_one(business.dict())
        return await self.get_business_by_id(str(result.inserted_id))

    async def get_business_by_id(self, business_id: str) -> Business:
        """Get business by ID"""
        business = await self.collection.find_one({"_id": ObjectId(business_id)})
        if not business:
            raise HTTPException(status_code=404, detail="Business not found")
        return Business(**business)

    async def update_business(self, business_id: str, update_data: dict) -> Business:
        """Update business details"""
        update_data["updated_at"] = datetime.utcnow()
        
        result = await self.collection.update_one(
            {"_id": ObjectId(business_id)},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Business not found")
        
        return await self.get_business_by_id(business_id)

    async def upload_document(
        self,
        business_id: str,
        doc_type: DocumentType,
        file: UploadFile
    ) -> Document:
        """Upload and process a document"""
        # Verify file type
        mime = magic.Magic(mime=True)
        file_content = file.file.read(2048)
        file.file.seek(0)
        file_type = mime.from_buffer(file_content)
        
        if file_type not in settings.ALLOWED_FILE_TYPES:
            raise HTTPException(status_code=400, detail="Invalid file type")
        
        # Save file
        upload_dir = os.path.join(settings.UPLOAD_DIR, business_id)
        os.makedirs(upload_dir, exist_ok=True)
        
        file_ext = os.path.splitext(file.filename)[1]
        filename = f"{doc_type.value}_{datetime.utcnow().timestamp()}{file_ext}"
        file_path = os.path.join(upload_dir, filename)
        
        with open(file_path, "wb") as f:
            f.write(await file.read())
        
        # Calculate hash
        sha256_hash = hashlib.sha256()
        with open(file_path, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        
        # Create document record
        document = Document(
            name=file.filename,
            doc_type=doc_type,
            file_path=file_path,
            mime_type=file_type,
            size=os.path.getsize(file_path),
            hash=sha256_hash.hexdigest()
        )
        
        # Update business record
        result = await self.collection.update_one(
            {"_id": ObjectId(business_id)},
            {
                "$push": {"documents": document.dict()},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        # Start OCR processing in background if enabled
        if settings.OCR_ENABLED:
            asyncio.create_task(self._process_document_ocr(business_id, document))
        
        return document

    async def _process_document_ocr(self, business_id: str, document: Document):
        """Background task for OCR processing"""
        try:
            # Simulate OCR processing
            await asyncio.sleep(2)
            ocr_data = {
                "processed": True,
                "text": "Sample OCR text",
                "processed_at": datetime.utcnow().isoformat()
            }
            
            await self.collection.update_one(
                {
                    "_id": ObjectId(business_id),
                    "documents.id": document.id
                },
                {
                    "$set": {
                        "documents.$.ocr_status": "completed",
                        "documents.$.ocr_data": ocr_data
                    }
                }
            )
        except Exception as e:
            await self.collection.update_one(
                {
                    "_id": ObjectId(business_id),
                    "documents.id": document.id
                },
                {
                    "$set": {
                        "documents.$.ocr_status": "failed",
                        "documents.$.ocr_data": {"error": str(e)}
                    }
                }
            )

    async def create_task(self, business_id: str, task_data: dict) -> Task:
        """Create a new task"""
        task = Task(**task_data)
        
        result = await self.collection.update_one(
            {"_id": ObjectId(business_id)},
            {
                "$push": {"tasks": task.dict()},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Business not found")
        
        return task

    async def create_compliance_event(
        self,
        business_id: str,
        event_data: dict
    ) -> ComplianceEvent:
        """Create a new compliance event"""
        event = ComplianceEvent(**event_data)
        
        result = await self.collection.update_one(
            {"_id": ObjectId(business_id)},
            {
                "$push": {"compliance_events": event.dict()},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Business not found")
        
        return event

    async def get_upcoming_tasks(self, business_id: str, days: int = 30) -> List[Task]:
        """Get upcoming tasks for the next N days"""
        business = await self.get_business_by_id(business_id)
        
        cutoff_date = datetime.utcnow() + timedelta(days=days)
        upcoming_tasks = [
            task for task in business.tasks
            if task.status != TaskStatus.COMPLETED
            and task.due_date <= cutoff_date
        ]
        
        return sorted(upcoming_tasks, key=lambda x: x.due_date)

    async def get_compliance_score(self, business_id: str) -> float:
        """Calculate compliance score based on tasks and events"""
        business = await self.get_business_by_id(business_id)
        
        total_items = len(business.tasks) + len(business.compliance_events)
        if total_items == 0:
            return 100.0
        
        completed_tasks = sum(
            1 for task in business.tasks
            if task.status == TaskStatus.COMPLETED
        )
        completed_events = sum(
            1 for event in business.compliance_events
            if event.status == TaskStatus.COMPLETED
        )
        
        score = ((completed_tasks + completed_events) / total_items) * 100
        
        # Update business compliance score
        await self.collection.update_one(
            {"_id": ObjectId(business_id)},
            {"$set": {"compliance_score": score}}
        )
        
        return score

    async def get_document_stats(self, business_id: str) -> Dict:
        """Get document statistics"""
        business = await self.get_business_by_id(business_id)
        
        total_size = sum(doc.size for doc in business.documents)
        doc_types = {}
        for doc in business.documents:
            doc_types[doc.doc_type] = doc_types.get(doc.doc_type, 0) + 1
        
        return {
            "total_documents": len(business.documents),
            "total_size": total_size,
            "by_type": doc_types,
            "processing_status": {
                "completed": sum(1 for doc in business.documents if doc.ocr_status == "completed"),
                "pending": sum(1 for doc in business.documents if doc.ocr_status == "pending"),
                "failed": sum(1 for doc in business.documents if doc.ocr_status == "failed")
            }
        }

    async def update_settings(self, business_id: str, settings_data: dict) -> Business:
        """Update business settings"""
        result = await self.collection.update_one(
            {"_id": ObjectId(business_id)},
            {
                "$set": {
                    "settings": settings_data,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Business not found")
        
        return await self.get_business_by_id(business_id) 