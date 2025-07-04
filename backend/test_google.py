import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

def list_available_models():
    # Configure the API
    api_key = os.getenv('GOOGLE_API_KEY')
    print(f"Using API key: {api_key[:10]}...")
    
    try:
        # Configure the library
        genai.configure(api_key=api_key)
        
        # List available models
        print("\nAvailable models:")
        for m in genai.list_models():
            print(f"Name: {m.name}")
            print(f"Display Name: {m.display_name}")
            print(f"Description: {m.description}")
            print(f"Generation Methods: {m.supported_generation_methods}")
            print("-" * 50)
        
    except Exception as e:
        print(f"\nError listing models: {str(e)}")

if __name__ == "__main__":
    list_available_models() 