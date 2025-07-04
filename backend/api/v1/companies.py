from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Any
from core.database import get_db
from models.company import Company
from models.user import User
from schemas.company import CompanyCreate, CompanyUpdate, Company as CompanySchema

router = APIRouter(
    prefix="/companies",
    tags=["companies"]
)

@router.post("/", response_model=CompanySchema)
async def create_company(
    company: CompanyCreate,
    db: AsyncSession = Depends(get_db)
):
    db_company = Company(
        name=company.name,
        owner_id=None  # No auth, so no owner
    )
    db.add(db_company)
    await db.commit()
    await db.refresh(db_company)
    return db_company

@router.get("/", response_model=List[CompanySchema])
async def list_companies(
    db: AsyncSession = Depends(get_db)
):
    query = select(Company)
    result = await db.execute(query)
    companies = result.scalars().all()
    return companies

@router.get("/{company_id}", response_model=CompanySchema)
async def get_company(
    company_id: str,
    db: AsyncSession = Depends(get_db)
):
    query = select(Company).where(Company.id == company_id)
    result = await db.execute(query)
    company = result.scalar_one_or_none()
    
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

@router.patch("/{company_id}", response_model=CompanySchema)
async def update_company(
    company_id: str,
    company_update: CompanyUpdate,
    db: AsyncSession = Depends(get_db)
):
    query = select(Company).where(Company.id == company_id)
    result = await db.execute(query)
    company = result.scalar_one_or_none()
    
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    for field, value in company_update.dict(exclude_unset=True).items():
        setattr(company, field, value)
    
    await db.commit()
    await db.refresh(company)
    return company

@router.delete("/{company_id}")
async def delete_company(
    company_id: str,
    db: AsyncSession = Depends(get_db)
):
    query = select(Company).where(Company.id == company_id)
    result = await db.execute(query)
    company = result.scalar_one_or_none()
    
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    await db.delete(company)
    await db.commit()
    return {"message": "Company deleted successfully"} 