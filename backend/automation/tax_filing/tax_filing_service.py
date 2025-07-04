"""Main service for tax filing automation"""
import asyncio
from typing import Dict, Any, Optional
from playwright.async_api import async_playwright, Browser, Page
from .constants import (
    Selectors, 
    StatusMessages, 
    LOGIN_URL, 
    DASHBOARD_URL, 
    TIMEOUT_DURATION
)
from .models import TaxFilingRequest, FilingResponse
from .utils import (
    wait_and_fill,
    wait_and_click,
    wait_for_navigation,
    handle_captcha,
    verify_success_message,
    handle_error,
    retry_with_timeout
)

class TaxFilingService:
    def __init__(self):
        self.browser: Optional[Browser] = None
        self.page: Optional[Page] = None

    async def initialize(self):
        """Initialize browser and page"""
        playwright = await async_playwright().start()
        self.browser = await playwright.chromium.launch(headless=True)
        self.page = await self.browser.new_page()
        await self.page.set_viewport_size({"width": 1920, "height": 1080})

    async def cleanup(self):
        """Clean up browser resources"""
        if self.page:
            await self.page.close()
        if self.browser:
            await self.browser.close()

    async def login(self, pan: str, mobile: str) -> bool:
        """Handle login process"""
        try:
            await self.page.goto(LOGIN_URL)
            
            # Fill PAN
            await wait_and_fill(self.page, Selectors.PAN_INPUT, pan)
            
            # Handle CAPTCHA
            captcha = await handle_captcha(self.page)
            await wait_and_fill(self.page, Selectors.CAPTCHA_INPUT, captcha)
            
            # Submit and wait for OTP
            await wait_and_click(self.page, Selectors.LOGIN_BUTTON)
            
            # Note: In real implementation, you'd need to handle OTP retrieval
            # For demo, we'll simulate OTP entry
            otp = "235235"  # This should come from your OTP handling system
            await wait_and_fill(self.page, Selectors.OTP_INPUT, otp)
            
            await wait_and_click(self.page, Selectors.LOGIN_BUTTON)
            await wait_for_navigation(self.page, DASHBOARD_URL)
            
            return True
        except Exception as e:
            await handle_error(self.page, f"Login failed: {str(e)}")
            return False

    async def start_filing(self, request: TaxFilingRequest) -> bool:
        """Start the filing process"""
        try:
            await wait_and_click(self.page, Selectors.START_FILING_BUTTON)
            
            # Select Assessment Year
            await self.page.select_option(
                Selectors.ASSESSMENT_YEAR_DROPDOWN,
                request.assessment_year
            )
            
            # Select ITR Type
            await wait_and_click(
                self.page,
                Selectors.ITR_TYPE_RADIO[request.itr_type]
            )
            
            # Select Online Filing
            await wait_and_click(
                self.page,
                Selectors.FILING_MODE_RADIO['ONLINE']
            )
            
            await wait_and_click(self.page, Selectors.CONTINUE_BUTTON)
            return True
        except Exception as e:
            await handle_error(self.page, f"Filing initiation failed: {str(e)}")
            return False

    async def handle_prefilled_info(self) -> bool:
        """Verify pre-filled information"""
        try:
            # Wait for pre-filled info to load and verify
            await self.page.wait_for_selector('text=Pre-filled Information')
            await wait_and_click(self.page, 'button:has-text("Continue to Income & Deductions")')
            return True
        except Exception as e:
            await handle_error(self.page, f"Pre-filled info handling failed: {str(e)}")
            return False

    async def fill_deductions(self, deductions: list) -> bool:
        """Fill deduction details"""
        try:
            for deduction in deductions:
                await wait_and_click(self.page, Selectors.ADD_DEDUCTION_BUTTON)
                await wait_and_fill(
                    self.page,
                    f'select[name="section"]',
                    deduction.section
                )
                await wait_and_fill(
                    self.page,
                    'input[name="amount"]',
                    str(deduction.amount)
                )
            
            await wait_and_click(self.page, 'button:has-text("Continue to Tax Summary")')
            return True
        except Exception as e:
            await handle_error(self.page, f"Deductions filling failed: {str(e)}")
            return False

    async def handle_tax_summary(self) -> Dict[str, float]:
        """Process tax summary page"""
        try:
            summary = {}
            summary['taxable_income'] = float(await extract_text(
                self.page,
                'text=Taxable Income >> span'
            ).replace('₹', '').replace(',', ''))
            
            summary['tax_payable'] = float(await extract_text(
                self.page,
                'text=Tax Payable >> span'
            ).replace('₹', '').replace(',', ''))
            
            await wait_and_click(self.page, 'button:has-text("Continue to Payment")')
            return summary
        except Exception as e:
            await handle_error(self.page, f"Tax summary handling failed: {str(e)}")
            return {}

    async def submit_return(self, bank_details: Dict[str, str]) -> Optional[str]:
        """Submit the tax return"""
        try:
            # Fill bank details if refund is due
            if await self.page.is_visible('text=Refund Due'):
                await self._fill_bank_details(bank_details)
            
            # Accept declaration
            await wait_and_click(self.page, Selectors.DECLARATION_CHECKBOX)
            await wait_and_click(self.page, Selectors.FINAL_SUBMIT)
            
            # Wait for success message and get acknowledgment number
            await verify_success_message(self.page, StatusMessages.SUCCESS)
            ack_number = await extract_text(
                self.page,
                'text=Acknowledgment Number >> span'
            )
            
            return ack_number
        except Exception as e:
            await handle_error(self.page, f"Return submission failed: {str(e)}")
            return None

    async def _fill_bank_details(self, bank_details: Dict[str, str]):
        """Fill bank details for refund"""
        await wait_and_fill(
            self.page,
            'input[name="bank_name"]',
            bank_details['bank_name']
        )
        await wait_and_fill(
            self.page,
            'input[name="account_number"]',
            bank_details['account_number']
        )
        await wait_and_fill(
            self.page,
            'input[name="ifsc_code"]',
            bank_details['ifsc_code']
        )

    async def file_tax_return(self, request: TaxFilingRequest) -> FilingResponse:
        """Complete tax filing process"""
        try:
            await self.initialize()
            
            # Login
            if not await self.login(request.personal_info.pan, request.personal_info.mobile):
                raise Exception("Login failed")
            
            # Start filing
            if not await self.start_filing(request):
                raise Exception("Failed to start filing")
            
            # Handle pre-filled information
            if not await self.handle_prefilled_info():
                raise Exception("Failed to handle pre-filled information")
            
            # Fill deductions
            if not await self.fill_deductions(request.deductions):
                raise Exception("Failed to fill deductions")
            
            # Process tax summary
            tax_summary = await self.handle_tax_summary()
            if not tax_summary:
                raise Exception("Failed to process tax summary")
            
            # Submit return
            ack_number = await self.submit_return(request.bank_details.dict())
            if not ack_number:
                raise Exception("Failed to submit return")
            
            return FilingResponse(
                acknowledgment_number=ack_number,
                submission_date=await extract_text(self.page, 'text=Submission Date >> span'),
                assessment_year=request.assessment_year,
                status="Successfully Submitted",
                tax_calculation=tax_summary
            )
            
        except Exception as e:
            raise Exception(f"Tax filing failed: {str(e)}")
        
        finally:
            await self.cleanup() 