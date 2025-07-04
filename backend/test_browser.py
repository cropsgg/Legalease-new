import asyncio
from browser_use import Agent
from browser_use.llm import ChatGoogle
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

async def main():
    # Create a simple agent with a basic task
    agent = Agent(
        task="Go to YouTube, search for 'Y Combinator', click on their channel, and summarize the first 2 most recent videos. Include the title and a brief summary for each video.",
        llm=ChatGoogle(model='gemini-1.5-pro-latest'),  # Using the latest stable Gemini 1.5 Pro model
        headless=False  # Set to False to see the browser in action
    )
    
    try:
        # Run the agent
        print("Starting browser automation...")
        print("The browser will navigate to YouTube and find Y Combinator videos...")
        result = await agent.run()
        print("\nTask Result:")
        print(result)
    except Exception as e:
        print(f"\nError occurred: {e}")
        print("\nTroubleshooting steps:")
        print("1. Check if GOOGLE_API_KEY is set:", "✓" if os.getenv("GOOGLE_API_KEY") else "✗")
        print("2. Make sure you have installed the browser:")
        print("   Run: playwright install chromium --with-deps")

if __name__ == "__main__":
    asyncio.run(main()) 