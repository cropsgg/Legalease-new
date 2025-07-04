from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from bson import ObjectId
from datetime import datetime
from core.database import get_database
from models.company import Company
from schemas.company import CompanyCreate, CompanyUpdate, Company as CompanySchema

router = APIRouter(
    prefix="/companies",
    tags=["companies"]
)

@router.post("/", response_model=CompanySchema)
async def create_company(
    company: CompanyCreate,
    db=Depends(get_database)
):
    company_data = {
        "name": company.name,
        "owner_id": None,  # No auth, so no owner
        "created_at": datetime.utcnow()
    }
    
    result = db.companies.insert_one(company_data)
    created_company = db.companies.find_one({"_id": result.inserted_id})
    
    # Convert ObjectId to string for response
    created_company["id"] = str(created_company["_id"])
    del created_company["_id"]
    
    return created_company

@router.get("/", response_model=List[CompanySchema])
async def list_companies(
    db=Depends(get_database)
):
    companies = list(db.companies.find())
    
    # Convert ObjectId to string for response
    for company in companies:
        company["id"] = str(company["_id"])
        del company["_id"]
    
    return companies

@router.get("/{company_id}", response_model=CompanySchema)
async def get_company(
    company_id: str,
    db=Depends(get_database)
):
    try:
        company = db.companies.find_one({"_id": ObjectId(company_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid company ID")
    
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Convert ObjectId to string for response
    company["id"] = str(company["_id"])
    del company["_id"]
    
    return company

@router.patch("/{company_id}", response_model=CompanySchema)
async def update_company(
    company_id: str,
    company_update: CompanyUpdate,
    db=Depends(get_database)
):
    try:
        object_id = ObjectId(company_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid company ID")
    
    update_data = company_update.dict(exclude_unset=True)
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        result = db.companies.update_one(
            {"_id": object_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Company not found")
    
    company = db.companies.find_one({"_id": object_id})
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Convert ObjectId to string for response
    company["id"] = str(company["_id"])
    del company["_id"]
    
    return company

@router.delete("/{company_id}")
async def delete_company(
    company_id: str,
    db=Depends(get_database)
):
    try:
        object_id = ObjectId(company_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid company ID")
    
    result = db.companies.delete_one({"_id": object_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Company not found")
    
    return {"message": "Company deleted successfully"} 