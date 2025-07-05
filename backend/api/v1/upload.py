import logging
import os
from datetime import datetime
from typing import Optional
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.responses import StreamingResponse
from gridfs import GridFS
from pymongo.errors import DuplicateKeyError
import magic
import hashlib
import io

from core.database import get_database
from core.config import settings

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/upload", tags=["upload"])

def validate_pdf_file(file: UploadFile) -> bool:
    """Validate if the uploaded file is a PDF"""
    try:
        # Read first few bytes to check file type
        file_content = file.file.read(2048)
        file.file.seek(0)  # Reset file pointer
        
        # Check MIME type
        mime = magic.Magic(mime=True)
        file_type = mime.from_buffer(file_content)
        
        return file_type == 'application/pdf'
    except Exception as e:
        logger.error(f"Error validating file: {e}")
        return False

def calculate_file_hash(file_content: bytes) -> str:
    """Calculate SHA-256 hash of file content"""
    sha256_hash = hashlib.sha256()
    sha256_hash.update(file_content)
    return sha256_hash.hexdigest()

@router.post("/document")
async def upload_document(
    file: UploadFile = File(...),
    document_type: str = Form(...),
    db = Depends(get_database)
):
    """
    Upload a PDF document and save it to MongoDB using GridFS
    """
    try:
        # Validate file
        if not file.filename:
            raise HTTPException(
                status_code=400,
                detail="No file provided"
            )
        
        # Check file size (10MB limit)
        file_content = await file.read()
        file_size = len(file_content)
        
        if file_size > settings.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File size {file_size} bytes exceeds maximum allowed size of {settings.MAX_FILE_SIZE} bytes"
            )
        
        # Reset file pointer and validate PDF
        file.file = io.BytesIO(file_content)
        if not validate_pdf_file(file):
            raise HTTPException(
                status_code=400,
                detail="Only PDF files are allowed"
            )
        
        # Calculate file hash
        file_hash = calculate_file_hash(file_content)
        
        # Check if file with same hash already exists
        existing_file = db.file_metadata.find_one({"file_hash": file_hash})
        if existing_file:
            logger.info(f"File with hash {file_hash} already exists, returning existing ID")
            return {
                "file_id": str(existing_file["_id"]),
                "filename": existing_file["filename"],
                "message": "File already exists"
            }
        
        # Initialize GridFS
        fs = GridFS(db, collection="documents")
        
        # Store file in GridFS
        file_id = fs.put(
            file_content,
            filename=file.filename,
            content_type="application/pdf",
            metadata={
                "document_type": document_type,
                "original_filename": file.filename,
                "file_size": file_size,
                "file_hash": file_hash,
                "uploaded_at": datetime.utcnow()
            }
        )
        
        # Store metadata in separate collection for easier querying
        metadata_doc = {
            "_id": file_id,
            "filename": file.filename,
            "original_filename": file.filename,
            "document_type": document_type,
            "file_size": file_size,
            "file_hash": file_hash,
            "content_type": "application/pdf",
            "uploaded_at": datetime.utcnow(),
            "status": "uploaded"
        }
        
        db.file_metadata.insert_one(metadata_doc)
        
        logger.info(f"Successfully uploaded file {file.filename} with ID {file_id}")
        
        return {
            "file_id": str(file_id),
            "filename": file.filename,
            "file_size": file_size,
            "file_hash": file_hash,
            "message": "File uploaded successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading document: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload document: {str(e)}"
        )

@router.get("/document/{file_id}")
async def get_document(
    file_id: str,
    db = Depends(get_database)
):
    """
    Retrieve a document from MongoDB GridFS
    """
    try:
        # Initialize GridFS
        fs = GridFS(db, collection="documents")
        
        # Get file from GridFS
        try:
            file_obj = fs.get(ObjectId(file_id))
        except Exception:
            raise HTTPException(
                status_code=404,
                detail="Document not found"
            )
        
        # Create streaming response
        def generate_file_stream():
            while True:
                chunk = file_obj.read(1024)
                if not chunk:
                    break
                yield chunk
        
        return StreamingResponse(
            generate_file_stream(),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={file_obj.filename}"
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving document: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve document: {str(e)}"
        )

@router.get("/document/{file_id}/info")
async def get_document_info(
    file_id: str,
    db = Depends(get_database)
):
    """
    Get document metadata without downloading the file
    """
    try:
        # Get metadata from our custom collection
        metadata = db.file_metadata.find_one({"_id": ObjectId(file_id)})
        
        if not metadata:
            raise HTTPException(
                status_code=404,
                detail="Document not found"
            )
        
        # Convert ObjectId to string for response
        metadata["file_id"] = str(metadata["_id"])
        del metadata["_id"]
        
        return metadata
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting document info: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get document info: {str(e)}"
        )

@router.delete("/document/{file_id}")
async def delete_document(
    file_id: str,
    db = Depends(get_database)
):
    """
    Delete a document from MongoDB GridFS
    """
    try:
        # Initialize GridFS
        fs = GridFS(db, collection="documents")
        
        # Delete file from GridFS
        try:
            fs.delete(ObjectId(file_id))
        except Exception:
            raise HTTPException(
                status_code=404,
                detail="Document not found"
            )
        
        # Delete metadata
        db.file_metadata.delete_one({"_id": ObjectId(file_id)})
        
        logger.info(f"Successfully deleted document {file_id}")
        
        return {
            "message": "Document deleted successfully",
            "file_id": file_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting document: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete document: {str(e)}"
        )

@router.get("/documents")
async def list_documents(
    document_type: Optional[str] = None,
    db = Depends(get_database)
):
    """
    List all uploaded documents with optional filtering by document type
    """
    try:
        query = {}
        if document_type:
            query["document_type"] = document_type
        
        documents = list(db.file_metadata.find(query).sort("uploaded_at", -1))
        
        # Convert ObjectId to string for response
        for doc in documents:
            doc["file_id"] = str(doc["_id"])
            del doc["_id"]
        
        return {
            "documents": documents,
            "total": len(documents)
        }
        
    except Exception as e:
        logger.error(f"Error listing documents: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to list documents: {str(e)}"
        ) 