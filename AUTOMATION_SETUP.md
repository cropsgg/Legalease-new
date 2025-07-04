# LegalEase Browser Automation Setup Guide

This guide will help you set up and run the complete browser automation system with a live UI interface.

## 🏗️ Architecture Overview

The system consists of three main components:

1. **Backend (FastAPI + Python)**: Handles WebSocket connections and runs browser automation
2. **Frontend (Next.js + React)**: Provides the UI with chat interface and live browser view
3. **Browser-use Agent**: Performs actual browser automation tasks

## 📋 Prerequisites

### System Requirements
- Python 3.8+
- Node.js 18+
- Git

### API Keys Required
- OpenAI API Key (for GPT models)

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install Playwright browsers
playwright install chromium --with-deps

# Set up environment variables
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# Start the backend server
python start_automation.py
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory (new terminal)
cd frontend

# Install dependencies
npm install
# or
pnpm install

# Start the development server
npm run dev
# or
pnpm dev
```

### 3. Access the Application

- **Frontend UI**: http://localhost:3000/automation
- **Backend API Docs**: http://localhost:8000/api/v1/docs
- **WebSocket Endpoint**: ws://localhost:8000/api/v1/ws/automation

## 💻 Usage

### Basic Usage

1. Open http://localhost:3000/automation in your browser
2. You'll see a split-screen interface:
   - Left side (25%): Chat interface with quick tasks
   - Right side (75%): Live browser view
3. Click on a quick task or type your own prompt
4. Watch the automation run in real-time on the right side

### Available Quick Tasks

- **Tax Filing**: Automates income tax return filing
- **Form Filling**: Helps with government form submissions
- **Document Processing**: Processes legal documents

### Example Prompts

```
"File my income tax return for assessment year 2023-24"
"Help me fill a government application form"
"Process my legal documents"
```

## 🔧 Technical Details

### WebSocket Message Protocol

#### Client → Server Messages:
```json
{
  "type": "start_task",
  "prompt": "File my income tax return"
}
```

#### Server → Client Messages:
```json
{
  "type": "screenshot",
  "screenshot": "base64_encoded_image",
  "url": "current_page_url",
  "action": "current_action_description"
}
```

### Key Features

1. **Real-time Screenshot Streaming**: See browser automation live
2. **Action Logging**: Track each step of the automation
3. **Error Handling**: Graceful error recovery and reporting
4. **Session Management**: Multiple concurrent users supported
5. **Responsive UI**: Works on desktop and tablet devices

## 📁 File Structure

```
backend/
├── api/v1/automation.py      # Main automation WebSocket endpoint
├── main.py                   # FastAPI application
├── test_tax_filing.py        # Original test script
├── start_automation.py       # Startup helper script
└── requirements.txt          # Python dependencies

frontend/
├── app/automation/page.tsx   # Main automation UI page
├── components/ui/            # UI components
└── lib/                      # Utility libraries
```

## 🔍 Debugging

### Common Issues

1. **WebSocket Connection Failed**
   - Check if backend is running on port 8000
   - Verify CORS settings in backend
   - Check browser console for error messages

2. **Automation Not Starting**
   - Verify OpenAI API key is set correctly
   - Check if Playwright browsers are installed
   - Look at backend console for error messages

3. **Screenshots Not Updating**
   - Check WebSocket connection status
   - Verify browser automation is running
   - Check network tab for WebSocket messages

### Debug Commands

```bash
# Check if backend is running
curl http://localhost:8000/health

# Test WebSocket connection
# Use a WebSocket client to connect to ws://localhost:8000/api/v1/ws/automation

# Check Playwright installation
playwright list

# Test automation endpoint directly
python test_tax_filing.py
```

## 🛠️ Customization

### Adding New Task Types

1. Edit `backend/api/v1/automation.py`
2. Modify the `get_tax_filing_task()` function
3. Add new quick tasks in `frontend/app/automation/page.tsx`

### Changing Models

Update the model in `automation.py`:
```python
agent = Agent(
    task=task,
    llm=ChatOpenAI(
        model="gpt-4",  # Change model here
        temperature=0.1,
        api_key=settings.OPENAI_API_KEY,
    ),
    # ... other config
)
```

## 📊 Monitoring

### Logs

- Backend logs: Check terminal running the backend
- Frontend logs: Check browser console
- Automation logs: Stored in `./tmp/record_videos/`

### Performance

- WebSocket message frequency: ~1-2 messages per second during automation
- Screenshot size: ~50-100KB per image (JPEG, 75% quality)
- Memory usage: ~100-200MB per active session

## 🔒 Security Considerations

1. **API Keys**: Never commit API keys to version control
2. **CORS**: Configure properly for production
3. **Rate Limiting**: Implement rate limiting for production use
4. **Input Validation**: All user inputs are validated and sanitized
5. **Session Isolation**: Each user session is isolated

## 🚀 Deployment

### Production Deployment

1. **Backend**: Deploy to a cloud service (AWS, GCP, Azure)
2. **Frontend**: Deploy to Vercel, Netlify, or similar
3. **WebSocket**: Use WSS (secure WebSocket) in production
4. **Environment**: Set production environment variables

### Docker Deployment

```dockerfile
# Backend Dockerfile example
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
RUN playwright install chromium --with-deps
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 📞 Support

If you encounter issues:

1. Check this documentation
2. Review the debug section
3. Check GitHub issues
4. Create a new issue with:
   - System information
   - Error messages
   - Steps to reproduce

## 📝 License

This project is licensed under the MIT License. See LICENSE file for details. 