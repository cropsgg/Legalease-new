# 🚀 Quick Start Guide - LegalEase Browser Automation

This guide will get you up and running with the browser automation system in 5 minutes.

## ⚡ What You'll Get

- **Chat Interface**: Natural language chat with AI assistant
- **Live Browser Automation**: Watch automation happen in real-time
- **Tax Filing Automation**: Complete income tax filing process
- **WebSocket Integration**: Real-time updates and communication

## 📋 Prerequisites

- Python 3.8+
- Node.js 18+
- OpenAI API Key

## 🏃‍♂️ 5-Minute Setup

### Step 1: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Install browser
playwright install chromium --with-deps

# Set your OpenAI API key
echo "OPENAI_API_KEY=your_api_key_here" > .env

# Start backend
python start_automation.py
```

### Step 2: Frontend Setup (2 minutes)

```bash
# New terminal - navigate to frontend
cd frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```

### Step 3: Test the System (1 minute)

1. Open: http://localhost:3000/automation
2. Type: "Help me file my income tax return"
3. Watch the magic happen! 🎉

## 🎯 How to Use

### Chat with AI
- Type any message in the chat interface
- Ask questions about tax filing, legal documents, etc.
- Get instant responses from the AI assistant

### Start Automation
Just say:
- "File my income tax return"
- "Help me with tax filing for 2023-24"
- Or click a quick task button

### Watch Live Automation
- Real-time browser screenshots on the right side
- Step-by-step action logs in the chat
- Live URL and status updates

## 🔧 System Overview

```
┌─────────────────┐    WebSocket    ┌─────────────────┐
│   Frontend      │◄───────────────►│    Backend      │
│   (Next.js)     │                 │   (FastAPI)     │
│                 │                 │                 │
│ ┌─────────────┐ │                 │ ┌─────────────┐ │
│ │ Chat UI     │ │                 │ │ OpenAI API  │ │
│ │ (25%)       │ │                 │ │ Integration │ │
│ └─────────────┘ │                 │ └─────────────┘ │
│ ┌─────────────┐ │                 │ ┌─────────────┐ │
│ │ Browser     │ │                 │ │ Browser-use │ │
│ │ View (75%)  │ │                 │ │ Agent       │ │
│ └─────────────┘ │                 │ └─────────────┘ │
└─────────────────┘                 └─────────────────┘
```

## 📱 Features

✅ **Natural Language Chat**: Talk to AI like a human  
✅ **Intent Recognition**: Automatically detects when you need automation  
✅ **Live Screenshots**: Real-time browser view  
✅ **Status Updates**: Know exactly what's happening  
✅ **Error Handling**: Graceful error recovery  
✅ **Session Management**: Multiple users supported  
✅ **Auto-reconnect**: Automatic WebSocket reconnection  

## 🎬 Example Conversations

**User**: "Hi, I need help with my taxes"  
**AI**: "I'd be happy to help you with tax filing! I can automate the entire process for you. Would you like me to start filing your income tax return?"

**User**: "Yes, please file my tax return for 2023-24"  
**AI**: "I understand you want help with tax_filing. Let me start the automation process for you. You'll see the live browser automation on the right side of your screen."

*[Automation starts, live browser appears]*

## 🐛 Troubleshooting

**Connection Issues?**
- Check if backend is running on port 8000
- Verify frontend is on port 3000
- Look for CORS errors in browser console

**Automation Not Starting?**
- Verify OpenAI API key is set
- Check backend logs for errors
- Ensure Playwright is installed

**Screenshots Not Updating?**
- Check WebSocket connection status
- Verify automation is actually running
- Look at network tab for WebSocket messages

## 🔗 URLs to Bookmark

- **Frontend**: http://localhost:3000/automation
- **API Docs**: http://localhost:8000/api/v1/docs
- **Health Check**: http://localhost:8000/health
- **Automation Health**: http://localhost:8000/api/v1/health

## 🎉 Success!

You now have a fully functional AI-powered browser automation system! The AI can:
- Chat naturally with users
- Understand when automation is needed
- Start browser automation automatically
- Stream live updates to the frontend
- Handle errors gracefully

Enjoy automating your tax filing and other tasks! 🚀 