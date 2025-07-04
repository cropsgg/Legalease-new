"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Bot,
  Send,
  User,
  Play,
  Pause,
  Square,
  Monitor,
  Loader2,
  AlertCircle,
  CheckCircle,
  Globe,
  Zap,
  RefreshCw
} from "lucide-react"

interface Message {
  id: string
  type: 'user' | 'system' | 'action' | 'assistant'
  content: string
  timestamp: Date
  status?: 'success' | 'error' | 'info'
}

interface AutomationStatus {
  status: 'disconnected' | 'connecting' | 'connected' | 'running' | 'paused' | 'completed' | 'error'
  currentUrl?: string
  currentAction?: string
  progress?: number
}

export default function AutomationsPage() {
  const { user } = useAuth()
  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: 'Welcome to LegalEase Browser Automation! I can help you with tax filing, legal document processing, and more. Just ask me what you need help with.',
      timestamp: new Date(),
      status: 'info'
    }
  ])
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [automationStatus, setAutomationStatus] = useState<AutomationStatus>({
    status: 'disconnected'
  })
  const [isConnected, setIsConnected] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttempts = useRef(0)

  const quickTasks = [
    {
      title: "Tax Filing",
      description: "File income tax return",
      prompt: "Help me file my income tax return for assessment year 2023-24",
      icon: Bot,
      color: "bg-blue-500"
    },
    {
      title: "Form Filling",
      description: "Fill government forms",
      prompt: "Help me fill a government application form",
      icon: Globe,
      color: "bg-green-500"
    },
    {
      title: "Legal Documents",
      description: "Process legal documents",
      prompt: "Help me process legal documents",
      icon: Zap,
      color: "bg-purple-500"
    }
  ]

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    connectWebSocket()
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const connectWebSocket = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    setAutomationStatus({ status: 'connecting' })
    
    const wsUrl = process.env.NODE_ENV === 'production' 
      ? 'wss://your-backend-url/api/v1/ws/automation'
      : 'ws://localhost:8000/api/v1/ws/automation'
    
    try {
      wsRef.current = new WebSocket(wsUrl)

      wsRef.current.onopen = () => {
        setIsConnected(true)
        setAutomationStatus({ status: 'connected' })
        reconnectAttempts.current = 0
        addMessage('system', 'Connected to automation service', 'success')
      }

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          handleWebSocketMessage(data)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      wsRef.current.onclose = (event) => {
        setIsConnected(false)
        setAutomationStatus({ status: 'disconnected' })
        
        if (event.code !== 1000) { // Not a normal closure
          addMessage('system', 'Connection lost. Attempting to reconnect...', 'error')
          attemptReconnect()
        }
      }

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error)
        addMessage('system', 'Connection error occurred', 'error')
      }
    } catch (error) {
      console.error('Failed to create WebSocket:', error)
      addMessage('system', 'Failed to connect to automation service', 'error')
      attemptReconnect()
    }
  }

  const attemptReconnect = () => {
    if (reconnectAttempts.current >= 5) {
      addMessage('system', 'Failed to reconnect after 5 attempts. Please refresh the page.', 'error')
      return
    }

    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000)
    reconnectAttempts.current++

    reconnectTimeoutRef.current = setTimeout(() => {
      addMessage('system', `Reconnection attempt ${reconnectAttempts.current}...`, 'info')
      connectWebSocket()
    }, delay)
  }

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'connection':
        addMessage('system', data.message, 'success')
        break

      case 'chat_response':
        setIsTyping(false)
        addMessage('assistant', data.message, 'info')
        break
      
      case 'screenshot':
        setScreenshot(`data:image/jpeg;base64,${data.screenshot}`)
        if (data.url) {
          setAutomationStatus(prev => ({ ...prev, currentUrl: data.url }))
        }
        break
      
      case 'action_log':
        addMessage('action', data.message || data.action, 'info')
        setAutomationStatus(prev => ({ 
          ...prev, 
          currentAction: data.action,
          status: 'running'
        }))
        break
      
      case 'status_update':
        setAutomationStatus(prev => ({ 
          ...prev, 
          status: data.status,
          progress: data.progress 
        }))
        if (data.message) {
          addMessage('system', data.message, 'info')
        }
        break
      
      case 'task_complete':
        setAutomationStatus({ status: 'completed' })
        addMessage('system', data.message || 'Task completed successfully!', 'success')
        break
      
      case 'error':
        setAutomationStatus({ status: 'error' })
        addMessage('system', data.message || 'An error occurred', 'error')
        setIsTyping(false)
        break
    }
  }

  const addMessage = (type: Message['type'], content: string, status?: Message['status']) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      status
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || !isConnected) return

    sendChatMessage(prompt)
  }

  const sendChatMessage = (message: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      addMessage('system', 'Not connected to server. Please wait for connection.', 'error')
      return
    }

    // Add user message to chat
    addMessage('user', message)
    setPrompt("")
    
    // Show typing indicator
    setIsTyping(true)

    // Send message to backend
    wsRef.current.send(JSON.stringify({
      type: 'chat_message',
      message: message
    }))
  }

  const handleQuickTask = (taskPrompt: string) => {
    if (!isConnected) {
      addMessage('system', 'Please wait for connection before starting a task.', 'error')
      return
    }
    sendChatMessage(taskPrompt)
  }

  const handleControlAction = (action: 'pause' | 'resume' | 'stop') => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: action === 'stop' ? 'cancel_task' : `${action}_task`
      }))
    }
  }

  const handleReconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    reconnectAttempts.current = 0
    connectWebSocket()
  }

  const getStatusIcon = () => {
    switch (automationStatus.status) {
      case 'connecting':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'running':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Monitor className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = () => {
    switch (automationStatus.status) {
      case 'connecting':
        return 'bg-blue-500'
      case 'connected':
        return 'bg-green-500'
      case 'running':
        return 'bg-blue-500'
      case 'error':
        return 'bg-red-500'
      case 'completed':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getMessageIcon = (message: Message) => {
    switch (message.type) {
      case 'user':
        return <User className="h-3 w-3" />
      case 'assistant':
        return <Bot className="h-3 w-3 text-blue-500" />
      case 'system':
        return <Monitor className="h-3 w-3" />
      case 'action':
        return <Zap className="h-3 w-3 text-purple-500" />
      default:
        return <Bot className="h-3 w-3" />
    }
  }

  return (
    <div className="flex h-[calc(100vh-80px)] w-full">
      {/* Left Panel - Chat Interface (25%) */}
      <div className="w-1/4 border-r border-border bg-background">
        <Card className="h-full rounded-none border-0">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Assistant
            </CardTitle>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <Badge variant="outline" className="text-xs">
                {automationStatus.status}
              </Badge>
              {!isConnected && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleReconnect}
                  className="ml-auto"
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="flex flex-col h-[calc(100%-120px)] gap-4 p-4">
            {/* Quick Tasks */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Quick Tasks</h3>
              <div className="grid gap-2">
                {quickTasks.map((task, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="justify-start h-auto p-3"
                    onClick={() => handleQuickTask(task.prompt)}
                    disabled={automationStatus.status === 'running' || !isConnected}
                  >
                    <div className={`w-2 h-2 rounded-full ${task.color} mr-2`} />
                    <div className="text-left">
                      <div className="font-medium text-xs">{task.title}</div>
                      <div className="text-xs text-muted-foreground">{task.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Chat Messages */}
            <ScrollArea className="flex-1">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getMessageIcon(message)}
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      {message.status && (
                        <Badge variant={message.status === 'error' ? 'destructive' : 'default'} className="text-xs">
                          {message.status}
                        </Badge>
                      )}
                    </div>
                    <div className={`text-sm p-2 rounded-md ${
                      message.type === 'user' 
                        ? 'bg-blue-50 dark:bg-blue-900/20 ml-4' 
                        : 'bg-muted'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Bot className="h-3 w-3 text-blue-500" />
                      <span className="text-xs text-muted-foreground">AI is typing...</span>
                    </div>
                    <div className="text-sm bg-muted p-2 rounded-md">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Control Buttons */}
            {automationStatus.status === 'running' && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleControlAction('stop')}
                >
                  <Square className="h-3 w-3 mr-1" />
                  Stop
                </Button>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={isConnected ? "Ask me anything..." : "Connecting..."}
                disabled={!isConnected}
                className="text-sm"
              />
              <Button 
                type="submit" 
                size="sm"
                disabled={!prompt.trim() || !isConnected}
              >
                <Send className="h-3 w-3" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Browser View (75%) */}
      <div className="w-3/4 bg-muted/30">
        <Card className="h-full rounded-none border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Live Browser Automation
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
                <span className="text-sm text-muted-foreground">
                  {automationStatus.currentUrl || (isConnected ? 'Ready for automation' : 'Disconnected')}
                </span>
              </div>
            </div>
            {automationStatus.currentAction && (
              <div className="text-sm text-muted-foreground">
                Current action: {automationStatus.currentAction}
              </div>
            )}
          </CardHeader>
          
          <CardContent className="p-4 h-[calc(100%-120px)]">
            <div className="w-full h-full border-2 border-dashed border-border rounded-lg overflow-hidden bg-black">
              {screenshot ? (
                <img
                  src={screenshot}
                  alt="Browser automation view"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center space-y-2">
                    <Monitor className="h-12 w-12 mx-auto opacity-50" />
                    <div className="text-lg font-medium">Browser Automation</div>
                    <div className="text-sm">
                      {automationStatus.status === 'disconnected' 
                        ? 'Connecting to automation service...'
                        : automationStatus.status === 'connecting'
                        ? 'Establishing connection...'
                        : automationStatus.status === 'running'
                        ? 'Automation in progress...'
                        : 'Ask me to help with tax filing or other tasks to see live automation'
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 