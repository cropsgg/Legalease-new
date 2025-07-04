#!/bin/bash

# Zero-Touch Tax Filing Copilot Demo Startup Script
# This script starts both backend and frontend for the demo

echo "🚀 Starting Zero-Touch Tax Filing Copilot Demo"
echo "============================================="

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Function to kill processes on specific ports
kill_port() {
    if port_in_use $1; then
        echo "🔧 Killing process on port $1..."
        lsof -ti :$1 | xargs kill -9 2>/dev/null
        sleep 2
    fi
}

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command_exists python3; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+"
    exit 1
fi

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Kill any existing processes on ports 8000 and 3000
kill_port 8000
kill_port 3000

# Start Backend
echo "🔧 Starting Backend (FastAPI)..."
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Start backend in background
echo "🚀 Starting FastAPI server on port 8000..."
nohup python main.py > backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Check if backend is running
if port_in_use 8000; then
    echo "✅ Backend started successfully on http://localhost:8000"
else
    echo "❌ Failed to start backend. Check backend.log for errors."
    exit 1
fi

# Start Frontend
echo "🔧 Starting Frontend (Next.js)..."
cd ../frontend

# Install dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Start frontend in background
echo "🚀 Starting Next.js server on port 3000..."
nohup npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to start
echo "⏳ Waiting for frontend to start..."
sleep 10

# Check if frontend is running
if port_in_use 3000; then
    echo "✅ Frontend started successfully on http://localhost:3000"
else
    echo "❌ Failed to start frontend. Check frontend.log for errors."
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 Zero-Touch Tax Filing Copilot is now running!"
echo "============================================="
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "🤖 Automation Page: http://localhost:3000/automation"
echo ""
echo "🚀 Quick Start:"
echo "1. Open http://localhost:3000/automation"
echo "2. Wait for WebSocket connection (green status)"
echo "3. Try a quick task: 'Start ITR Filing'"
echo "4. Or type: 'File ITR-2 with rental income'"
echo ""
echo "🔍 Monitoring:"
echo "- Backend logs: tail -f backend/backend.log"
echo "- Frontend logs: tail -f frontend/frontend.log"
echo ""
echo "🛑 To stop the demo:"
echo "- Press Ctrl+C to stop this script"
echo "- Or run: pkill -f 'python main.py' && pkill -f 'npm run dev'"
echo ""

# Wait for user input
echo "Press Ctrl+C to stop the demo..."
trap 'echo "🛑 Stopping demo..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo "✅ Demo stopped."; exit 0' INT

# Keep script running
while true; do
    sleep 1
done 