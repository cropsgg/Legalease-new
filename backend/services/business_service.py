import logging
from typing import Optional, List, Dict
from datetime import datetime, timedelta
from bson import ObjectId
from fastapi import HTTPException, UploadFile
from pymongo.errors import DuplicateKeyError, OperationFailure
import magic
import hashlib
import os
import asyncio
from pymongo.database import Database

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

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BusinessService:
    def __init__(self, db: Database):
        self.db = db
        self.collection = self.db.businesses

    async def create_business(self, business_data: dict) -> Business:
        """Create a new business"""
        try:
            business = Business(**business_data)
            result = self.collection.insert_one(business.dict())
            
            # Get the created business
            created_business = self.collection.find_one(
                {"_id": result.inserted_id}
            )
            return Business(**created_business)
            
        except DuplicateKeyError as e:
            logger.error(f"Duplicate key error: {e}")
            raise HTTPException(
                status_code=400,
                detail="Business with this name or PAN/GSTIN already exists"
            )
        except Exception as e:
            logger.error(f"Error creating business: {e}")
            raise HTTPException(
                status_code=500,
                detail="Failed to create business"
            )

    async def get_business_by_id(self, business_id: str) -> Business:
        """Get business by ID"""
        try:
            business = self.collection.find_one({"_id": ObjectId(business_id)})
            if not business:
                raise HTTPException(status_code=404, detail="Business not found")
            return Business(**business)
        except Exception as e:
            logger.error(f"Error getting business: {e}")
            raise HTTPException(
                status_code=500,
                detail="Failed to get business"
            )

    async def update_business(self, business_id: str, update_data: dict) -> Business:
        """Update business details"""
        try:
            update_data["updated_at"] = datetime.utcnow()
            
            result = self.collection.update_one(
                {"_id": ObjectId(business_id)},
                {"$set": update_data}
            )
            
            if result.modified_count == 0:
                raise HTTPException(status_code=404, detail="Business not found")
            
            return await self.get_business_by_id(business_id)
            
        except DuplicateKeyError as e:
            logger.error(f"Duplicate key error: {e}")
            raise HTTPException(
                status_code=400,
                detail="Business with this name or PAN/GSTIN already exists"
            )
        except Exception as e:
            logger.error(f"Error updating business: {e}")
            raise HTTPException(
                status_code=500,
                detail="Failed to update business"
            )

    async def upload_document(
        self,
        business_id: str,
        doc_type: DocumentType,
        file: UploadFile
    ) -> Document:
        """Upload and process a document"""
        try:
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
            result = self.collection.update_one(
                {"_id": ObjectId(business_id)},
                {
                    "$push": {"documents": document.dict()},
                    "$set": {"updated_at": datetime.utcnow()}
                }
            )
            
            if result.modified_count == 0:
                raise HTTPException(status_code=404, detail="Business not found")
            
            # Start OCR processing in background if enabled
            if settings.OCR_ENABLED:
                asyncio.create_task(self._process_document_ocr(business_id, document))
            
            return document
            
        except Exception as e:
            logger.error(f"Error uploading document: {e}")
            # Clean up file if upload failed
            if 'file_path' in locals() and os.path.exists(file_path):
                os.remove(file_path)
            raise HTTPException(
                status_code=500,
                detail="Failed to upload document"
            )

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
            
            self.collection.update_one(
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
            logger.error(f"Error processing OCR: {e}")
            self.collection.update_one(
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
        try:
            task = Task(**task_data)
            
            result = self.collection.update_one(
                {"_id": ObjectId(business_id)},
                {
                    "$push": {"tasks": task.dict()},
                    "$set": {"updated_at": datetime.utcnow()}
                }
            )
            
            if result.modified_count == 0:
                raise HTTPException(status_code=404, detail="Business not found")
            
            return task
            
        except Exception as e:
            logger.error(f"Error creating task: {e}")
            raise HTTPException(
                status_code=500,
                detail="Failed to create task"
            )

    async def create_compliance_event(
        self,
        business_id: str,
        event_data: dict
    ) -> ComplianceEvent:
        """Create a new compliance event"""
        event = ComplianceEvent(**event_data)
        
        result = self.collection.update_one(
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
        try:
            cutoff_date = datetime.utcnow() + timedelta(days=days)
            
            pipeline = [
                {"$match": {"_id": ObjectId(business_id)}},
                {"$unwind": "$tasks"},
                {
                    "$match": {
                        "tasks.status": {"$ne": TaskStatus.COMPLETED},
                        "tasks.due_date": {"$lte": cutoff_date}
                    }
                },
                {"$sort": {"tasks.due_date": 1}},
                {"$group": {
                    "_id": "$_id",
                    "tasks": {"$push": "$tasks"}
                }}
            ]
            
            result = list(self.collection.aggregate(pipeline))
            if not result:
                return []
            
            return [Task(**task) for task in result[0]["tasks"]]
            
        except Exception as e:
            logger.error(f"Error getting upcoming tasks: {e}")
            raise HTTPException(
                status_code=500,
                detail="Failed to get upcoming tasks"
            )

    async def get_compliance_score(self, business_id: str) -> float:
        """Calculate compliance score based on tasks and events"""
        try:
            pipeline = [
                {"$match": {"_id": ObjectId(business_id)}},
                {
                    "$project": {
                        "total_tasks": {"$size": "$tasks"},
                        "total_events": {"$size": "$compliance_events"},
                        "completed_tasks": {
                            "$size": {
                                "$filter": {
                                    "input": "$tasks",
                                    "cond": {"$eq": ["$$this.status", TaskStatus.COMPLETED]}
                                }
                            }
                        },
                        "completed_events": {
                            "$size": {
                                "$filter": {
                                    "input": "$compliance_events",
                                    "cond": {"$eq": ["$$this.status", TaskStatus.COMPLETED]}
                                }
                            }
                        }
                    }
                }
            ]
            
            result = list(self.collection.aggregate(pipeline))
            if not result:
                raise HTTPException(status_code=404, detail="Business not found")
            
            data = result[0]
            total_items = data["total_tasks"] + data["total_events"]
            if total_items == 0:
                return 100.0
            
            score = ((data["completed_tasks"] + data["completed_events"]) / total_items) * 100
            
            # Update business compliance score
            self.collection.update_one(
                {"_id": ObjectId(business_id)},
                {"$set": {"compliance_score": score}}
            )
            
            return score
            
        except Exception as e:
            logger.error(f"Error calculating compliance score: {e}")
            raise HTTPException(
                status_code=500,
                detail="Failed to calculate compliance score"
            )

    async def get_document_stats(self, business_id: str) -> Dict:
        """Get document statistics"""
        try:
            pipeline = [
                {"$match": {"_id": ObjectId(business_id)}},
                {
                    "$project": {
                        "total_documents": {"$size": "$documents"},
                        "total_size": {"$sum": "$documents.size"},
                        "by_type": {
                            "$arrayToObject": {
                                "$map": {
                                    "input": {"$setUnion": "$documents.doc_type"},
                                    "as": "type",
                                    "in": {
                                        "k": "$$type",
                                        "v": {
                                            "$size": {
                                                "$filter": {
                                                    "input": "$documents",
                                                    "cond": {"$eq": ["$$this.doc_type", "$$type"]}
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "processing_status": {
                            "completed": {
                                "$size": {
                                    "$filter": {
                                        "input": "$documents",
                                        "cond": {"$eq": ["$$this.ocr_status", "completed"]}
                                    }
                                }
                            },
                            "pending": {
                                "$size": {
                                    "$filter": {
                                        "input": "$documents",
                                        "cond": {"$eq": ["$$this.ocr_status", "pending"]}
                                    }
                                }
                            },
                            "failed": {
                                "$size": {
                                    "$filter": {
                                        "input": "$documents",
                                        "cond": {"$eq": ["$$this.ocr_status", "failed"]}
                                    }
                                }
                            }
                        }
                    }
                }
            ]
            
            result = list(self.collection.aggregate(pipeline))
            if not result:
                raise HTTPException(status_code=404, detail="Business not found")
            
            return result[0]
            
        except Exception as e:
            logger.error(f"Error getting document stats: {e}")
            raise HTTPException(
                status_code=500,
                detail="Failed to get document statistics"
            )

    async def update_settings(self, business_id: str, settings_data: dict) -> Business:
        """Update business settings"""
        result = self.collection.update_one(
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