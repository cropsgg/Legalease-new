"""Constants for tax filing automation"""

# Base URLs
BASE_URL = "https://income-tax.ai.alphaq.vercel.app"
LOGIN_URL = f"{BASE_URL}/login"
DASHBOARD_URL = f"{BASE_URL}/dashboard"

# Selectors
class Selectors:
    # Login Page
    PAN_INPUT = 'input[placeholder="ENTER YOUR PAN"]'
    OTP_INPUT = 'input[placeholder="Enter OTP sent to your mobile"]'
    CAPTCHA_INPUT = 'input[placeholder="ENTER CAPTCHA"]'
    CAPTCHA_TEXT = '.captcha-text'
    LOGIN_BUTTON = 'button:has-text("Login")'
    
    # Dashboard
    START_FILING_BUTTON = 'button:has-text("Start Filing")'
    
    # Filing Form
    ASSESSMENT_YEAR_DROPDOWN = 'select[name="assessment_year"]'
    ITR_TYPE_RADIO = {
        'ITR1': 'input[value="itr1"]',
        'ITR2': 'input[value="itr2"]',
        'ITR3': 'input[value="itr3"]'
    }
    FILING_MODE_RADIO = {
        'ONLINE': 'input[value="online"]',
        'XML': 'input[value="xml"]'
    }
    CONTINUE_BUTTON = 'button:has-text("Continue")'
    
    # Pre-filled Info
    VERIFY_PREFILLED_BUTTON = 'button:has-text("Verify")'
    
    # Income & Deductions
    INCOME_SECTION = '#income-section'
    ADD_INCOME_BUTTON = 'button:has-text("Add Income")'
    ADD_DEDUCTION_BUTTON = 'button:has-text("Add Deduction")'
    
    # Tax Summary
    TAX_SUMMARY_SECTION = '#tax-summary'
    CONTINUE_TO_PAYMENT = 'button:has-text("Continue to Payment")'
    
    # Payment
    BANK_DETAILS_SECTION = '#bank-details'
    SUBMIT_BUTTON = 'button:has-text("Submit Return")'
    
    # Declaration
    DECLARATION_CHECKBOX = 'input[type="checkbox"][name="declaration"]'
    FINAL_SUBMIT = 'button:has-text("Submit Return")'

# Form Data Templates
DEFAULT_ITR1_DATA = {
    "assessment_year": "2024-25",
    "itr_type": "ITR1",
    "filing_mode": "ONLINE"
}

# Status Messages
class StatusMessages:
    SUCCESS = "ITR Filed Successfully!"
    PREFILLED_VERIFIED = "Pre-filled information verified successfully"
    PAYMENT_PROCESSED = "Payment processed successfully"

# Timeouts
TIMEOUT_DURATION = 30000  # 30 seconds
PAGE_LOAD_TIMEOUT = 60000  # 60 seconds 