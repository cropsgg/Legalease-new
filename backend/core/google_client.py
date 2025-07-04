import google.generativeai as genai
from browser_use import Agent
from browser_use.llm import ChatGoogle
from .config import settings

def init_google_api():
    """Initialize Google API with the configured API key"""
    genai.configure(api_key=settings.GOOGLE_API_KEY)
    return genai.GenerativeModel('gemini-pro')

def get_browser_agent(task: str) -> Agent:
    """Get a configured browser agent with Google LLM"""
    llm = ChatGoogle(model='gemini-pro')
    return Agent(
        task=task,
        llm=llm,
        headless=settings.BROWSER_USE_HEADLESS
    )

# Example usage:
# model = init_google_api()
# response = model.generate_content("Your prompt here")
#
# agent = get_browser_agent("Your task here")
# await agent.run() 