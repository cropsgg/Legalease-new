from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional, List, Dict
from datetime import datetime
from enum import Enum
from bson import ObjectId
import re

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
    postal_code: str
    country: str = "India"
    
    @field_validator('postal_code')
    @classmethod
    def validate_postal_code(cls, v):
        if not re.match(r"^\d{6}$", v):
            raise ValueError('Postal code must be 6 digits')
        return v

class BankDetails(BaseModel):
    account_name: str
    account_number: str
    ifsc_code: str
    bank_name: str
    branch: str
    
    @field_validator('account_number')
    @classmethod
    def validate_account_number(cls, v):
        if not re.match(r"^\d{9,18}$", v):
            raise ValueError('Account number must be 9-18 digits')
        return v
    
    @field_validator('ifsc_code')
    @classmethod
    def validate_ifsc_code(cls, v):
        if not re.match(r"^[A-Z]{4}0[A-Z0-9]{6}$", v):
            raise ValueError('Invalid IFSC code format')
        return v

class ContactInfo(BaseModel):
    email: EmailStr
    phone: str
    website: Optional[str] = None
    
    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v):
        if not re.match(r"^\+?91?\d{10}$", v):
            raise ValueError('Invalid phone number format')
        return v

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
    pan_number: Optional[str] = None
    gstin: Optional[str] = None
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
    
    @field_validator('pan_number')
    @classmethod
    def validate_pan_number(cls, v):
        if v is not None and not re.match(r"^[A-Z]{5}[0-9]{4}[A-Z]$", v):
            raise ValueError('Invalid PAN number format')
        return v
    
    @field_validator('gstin')
    @classmethod
    def validate_gstin(cls, v):
        if v is not None and not re.match(r"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}Z[0-9A-Z]{1}$", v):
            raise ValueError('Invalid GSTIN format')
        return v
    
    @field_validator('incorporation_date')
    @classmethod
    def validate_incorporation_date(cls, v):
        if v > datetime.utcnow():
            raise ValueError("Incorporation date cannot be in the future")
        return v 