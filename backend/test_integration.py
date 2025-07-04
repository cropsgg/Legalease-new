#!/usr/bin/env python3
"""
Integration test for Zero-Touch Tax Filing Copilot
This script tests the integration between frontend and backend
"""

import asyncio
import json
import websockets
import logging
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WebSocketTester:
    def __init__(self, url="ws://localhost:8000/api/v1/automation/ws"):
        self.url = url
        self.websocket = None
        self.messages = []
        
    async def connect(self):
        """Connect to the WebSocket"""
        try:
            self.websocket = await websockets.connect(self.url)
            logger.info(f"Connected to {self.url}")
            return True
        except Exception as e:
            logger.error(f"Failed to connect: {e}")
            return False
    
    async def listen(self):
        """Listen for messages from the server"""
        try:
            async for message in self.websocket:
                data = json.loads(message)
                self.messages.append(data)
                logger.info(f"Received: {data['type']} - {data.get('message', 'No message')}")
                
                # Handle different message types
                if data['type'] == 'connection':
                    logger.info(f"Session ID: {data.get('session_id')}")
                    logger.info(f"Capabilities: {data.get('capabilities')}")
                elif data['type'] == 'screenshot':
                    logger.info(f"Screenshot received (URL: {data.get('url', 'N/A')})")
                elif data['type'] == 'step_start':
                    logger.info(f"Step {data.get('step_count')}: {data.get('message')}")
                elif data['type'] == 'step_complete':
                    logger.info(f"Step {data.get('step_count')} completed")
                elif data['type'] == 'task_complete':
                    logger.info("Task completed successfully!")
                elif data['type'] == 'error':
                    logger.error(f"Error: {data.get('message')}")
                elif data['type'] == 'chat_response':
                    logger.info(f"Chat response: {data.get('message')}")
                
        except websockets.exceptions.ConnectionClosed:
            logger.info("WebSocket connection closed")
        except Exception as e:
            logger.error(f"Error listening: {e}")
    
    async def send_message(self, message_type, message_content):
        """Send a message to the server"""
        try:
            message = {
                "type": message_type,
                "message": message_content,
                "timestamp": datetime.now().isoformat()
            }
            await self.websocket.send(json.dumps(message))
            logger.info(f"Sent: {message_type} - {message_content}")
        except Exception as e:
            logger.error(f"Failed to send message: {e}")
    
    async def test_chat_message(self, message):
        """Test sending a chat message"""
        await self.send_message("chat_message", message)
    
    async def test_stop_task(self):
        """Test stopping a task"""
        await self.send_message("stop_task", "")
    
    async def disconnect(self):
        """Disconnect from the WebSocket"""
        if self.websocket:
            await self.websocket.close()
            logger.info("Disconnected from WebSocket")

async def run_integration_test():
    """Run the integration test"""
    print("=" * 60)
    print("Zero-Touch Tax Filing Copilot - Integration Test")
    print("=" * 60)
    
    tester = WebSocketTester()
    
    # Connect to WebSocket
    if not await tester.connect():
        print("❌ Failed to connect to WebSocket")
        return False
    
    # Start listening in background
    listen_task = asyncio.create_task(tester.listen())
    
    try:
        # Wait for connection message
        await asyncio.sleep(2)
        
        # Test 1: Chat message (should get chat response)
        print("\n🧪 Test 1: Chat Message")
        await tester.test_chat_message("Hello, how are you?")
        await asyncio.sleep(3)
        
        # Test 2: Tax filing intent (should trigger automation)
        print("\n🧪 Test 2: Tax Filing Intent")
        await tester.test_chat_message("Start ITR filing process for assessment year 2023-24")
        await asyncio.sleep(5)
        
        # Test 3: Tax filing with specific data
        print("\n🧪 Test 3: Tax Filing with Data")
        await tester.test_chat_message("File ITR-2 with PAN ABCDE1234F and mobile 9876543210")
        await asyncio.sleep(5)
        
        # Test 4: Help request
        print("\n🧪 Test 4: Help Request")
        await tester.test_chat_message("Help me understand the tax filing process")
        await asyncio.sleep(3)
        
        print("\n✅ All tests completed!")
        
    except Exception as e:
        logger.error(f"Test failed: {e}")
        return False
    finally:
        # Stop listening and disconnect
        listen_task.cancel()
        await tester.disconnect()
    
    return True

async def main():
    """Main test function"""
    try:
        success = await run_integration_test()
        if success:
            print("\n🎉 Integration test completed successfully!")
            print("\nNext steps:")
            print("1. Start the backend: cd backend && python main.py")
            print("2. Start the frontend: cd frontend && npm run dev")
            print("3. Open http://localhost:3000/automation")
            print("4. Try the quick tasks or type messages")
        else:
            print("\n❌ Integration test failed!")
            print("\nTroubleshooting:")
            print("1. Make sure backend is running: cd backend && python main.py")
            print("2. Check OpenAI API key is set")
            print("3. Verify WebSocket endpoint is accessible")
    except KeyboardInterrupt:
        print("\n⏹️  Test interrupted by user")
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")

if __name__ == "__main__":
    asyncio.run(main()) 