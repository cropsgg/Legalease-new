"""Test script for tax filing automation"""
import asyncio
from automation.tax_filing.models import (
    TaxFilingRequest,
    PersonalInfo,
    EmploymentInfo,
    SalaryDetails,
    DeductionItem,
    BankDetails
)
from automation.tax_filing.tax_filing_service import TaxFilingService

async def test_tax_filing():
    """Test the complete tax filing process"""
    # Create test request data
    request = TaxFilingRequest(
        personal_info=PersonalInfo(
            pan="ABCDE1234F",
            full_name="Rajesh Kumar Sharma",
            aadhaar="1234-5678-9012",
            mobile="9876543210",
            address="123 MG Road, Sector 15, Bangalore, Karnataka - 560001"
        ),
        employment_info=EmploymentInfo(
            employer_name="Tech Solutions Pvt Ltd",
            employer_tan="BLRT12345A"
        ),
        salary_details=SalaryDetails(
            gross_salary=1200000,
            tds_deducted=120000
        ),
        deductions=[
            DeductionItem(
                section="80C",
                description="PPF/ELSS/NSC",
                amount=150000
            ),
            DeductionItem(
                section="80D",
                description="Health Insurance Premium",
                amount=25000
            )
        ],
        bank_details=BankDetails(
            bank_name="HDFC Bank",
            account_number="12345678901234",
            ifsc_code="HDFC0001234",
            account_holder="Rajesh Kumar Sharma"
        ),
        assessment_year="2024-25",
        itr_type="ITR1"
    )

    try:
        # Initialize service
        service = TaxFilingService()
        
        # Execute tax filing
        response = await service.file_tax_return(request)
        
        # Print results
        print("\nTax Filing Results:")
        print(f"Acknowledgment Number: {response.acknowledgment_number}")
        print(f"Status: {response.status}")
        print(f"Assessment Year: {response.assessment_year}")
        print("\nTax Calculation:")
        print(f"Taxable Income: ₹{response.tax_calculation.taxable_income:,.2f}")
        print(f"Tax Payable: ₹{response.tax_calculation.tax_payable:,.2f}")
        if response.tax_calculation.refund_due:
            print(f"Refund Due: ₹{response.tax_calculation.refund_due:,.2f}")
            
    except Exception as e:
        print(f"\nError during tax filing: {str(e)}")

if __name__ == "__main__":
    # Run the test
    asyncio.run(test_tax_filing()) 