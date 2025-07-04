"""Tax filing API endpoints"""
from fastapi import APIRouter, HTTPException
from automation.tax_filing.models import TaxFilingRequest, FilingResponse
from automation.tax_filing.tax_filing_service import TaxFilingService

router = APIRouter(prefix="/tax-filing", tags=["tax-filing"])

@router.post("/file-return", response_model=FilingResponse)
async def file_tax_return(request: TaxFilingRequest):
    """
    File income tax return automatically
    """
    try:
        service = TaxFilingService()
        response = await service.file_tax_return(request)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.get("/status/{acknowledgment_number}")
async def get_filing_status(acknowledgment_number: str):
    """
    Get status of filed return
    """
    # Implementation for status check
    # This would typically involve checking a database or making an API call
    pass 