import asyncio
from browser_use.agent.service import Agent
from browser_use.llm import ChatOpenAI
from browser_use.browser.browser import BrowserConfig
from browser_use.browser.context import BrowserContextConfig
from dotenv import load_dotenv
import os
from core.config import settings  # Import settings from config


# Load environment variables
load_dotenv()

# Create recording directory
recording_dir = "./tmp/record_videos"
os.makedirs(recording_dir, exist_ok=True)

def get_test_data():
    """Get predefined test data for tax filing"""
    return {
        "pan_number": "ABCDE1234F",  # Test PAN number
        "mobile_number": "9876543210",  # Test mobile number
        "additional_instructions": "Test filing for FY 2023-24",
        "test_otp": "123456",  # Test OTP (will be entered automatically)
        "test_captcha": "AB7K9",  # Test captcha (will be read from screen)
        "assessment_year": "2023-24",
        "itr_type": "ITR-2",  # For individuals with capital gains
        "filing_mode": "Online Filing",
        "additional_incomes": [
            {"type": "Rental Income", "amount": 25235},
            {"type": "Interest Income", "amount": 3252530}
        ],
        "deductions": [
            {"type": "80D - Health Insurance Premium", "description": "Health Insurance Premium", "amount": 25000},
            {"type": "80C - Tax Saving Investment", "description": "3434", "amount": 3}
        ]
    }

async def main():
    # Print OpenAI API key status (safely)
    api_key = settings.OPENAI_API_KEY
    if api_key:
        print(f"OpenAI API Key found: {api_key[:3]}...{api_key[-4:]}")
    else:
        print("OpenAI API Key not found!")
        return

    # Get test data
    test_data = get_test_data()
    print("\n=== Running Tax Filing Automation Test ===")
    print(f"Using test data:")
    print(f"PAN Number: {test_data['pan_number']}")
    print(f"Mobile: {test_data['mobile_number']}")
    print(f"Assessment Year: {test_data['assessment_year']}")
    print(f"ITR Type: {test_data['itr_type']}")
    print(f"Additional Incomes: {len(test_data['additional_incomes'])}")
    print(f"Deductions: {len(test_data['deductions'])}\n")
    
    # Create the task with detailed instructions
    task = f"""
    Follow these steps precisely to complete the tax filing process:

    1. LOGIN PHASE:
       - Navigate to: https://income-tax-ai-alphaq.vercel.app/
       - Verify login form elements:
         * PAN Number field
         * Captcha field
         * "Get OTP" button
       - Enter PAN: {test_data['pan_number']}
       - Enter captcha shown on screen
       - Click "Get OTP"
       - When OTP field appears, enter: {test_data['test_otp']}
       - Click final login button
       - Verify successful login by checking dashboard

    2. START FILING PHASE:
       - On dashboard, locate "File ITR" section
       - Click "Start Filing" button
       - In the filing form:
         * Click Assessment Year dropdown
         * Select "{test_data['assessment_year']}"
         * Select ITR Type: "{test_data['itr_type']}"
         * Choose Filing Mode: "{test_data['filing_mode']}"
       - Click "Continue" button

    3. PRE-FILLED INFO PHASE:
       - Review pre-filled information
       - Verify personal details are correct
       - Click "Continue to Income & Deductions"

    4. INCOME & DEDUCTIONS PHASE:
       - Under "Other Income" section:
       {chr(10).join([f'''
         * Click "Add Income" button
         * Select "{income['type']}" from dropdown
         * Enter amount: {income['amount']}, ''' for income in test_data['additional_incomes']])}

       - Under "Deductions" section:
       {chr(10).join([f'''
         * Click "Add Deduction" button
         * Select "{deduction['type']}"
         * Enter description: "{deduction['description']}"
         * Enter amount: {deduction['amount']}, ''' for deduction in test_data['deductions']])}

       - If any entry needs deletion, use the red delete button
       - Click "Continue to Tax Summary"

    5. TAX SUMMARY & PAYMENT PHASE:
       - Review tax calculation summary
       - Click "Continue to Payment"
       - Select any available payment method (UPI/Net Banking/Card)
       - Click "Make Payment"

    6. FINAL SUBMISSION:
       - Review all information in submission page
       - Check "I accept the above declaration" checkbox
       - Click "Submit Return"
       - Verify successful submission message
       - Note down acknowledgment number if provided

    Important Instructions:
    - Document each step as you perform it
    - Take screenshots of any errors
    - If any field is missing or different, report it
    - If any step fails, provide detailed error information
    - Verify each page loads correctly before proceeding
    """
    
    try:
        print("Starting automated test...")
        print("The browser will navigate to the income tax portal...")
        print("\nTest Flow:")
        print("1. Login Phase")
        print("2. Start Filing Phase")
        print("3. Pre-filled Info Phase")
        print("4. Income & Deductions Phase")
        print("5. Tax Summary & Payment Phase")
        print("6. Final Submission Phase\n")

        # Create an agent with OpenAI
        agent = Agent(
            task=task,
            llm=ChatOpenAI(
                model="gpt-4.1",  # Using GPT-4.1 model
                temperature=0.1,
                api_key=settings.OPENAI_API_KEY,
            ),
            headless=False,  # Keep false to see the browser
            ignore_https_errors=True,
            timeout=30000,
            source="test",
            context_config={
                "bypass_csp": True,
                "javascript_enabled": True,
                "cache_enabled": True,
                "performance_mode": True,
                "save_recording_path": recording_dir  # Enable video recording
            },
            generate_gif=True  # Also generate a GIF version
        )
        result = await agent.run()
        
        print("\nTest Result:")
        print(result)
        print(f"\nVideo recording saved to: {recording_dir}")
        
    except Exception as e:
        print(f"\nTest Error occurred: {e}")
        print("\nTroubleshooting steps:")
        print("1. Check if OpenAI API key is set correctly")
        print("2. Make sure you have installed the browser:")
        print("   Run: playwright install chromium --with-deps")
        print("3. Verify your internet connection")
        print("4. Check if the test portal is accessible")

if __name__ == "__main__":
    asyncio.run(main()) 