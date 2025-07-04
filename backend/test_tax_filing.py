import asyncio
import os
from browser_use import Agent
from browser_use.llm import ChatOpenAI
from dotenv import load_dotenv
from core.config import settings  # Import settings from config

# Load environment variables
load_dotenv()

def get_test_data():
    """Get predefined test data for tax filing"""
    return {
        "pan_number": "ABCDE1234F",  # Test PAN number
        "mobile_number": "9876543210",  # Test mobile number
        "additional_instructions": "Test filing for FY 2023-24",
        "test_otp": "123456",  # Test OTP (will be entered automatically)
        "test_captcha": "AB7K9"  # Test captcha (will be read from screen)
    }

async def main():
    # Get test data
    test_data = get_test_data()
    print("\n=== Running Tax Filing Automation Test ===")
    print(f"Using test data:")
    print(f"PAN Number: {test_data['pan_number']}")
    print(f"Mobile: {test_data['mobile_number']}")
    print(f"Instructions: {test_data['additional_instructions']}\n")
    
    # Construct the task with test details
    task = f"""
    Go to income tax e-filing website (https://income-tax.ai.alphaq.vercel.app/login) and complete the following steps:
    
    1. Initial Form Fill:
       - Enter PAN Number: {test_data['pan_number']}
       - Look for the captcha text on screen
       - Enter the captcha text you see
       - Click "Get OTP" button if available
    
    2. OTP Handling:
       - After clicking Get OTP, wait for OTP field to appear
       - Enter this test OTP: {test_data['test_otp']}
       - Click the final login/submit button
    
    3. Post-Login:
       - Verify successful login
       - Look for any error messages
       - Report the outcome
    
    Additional Test Instructions: {test_data['additional_instructions']}
    
    Important Testing Notes:
    - Take screenshots of any errors
    - Report exact error messages if any
    - Note any fields that couldn't be filled
    - Document the entire flow
    """
    
    # Create an agent with OpenAI using settings from config
    agent = Agent(
        task=task,
        llm=ChatOpenAI(
            model="gpt-3.5-turbo-1106",  # Using GPT-3.5 Turbo which supports structured outputs
            api_key=settings.OPENAI_API_KEY,  # Get API key from settings
            temperature=0.2  # Lower temperature for more focused responses
        ),
        headless=False,  # Show browser for testing
        browser_args={
            "viewport": {"width": 1280, "height": 720},  # Set viewport for better visibility
            "ignore_https_errors": True,  # Ignore HTTPS errors if any
            "record_video": True  # Record test session
        }
    )
    
    try:
        print("Starting automated test...")
        print("The browser will navigate to the income tax portal...")
        print("\nTest Flow:")
        print("1. Navigate to login page")
        print("2. Fill PAN number")
        print("3. Handle captcha")
        print("4. Submit OTP")
        print("5. Verify login\n")
        
        result = await agent.run()
        
        print("\nTest Result:")
        print(result)
        
    except Exception as e:
        print(f"\nTest Error occurred: {e}")
        print("\nTroubleshooting steps:")
        print("1. Check if OPENAI_API_KEY is set in .env:", "✓" if settings.OPENAI_API_KEY else "✗")
        print("2. Make sure you have installed the browser:")
        print("   Run: playwright install chromium --with-deps")
        print("3. Verify your internet connection")
        print("4. Check if the test portal is accessible")

if __name__ == "__main__":
    asyncio.run(main()) 