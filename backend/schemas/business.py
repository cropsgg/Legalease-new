from pydantic import BaseModel, Field, EmailStr, constr, validator
from typing import Optional, List, Dict
from datetime import datetime
from enum import Enum
from bson import ObjectId

# Basic Enums
class BusinessType(str, Enum):
    PVT_LTD = "Pvt Ltd"
    LLP = "LLP"
    PARTNERSHIP = "Partnership"
    PROPRIETORSHIP = "Proprietorship"
    PUBLIC_LTD = "Public Ltd"

class Industry(str, Enum):
    IT = "Information Technology"
    MANUFACTURING = "Manufacturing"
    RETAIL = "Retail"
    HEALTHCARE = "Healthcare"
    FINANCE = "Finance"
    EDUCATION = "Education"
    OTHER = "Other"

class DocumentType(str, Enum):
    INCORPORATION_CERT = "incorporation_certificate"
    PAN_CARD = "pan_card"
    GST_CERT = "gst_certificate"
    BANK_STATEMENT = "bank_statement"
    ITR = "itr"
    CONTRACT = "contract"
    AGREEMENT = "agreement"
    NOTICE = "notice"
    LICENSE = "license"
    OTHER = "other"

class TaskPriority(str, Enum):
    URGENT = "urgent"
    HIGH = "high"
    NORMAL = "normal"
    LOW = "low"

class TaskStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    OVERDUE = "overdue"

class AgentStatus(str, Enum):
    AVAILABLE = "available"
    BUSY = "busy"
    OFFLINE = "offline"

# Base Models
class Address(BaseModel):
    street: str
    city: str
    state: str
    postal_code: constr(regex=r"^\d{6}$")
    country: str = "India"

class BankDetails(BaseModel):
    account_name: str
    account_number: constr(regex=r"^\d{9,18}$")
    ifsc_code: constr(regex=r"^[A-Z]{4}0[A-Z0-9]{6}$")
    bank_name: str
    branch: str

class ContactInfo(BaseModel):
    email: EmailStr
    phone: constr(regex=r"^\+?91?\d{10}$")
    website: Optional[str] = None

class Document(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    name: str
    doc_type: DocumentType
    file_path: str
    mime_type: str
    size: int
    upload_date: datetime = Field(default_factory=datetime.utcnow)
    hash: Optional[str] = None
    blockchain_hash: Optional[str] = None
    ocr_status: str = "pending"  # pending, processing, completed, failed
    ocr_data: Optional[Dict] = None
    tags: List[str] = []
    metadata: Optional[Dict] = None

class Task(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    title: str
    description: Optional[str] = None
    priority: TaskPriority
    status: TaskStatus
    due_date: datetime
    assigned_to: Optional[str] = None
    related_documents: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ComplianceEvent(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    title: str
    description: str
    event_type: str
    due_date: datetime
    status: TaskStatus
    assigned_to: Optional[str] = None
    required_documents: List[str] = []
    notes: Optional[str] = None
    reminders: List[datetime] = []

class Agent(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    name: str
    description: str
    type: str
    status: AgentStatus
    last_used: Optional[datetime] = None
    configuration: Dict = {}
    capabilities: List[str] = []
    statistics: Dict = {
        "total_runs": 0,
        "successful_runs": 0,
        "average_response_time": 0
    }

class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    sender: str
    content: str
    message_type: str  # text, document, system
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    attachments: List[str] = []
    metadata: Optional[Dict] = None

# Main Business Model
class Business(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    
    # Basic Info
    name: str
    business_type: BusinessType
    industry: Industry
    incorporation_date: datetime
    logo_url: Optional[str] = None
    
    # Business Details
    pan_number: Optional[constr(regex=r"^[A-Z]{5}[0-9]{4}[A-Z]$")] = None
    gstin: Optional[constr(regex=r"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}Z[0-9A-Z]{1}$")] = None
    address: Optional[Address] = None
    contact_info: Optional[ContactInfo] = None
    bank_details: Optional[BankDetails] = None
    
    # Documents and Compliance
    documents: List[Document] = []
    tasks: List[Task] = []
    compliance_events: List[ComplianceEvent] = []
    compliance_score: float = 0.0
    
    # Settings and Configuration
    settings: Dict = {
        "ocr_enabled": True,
        "blockchain_enabled": False,
        "notification_preferences": {},
        "retention_policy": {}
    }
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "active"
    onboarding_completed: bool = False
    
    class Config:
        json_encoders = {
            ObjectId: str
        }

    @validator('incorporation_date')
    def validate_incorporation_date(cls, v):
        if v > datetime.utcnow():
            raise ValueError("Incorporation date cannot be in the future")
        return v 