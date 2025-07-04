from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class CompanyBase(BaseModel):
    name: str

class CompanyCreate(CompanyBase):
    pass

class CompanyUpdate(BaseModel):
    name: Optional[str] = None

class CompanyInDB(CompanyBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    owner_id: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

class Company(CompanyInDB):
    pass 