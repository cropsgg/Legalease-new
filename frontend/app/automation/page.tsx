"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
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
  RefreshCw,
  FileText,
  Search,
  HelpCircle,
  XCircle
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Terminal } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

interface Message {
  id: string
  type: 'user' | 'system' | 'action' | 'assistant'
  content: string
  timestamp: Date
  status?: 'success' | 'error' | 'info'
  step?: number
  url?: string
}

interface ErrorState {
  message: string
  type: string
  recoverable: boolean
  details?: Record<string, any>
  timestamp: Date
}

interface AutomationStatus {
  status: 'disconnected' | 'connecting' | 'connected' | 'running' | 'paused' | 'completed' | 'error'
  currentUrl?: string
  currentAction?: string
  progress?: number
  step?: number
  stepDescription?: string
  error?: ErrorState
  sessionId?: string
}

interface AutomationCapabilities {
  tax_filing: boolean
  form_filling: boolean
  document_processing: boolean
}

interface BrowserViewProps {
  screenshot: string | null
  status: AutomationStatus
  isConnected: boolean
  onReconnect: () => void
}

const BrowserView: React.FC<BrowserViewProps> = ({ screenshot, status, isConnected, onReconnect }) => {
  const getStatusColor = () => {
    switch (status.status) {
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

  const getStatusMessage = () => {
    if (!isConnected) return 'Disconnected from automation service'
    if (status.error) return status.error.message
    
    switch (status.status) {
      case 'connecting':
        return 'Connecting to automation service...'
      case 'connected':
        return status.currentUrl || 'Ready for automation'
      case 'running':
        return `Step ${status.step}: ${status.stepDescription || status.currentAction || 'Processing...'}`
      case 'completed':
        return 'Task completed successfully'
      case 'error':
        return 'An error occurred'
      default:
        return 'Waiting for commands...'
    }
  }

  return (
    <Card className="h-full rounded-none border-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Live Browser Automation
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", getStatusColor())} />
            <span className="text-sm text-muted-foreground">
              {status.currentUrl || (isConnected ? 'Ready for automation' : 'Disconnected')}
            </span>
          </div>
        </div>
        {status.currentAction && (
          <div className="text-sm text-muted-foreground">
            Current action: {status.currentAction}
          </div>
        )}
        {status.step && (
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${Math.min((status.step / 10) * 100, 100)}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                Step {status.step}
              </span>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-4 h-[calc(100%-120px)]">
        <div className="w-full h-full border-2 border-dashed border-border rounded-lg overflow-hidden bg-black relative">
          <AnimatePresence mode="wait">
            {screenshot ? (
              <motion.img
                key="screenshot"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                src={screenshot}
                alt="Browser automation view"
                className="w-full h-full object-contain"
              />
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center h-full text-muted-foreground"
              >
                <div className="text-center space-y-2">
                  <Monitor className="h-12 w-12 mx-auto opacity-50" />
                  <div className="text-lg font-medium">Browser Automation</div>
                  <div className="text-sm max-w-md mx-auto">
                    {getStatusMessage()}
                  </div>
                  {status.status === 'error' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={onReconnect}
                    >
                      <RefreshCw className="h-3 w-3 mr-2" />
                      Try Again
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {status.status === 'running' && (
            <div className="absolute bottom-4 right-4">
              <div className="bg-black/80 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                Running Automation
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface ChatInterfaceProps {
  messages: Message[]
  prompt: string
  isTyping: boolean
  isConnected: boolean
  capabilities: AutomationCapabilities
  onPromptChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onQuickTask: (task: string) => void
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  prompt,
  isTyping,
  isConnected,
  capabilities,
  onPromptChange,
  onSubmit,
  onQuickTask
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const getMessageIcon = (type: Message['type']) => {
    switch (type) {
      case 'user':
        return <User className="h-5 w-5" />
      case 'assistant':
        return <Bot className="h-5 w-5" />
      case 'system':
        return <Terminal className="h-5 w-5" />
      case 'action':
        return <Play className="h-5 w-5" />
      default:
        return null
    }
  }

  const getMessageStyle = (type: Message['type'], status?: Message['status']) => {
    const baseStyle = "rounded-lg p-4 text-sm"
    
    switch (type) {
      case 'user':
        return cn(baseStyle, "bg-primary text-primary-foreground")
      case 'assistant':
        return cn(baseStyle, "bg-muted")
      case 'system':
        return cn(
          baseStyle,
          status === 'error' ? "bg-destructive/10 text-destructive" :
          status === 'success' ? "bg-green-500/10 text-green-500" :
          "bg-muted"
        )
      case 'action':
        return cn(baseStyle, "bg-blue-500/10 text-blue-500")
      default:
        return baseStyle
    }
  }

  return (
    <Card className="h-full rounded-none border-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Tax Filing Assistant
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant={capabilities.tax_filing ? "default" : "secondary"}>
            Tax Filing
          </Badge>
          <Badge variant={capabilities.form_filling ? "default" : "secondary"}>
            Form Filling
          </Badge>
          <Badge variant={capabilities.document_processing ? "default" : "secondary"}>
            Document Processing
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="flex flex-col h-[calc(100vh-300px)]">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.type === 'user' && "justify-end"
                  )}
                >
                  {message.type !== 'user' && (
                    <div className="w-6 h-6 flex items-center justify-center">
                      {getMessageIcon(message.type)}
                    </div>
                  )}
                  <div
                    className={cn(
                      "relative max-w-[80%]",
                      message.type === 'user' && "order-1"
                    )}
                  >
                    <div className={getMessageStyle(message.type, message.status)}>
                      {message.content}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  {message.type === 'user' && (
                    <div className="w-6 h-6 flex items-center justify-center">
                      {getMessageIcon(message.type)}
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="bg-muted rounded-lg p-4 text-sm max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Processing automation...
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Quick Tasks */}
          <div className="p-4 border-t border-border">
            <div className="text-sm font-medium mb-2">Quick Tasks</div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onQuickTask("Start tax filing process")}
                disabled={!isConnected}
              >
                <FileText className="h-3 w-3 mr-2" />
                Start Tax Filing
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onQuickTask("Check tax filing status")}
                disabled={!isConnected}
              >
                <Search className="h-3 w-3 mr-2" />
                Check Status
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onQuickTask("Help me understand the tax filing process")}
                disabled={!isConnected}
              >
                <HelpCircle className="h-3 w-3 mr-2" />
                Get Help
              </Button>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <form onSubmit={onSubmit}>
              <div className="flex gap-2">
                <Textarea
                  value={prompt}
                  onChange={(e) => onPromptChange(e.target.value)}
                  placeholder={
                    isConnected
                      ? "Type your message here..."
                      : "Connecting to automation service..."
                  }
                  disabled={!isConnected}
                  className="min-h-[60px] max-h-[120px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      onSubmit(e)
                    }
                  }}
                />
                <Button
                  type="submit"
                  disabled={!isConnected || !prompt.trim()}
                  className="px-6"
                >
                  {isTyping ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AutomationsPage() {
  const { user } = useAuth()
  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
  const [capabilities, setCapabilities] = useState<AutomationCapabilities>({
    tax_filing: false,
    form_filling: false,
    document_processing: false
  })
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [errors, setErrors] = useState<ErrorState[]>([])
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionAttempts, setConnectionAttempts] = useState(0)

  const wsRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttempts = useRef(0)
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const MAX_RECONNECT_ATTEMPTS = 5
  const BASE_RECONNECT_DELAY = 1000

  const addMessage = useCallback((type: Message['type'], content: string, status?: Message['status']) => {
    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      content,
      timestamp: new Date(),
      status
    }
    setMessages(prev => [...prev, newMessage])
  }, [])

  const handleError = useCallback((error: ErrorState) => {
    setErrors(prev => [...prev, error])

    // Clear error after 5 seconds if it's recoverable
    if (error.recoverable && errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current)
      errorTimeoutRef.current = setTimeout(() => {
        setErrors(prev => prev.filter(e => e !== error))
      }, 5000)
    }
  }, [])

  const clearError = useCallback((error: ErrorState) => {
    setErrors(prev => prev.filter(e => e !== error))
  }, [])

  const handleWebSocketMessage = useCallback((data: any) => {
    const timestamp = data.timestamp ? new Date(data.timestamp) : new Date()

    switch (data.type) {
      case 'connection':
        setSessionId(data.session_id)
        if (data.capabilities) {
          setCapabilities({
            tax_filing: data.capabilities.includes('tax_filing'),
            form_filling: data.capabilities.includes('form_filling'),
            document_processing: data.capabilities.includes('document_processing')
          })
        }
        addMessage('system', data.message, 'success')
        break

      case 'screenshot':
        setScreenshot(`data:image/jpeg;base64,${data.screenshot}`)
        if (data.url) {
          setAutomationStatus(prev => ({ 
            ...prev, 
            currentUrl: data.url,
            status: prev.status === 'disconnected' ? 'connected' : prev.status
          }))
        }
        break
      
      case 'step_start':
        setAutomationStatus(prev => ({ 
          ...prev, 
          status: 'running',
          step: data.step_count,
          stepDescription: data.step,
          currentAction: data.message
        }))
        addMessage('action', `${data.message}: ${data.step || ''}`, 'info')
        break
      
      case 'step_complete':
        setAutomationStatus(prev => ({ 
          ...prev, 
          step: data.step_count,
          currentAction: data.action
        }))
        if (data.action) {
          addMessage('action', data.action, 'success')
        }
        break
      
      case 'status_update':
        setAutomationStatus(prev => ({ 
          ...prev, 
          status: data.status,
          error: data.error,
          currentAction: data.message
        }))
        addMessage('system', data.message, data.error ? 'error' : 'info')
        break
      
      case 'task_complete':
        setAutomationStatus(prev => ({ 
          ...prev, 
          status: 'completed',
          currentAction: undefined
        }))
        addMessage('system', data.message, 'success')
        break
      
      case 'error':
        const errorState: ErrorState = {
          message: data.message,
          type: data.error_type || 'unknown',
          recoverable: data.recoverable || false,
          details: data.details,
          timestamp: new Date()
        }
        
        setAutomationStatus((prev: AutomationStatus) => ({
          ...prev,
          status: 'error' as const,
          error: errorState
        }))
        
        handleError(errorState)
        setIsTyping(false)
        break
    }
  }, [addMessage, handleError])

  const attemptReconnect = useCallback(() => {
    if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
      addMessage('system', 'Failed to reconnect after multiple attempts. Please try again later.', 'error')
      setIsConnecting(false)
      return
    }

    const delay = Math.min(BASE_RECONNECT_DELAY * Math.pow(2, reconnectAttempts.current), 10000)
    reconnectAttempts.current++
    setConnectionAttempts(reconnectAttempts.current)

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }

    reconnectTimeoutRef.current = setTimeout(() => {
      addMessage('system', `Reconnection attempt ${reconnectAttempts.current}...`, 'info')
      connectWebSocket()
    }, delay)
  }, [addMessage])

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    setIsConnecting(true)
    setAutomationStatus({ status: 'connecting' })
    
    const wsUrl = process.env.NODE_ENV === 'production' 
      ? 'wss://your-backend-url/api/v1/automation/ws'
      : 'ws://localhost:8000/api/v1/automation/ws'
    
    try {
      wsRef.current = new WebSocket(wsUrl)

      wsRef.current.onopen = () => {
        setIsConnected(true)
        setIsConnecting(false)
        setAutomationStatus({ status: 'connected' })
        reconnectAttempts.current = 0
        setConnectionAttempts(0)
        addMessage('system', 'Connected to automation service', 'success')
      }

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          handleWebSocketMessage(data)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
          addMessage('system', 'Failed to parse server message', 'error')
        }
      }

      wsRef.current.onclose = (event) => {
        setIsConnected(false)
        setAutomationStatus(prev => ({ ...prev, status: 'disconnected' }))
        
        if (event.code !== 1000) { // Not a normal closure
          addMessage('system', 'Connection lost. Attempting to reconnect...', 'error')
          attemptReconnect()
        }
      }

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error)
        addMessage('system', 'Connection error occurred', 'error')
        setAutomationStatus(prev => ({ ...prev, status: 'error', error: { message: 'Connection error', type: 'connection', recoverable: true, timestamp: new Date() } }))
        setIsConnecting(false)
      }
    } catch (error) {
      console.error('Failed to create WebSocket:', error)
      addMessage('system', 'Failed to connect to automation service', 'error')
      setIsConnecting(false)
      attemptReconnect()
    }
  }, [addMessage, handleWebSocketMessage, attemptReconnect])

  const handleReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    reconnectAttempts.current = 0
    setConnectionAttempts(0)
    connectWebSocket()
  }, [connectWebSocket])

  useEffect(() => {
    connectWebSocket()

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
      }
    }
  }, [connectWebSocket])

  const sendChatMessage = useCallback((message: string) => {
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
      message: message,
      session_id: sessionId
    }))
  }, [sessionId, addMessage])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || !isConnected) return

    sendChatMessage(prompt)
    setPrompt("")
  }, [prompt, isConnected, sendChatMessage])

  const handleQuickTask = useCallback((task: string) => {
    if (!isConnected) return
    sendChatMessage(task)
  }, [isConnected, sendChatMessage])

  return (
    <div className="flex h-[calc(100vh-80px)] w-full">
      {/* Connection Status Banner */}
      {!isConnected && (
        <div className="fixed top-0 left-0 right-0 bg-destructive/90 text-destructive-foreground p-2 flex items-center justify-center gap-4 z-50">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {isConnecting ? (
              <>
                <span>Connecting to automation service... Attempt {connectionAttempts}/{MAX_RECONNECT_ATTEMPTS}</span>
                <Loader2 className="h-4 w-4 animate-spin" />
              </>
            ) : (
              <span>Not connected to automation service</span>
            )}
          </div>
          {!isConnecting && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleReconnect}
              className="bg-white/10 hover:bg-white/20"
            >
              <RefreshCw className="h-3 w-3 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      )}

      {/* Error Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
        <AnimatePresence>
          {errors.map((error) => (
            <motion.div
              key={error.timestamp.getTime()}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert variant="destructive" className="border-destructive/50 pr-12 relative">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="flex items-center gap-2">
                  {error.type === 'connection' ? 'Connection Error' :
                   error.type === 'browser' ? 'Browser Error' :
                   error.type === 'agent' ? 'Automation Error' :
                   error.type === 'screenshot' ? 'Screenshot Error' :
                   'Error'}
                </AlertTitle>
                <AlertDescription>
                  {error.message}
                  {error.details?.url && (
                    <div className="text-xs mt-1 text-destructive/80">
                      URL: {error.details.url}
                    </div>
                  )}
                </AlertDescription>
                <button
                  className="absolute top-3 right-3 text-destructive/50 hover:text-destructive"
                  onClick={() => clearError(error)}
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </Alert>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Left Panel - Chat Interface (25%) */}
      <div className="w-1/4 border-r border-border bg-background">
        <ChatInterface
          messages={messages}
          prompt={prompt}
          isTyping={isTyping}
          isConnected={isConnected}
          capabilities={capabilities}
          onPromptChange={setPrompt}
          onSubmit={handleSubmit}
          onQuickTask={handleQuickTask}
        />
      </div>

      {/* Right Panel - Browser View (75%) */}
      <div className="w-3/4 bg-muted/30">
        <BrowserView
          screenshot={screenshot}
          status={automationStatus}
          isConnected={isConnected}
          onReconnect={handleReconnect}
        />
      </div>
    </div>
  )
} 