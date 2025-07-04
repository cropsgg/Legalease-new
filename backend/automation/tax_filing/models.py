"""Data models for tax filing automation"""
from typing import Optional, List
from pydantic import BaseModel, Field

class PersonalInfo(BaseModel):
    pan: str
    full_name: str
    aadhaar: str
    mobile: str
    address: str

class EmploymentInfo(BaseModel):
    employer_name: str
    employer_tan: str

class SalaryDetails(BaseModel):
    gross_salary: float
    tds_deducted: float
    standard_deduction: float = 50000.0

class DeductionItem(BaseModel):
    section: str
    description: str
    amount: float

class BankDetails(BaseModel):
    bank_name: str
    account_number: str
    ifsc_code: str
    account_holder: str

class TaxFilingRequest(BaseModel):
    personal_info: PersonalInfo
    employment_info: EmploymentInfo
    salary_details: SalaryDetails
    deductions: List[DeductionItem] = []
    bank_details: BankDetails
    assessment_year: str = "2024-25"
    itr_type: str = "ITR1"

class TaxCalculation(BaseModel):
    gross_total_income: float
    total_deductions: float
    taxable_income: float
    tax_payable: float
    tax_paid: float
    refund_due: Optional[float] = None

class FilingResponse(BaseModel):
    acknowledgment_number: str
    submission_date: str
    assessment_year: str
    status: str
    tax_calculation: TaxCalculation 