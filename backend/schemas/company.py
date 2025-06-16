from pydantic import BaseModel, UUID4
from datetime import datetime
from typing import Optional

class CompanyBase(BaseModel):
    name: str

class CompanyCreate(CompanyBase):
    pass

class CompanyUpdate(BaseModel):
    name: Optional[str] = None

class CompanyInDB(CompanyBase):
    id: UUID4
    owner_id: UUID4
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Company(CompanyInDB):
    pass 