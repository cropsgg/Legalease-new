"""Unified AI client for OpenAI and Google APIs"""
from typing import Optional, Any, Dict
import openai
import google.generativeai as genai
from browser_use import Agent
from browser_use.llm import ChatOpenAI, ChatGoogle
from .config import settings

class AIClient:
    """Unified AI client for multiple providers"""
    
    def __init__(self, provider: str = "openai"):
        """Initialize AI client with specified provider"""
        self.provider = provider.lower()
        self._setup_client()
        
    def _setup_client(self):
        """Set up the appropriate AI client"""
        if self.provider == "openai":
            openai.api_key = settings.OPENAI_API_KEY
            self.model = "gpt-4"  # Default model
        elif self.provider == "google":
            genai.configure(api_key=settings.GOOGLE_API_KEY)
            self.model = genai.GenerativeModel('gemini-pro')
        else:
            raise ValueError(f"Unsupported AI provider: {self.provider}")
    
    async def generate_content(self, prompt: str) -> str:
        """Generate content using the configured AI provider"""
        try:
            if self.provider == "openai":
                response = await openai.ChatCompletion.acreate(
                    model=self.model,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.7
                )
                return response.choices[0].message.content
            else:  # Google
                response = await self.model.generate_content(prompt)
                return response.text
        except Exception as e:
            raise Exception(f"Error generating content with {self.provider}: {str(e)}")
    
    def get_browser_agent(self, task: str) -> Agent:
        """Get a configured browser agent with the appropriate LLM"""
        if self.provider == "openai":
            llm = ChatOpenAI(
                model=self.model,
                temperature=0.7,
                streaming=True
            )
        else:  # Google
            llm = ChatGoogle(model='gemini-pro')
            
        return Agent(
            task=task,
            llm=llm,
            headless=settings.BROWSER_USE_HEADLESS
        )

# Global instance with default provider (OpenAI)
ai_client = AIClient()

def get_ai_client(provider: Optional[str] = None) -> AIClient:
    """Get AI client instance with optional provider override"""
    global ai_client
    if provider and provider.lower() != ai_client.provider:
        ai_client = AIClient(provider)
    return ai_client

# Example usage:
# async def example():
#     client = get_ai_client()  # Gets OpenAI by default
#     response = await client.generate_content("Your prompt here")
#     
#     # For Google:
#     google_client = get_ai_client("google")
#     google_response = await google_client.generate_content("Your prompt here")
#     
#     # For browser automation:
#     agent = client.get_browser_agent("Your task here")
#     await agent.run() 