"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Send,
  Paperclip,
  Mic,
  Smile,
  Bot,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Download,
  Eye,
  Trash2,
  Settings,
  History,
  Brain,
  FileImage,
  FileSpreadsheet,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Sparkles,
  Zap,
  Shield,
  Calculator,
  Mail,
  Star,
  Crown,
  MoreHorizontal,
  Copy,
  Share2,
  Bookmark,
  Archive,
  Search,
  Filter,
  Calendar,
  Tag,
  Hash,
  Link,
  ExternalLink,
  Info,
  HelpCircle,
  X,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Message types
interface Message {
  id: string;
  type: 'user' | 'agent' | 'system' | 'action' | 'confirmation';
  content: string;
  timestamp: Date;
  sender?: string;
  avatar?: string;
  status?: 'sending' | 'sent' | 'error';
  attachments?: Attachment[];
  actions?: Action[];
  progress?: number;
  actionType?: 'processing' | 'fetching' | 'generating';
  confirmation?: ConfirmationData;
}

interface Attachment {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'document' | 'spreadsheet';
  size: string;
  url?: string;
  preview?: string;
}

interface Action {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'danger';
  onClick: () => void;
}

interface ConfirmationData {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Agent data
const agents = [
  {
    id: "tax-copilot",
    name: "Tax Filing Copilot",
    avatar: "/api/placeholder/32/32",
    status: "online",
    description: "Automates ITR and GST filing",
    icon: Calculator,
  },
  {
    id: "compliance-agent",
    name: "Compliance Health Agent",
    avatar: "/api/placeholder/32/32",
    status: "online",
    description: "Monitors compliance deadlines",
    icon: Shield,
  },
  {
    id: "notice-responder",
    name: "Notice Responder",
    avatar: "/api/placeholder/32/32",
    status: "busy",
    description: "Drafts responses to tax notices",
    icon: Mail,
  },
  {
    id: "general-assistant",
    name: "General Assistant",
    avatar: "/api/placeholder/32/32",
    status: "online",
    description: "General Q&A and guidance",
    icon: MessageCircle,
  },
];

// Business context for AI agents
const getBusinessContext = (): string => {
  return `
BUSINESS PROFILE:
Company Name: Ashok Enterprises PRIVATE LIMITED
CIN: U72200KA2024PTC987654
Date of Incorporation: 15 April 2024
Business Category: Private Limited Company, Non-Government
Registered Office: #42, 3rd Floor, Innov8 Tower, 123 Silicon Avenue, Electronics City II, Bengaluru – 560100
Email ID: compliance@ashokeneterprises.in
Authorised Capital: ₹10,00,000
Paid-up Capital: ₹5,00,000
Nature of Business: Research and Development in physical and engineering sciences (NIC Code: 72200)

DIRECTORS & SHAREHOLDING:
- Rahul Narayan: 60% (30,000 shares) - DIN: 09876543
- Priya Sharma: 40% (20,000 shares) - DIN: 09876544

FINANCIAL INFORMATION (FY 2024-25):
- Gross Turnover: ₹3.82 Crores
- Total Taxable Income: ₹1.06 Crores  
- Tax Payable: ₹28.04 Lakhs
- GST Registration: Active from 20 April 2024
- HSN Codes: 84795000 (Industrial Robots), 85176290 (Control Units)

CURRENT STATUS:
- All TDS Statements (24Q & 26Q) filed without defaults
- GST filings current and compliant
- Annual return (Form MGT-7) filed for FY 2024-25
- No pending legal notices or compliance defaults
`;
};

// Initial welcome message
const getWelcomeMessage = (agentName: string): Message => ({
  id: "welcome",
  type: "agent",
  content: `Hello! I'm your ${agentName}. I have access to your complete business profile and compliance history for Ashok Enterprises PRIVATE LIMITED. How can I assist you today with your legal and compliance needs?`,
  timestamp: new Date(),
  sender: agentName,
  avatar: "/api/placeholder/32/32",
  status: "sent"
});

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [conversationHistory, setConversationHistory] = useState<{ role: string; content: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize welcome message when component mounts or agent changes
  useEffect(() => {
    setMessages([getWelcomeMessage(selectedAgent.name)]);
    setConversationHistory([]);
  }, [selectedAgent]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle send message with OpenAI integration
  const handleSendMessage = async () => {
    if (!inputValue.trim() && attachments.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
      sender: "You",
      attachments: attachments.length > 0 ? [...attachments] : undefined,
      status: "sending",
    };

    const currentInput = inputValue;
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setAttachments([]);
    setIsProcessing(true);

    // Add user message to conversation history
    const updatedHistory = [...conversationHistory, { role: "user", content: currentInput }];
    setConversationHistory(updatedHistory);

    try {
      // Make API call to OpenAI
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedHistory,
          agentId: selectedAgent.id,
          context: getBusinessContext(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();

      if (data.success) {
        const agentResponse: Message = {
          id: data.message.id,
          type: "agent",
          content: data.message.content,
          timestamp: new Date(data.message.timestamp),
          sender: selectedAgent.name,
          avatar: selectedAgent.avatar,
          status: "sent",
        };

        setMessages(prev => [...prev, agentResponse]);
        
        // Add agent response to conversation history
        setConversationHistory(prev => [...prev, { role: "assistant", content: data.message.content }]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "system",
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
        status: "error",
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle file attachment
  const handleFileAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const attachment: Attachment = {
        id: Date.now().toString(),
        name: file.name,
        type: getFileType(file.name),
        size: formatFileSize(file.size),
        url: URL.createObjectURL(file),
      };
      setAttachments(prev => [...prev, attachment]);
    });
  };

  // Get file type
  const getFileType = (filename: string): Attachment['type'] => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext || '')) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return 'image';
    if (['xlsx', 'xls', 'csv'].includes(ext || '')) return 'spreadsheet';
    return 'document';
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle agent switching
  const handleAgentSwitch = (agent: typeof agents[0]) => {
    setSelectedAgent(agent);
    // This will trigger the useEffect to reset messages and conversation history
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get file icon
  const getFileIcon = (type: Attachment['type']) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'image': return FileImage;
      case 'spreadsheet': return FileSpreadsheet;
      default: return FileText;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-50';
      case 'busy': return 'text-yellow-600 bg-yellow-50';
      case 'offline': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return CheckCircle;
      case 'busy': return Clock;
      case 'offline': return AlertCircle;
      default: return AlertCircle;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F3EE] flex">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-[#D1C4B8] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#8B4513]/10 rounded-lg flex items-center justify-center">
                  <selectedAgent.icon className="w-5 h-5 text-[#8B4513]" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-[#2A2A2A]">{selectedAgent.name}</h1>
                  <div className="flex items-center space-x-2">
                    <Badge className={cn("text-xs", getStatusColor(selectedAgent.status))}>
                      {(() => {
                        const StatusIcon = getStatusIcon(selectedAgent.status);
                        return <StatusIcon className="w-3 h-3 mr-1" />;
                      })()}
                      {selectedAgent.status}
                    </Badge>
                    <span className="text-sm text-[#8B7355]">{selectedAgent.description}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
                onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              >
                {isSidePanelOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                Side Panel
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-6 py-4">
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((message) => (
                <div key={message.id} className="flex">
                  {message.type === "user" ? (
                    // User message (right-aligned, blue)
                    <div className="flex-1 flex justify-end">
                      <div className="max-w-[70%] space-y-2">
                        <div className="flex items-end space-x-2">
                          <div className="bg-[#8B4513] text-white rounded-2xl rounded-br-md px-4 py-3">
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-[#8B4513] text-white text-xs">
                              {user?.firstName?.[0] || "U"}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        <div className="text-xs text-[#8B7355] text-right flex items-center justify-end space-x-1">
                          <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {message.status === 'sending' && <Clock className="w-3 h-3" />}
                          {message.status === 'sent' && <CheckCircle className="w-3 h-3" />}
                          {message.status === 'error' && <AlertCircle className="w-3 h-3 text-red-500" />}
                        </div>
                      </div>
                    </div>
                  ) : message.type === "agent" ? (
                    // Agent message (left-aligned, white with border)
                    <div className="flex-1 flex justify-start">
                      <div className="max-w-[70%] space-y-2">
                        <div className="flex items-start space-x-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={message.avatar} />
                            <AvatarFallback className="bg-[#8B4513]/10 text-[#8B4513] text-xs">
                              {message.sender?.[0] || "A"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-white border border-[#D1C4B8] rounded-2xl rounded-bl-md px-4 py-3">
                            <p className="text-sm text-[#2A2A2A]">{message.content}</p>
                          </div>
                        </div>

                        <div className="text-xs text-[#8B7355] ml-10">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ) : message.type === "system" ? (
                    // System message (centered, gray)
                    <div className="flex-1 flex justify-center">
                      <div className="bg-[#E8DDD1] text-[#8B7355] rounded-full px-4 py-2 text-sm">
                        {message.content}
                      </div>
                    </div>
                  ) : message.type === "action" ? (
                    // Action message (centered with progress)
                    <div className="flex-1 flex justify-center">
                      <div className="bg-white border border-[#D1C4B8] rounded-lg p-4 max-w-md">
                        <div className="flex items-center space-x-3 mb-3">
                          <Loader2 className="w-5 h-5 text-[#8B4513] animate-spin" />
                          <span className="text-sm font-medium text-[#2A2A2A]">{message.content}</span>
                        </div>
                        {message.progress !== undefined && (
                          <Progress value={message.progress} className="h-2" />
                        )}
                      </div>
                    </div>
                  ) : message.type === "confirmation" ? (
                    // Confirmation message (centered with buttons)
                    <div className="flex-1 flex justify-center">
                      <div className="bg-white border border-[#D1C4B8] rounded-lg p-4 max-w-md">
                        <h3 className="font-semibold text-[#2A2A2A] mb-2">
                          {message.confirmation?.title}
                        </h3>
                        <p className="text-sm text-[#8B7355] mb-4">
                          {message.confirmation?.description}
                        </p>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
                            onClick={message.confirmation?.onCancel}
                          >
                            {message.confirmation?.cancelLabel}
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-[#8B4513] hover:bg-[#6B3410] text-white"
                            onClick={message.confirmation?.onConfirm}
                          >
                            {message.confirmation?.confirmLabel}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}

              {/* Processing indicator */}
              {isProcessing && (
                <div className="flex-1 flex justify-start">
                  <div className="max-w-[70%] space-y-2">
                    <div className="flex items-start space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-[#8B4513]/10 text-[#8B4513] text-xs">
                          {selectedAgent.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-white border border-[#D1C4B8] rounded-2xl rounded-bl-md px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 text-[#8B4513] animate-spin" />
                          <span className="text-sm text-[#2A2A2A]">
                            writing...
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-[#D1C4B8] p-4">
          <div className="max-w-4xl mx-auto">
            {/* Input Bar */}
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Ask ${selectedAgent.name} about legal, tax, or compliance matters...`}
                  className="min-h-[44px] max-h-32 resize-none border-[#D1C4B8] focus:border-[#8B4513] rounded-2xl pr-12"
                  rows={1}
                />
              </div>

              <div className="flex items-center space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-[#8B7355] hover:text-[#8B4513]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-[#8B7355] hover:text-[#8B4513]"
                >
                  <Mic className="w-5 h-5" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-[#8B7355] hover:text-[#8B4513]"
                  onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                >
                  <Smile className="w-5 h-5" />
                </Button>
                <Button
                  size="sm"
                  className="bg-[#8B4513] hover:bg-[#6B3410] text-white rounded-full w-10 h-10 p-0"
                  onClick={handleSendMessage}
                  disabled={(!inputValue.trim() && attachments.length === 0) || isProcessing}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileAttachment}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
            />
          </div>
        </div>
      </div>

      {/* Side Panel */}
      <Sheet open={isSidePanelOpen} onOpenChange={setIsSidePanelOpen}>
        <SheetContent side="right" className="w-80 bg-white border-l border-[#D1C4B8]">
          <SheetHeader>
            <SheetTitle className="text-[#2A2A2A]">Chat Context</SheetTitle>
            <SheetDescription className="text-[#8B7355]">
              Agent memory, history, and quick actions
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Available Agents */}
            <div>
              <h3 className="font-semibold text-[#2A2A2A] mb-3 flex items-center">
                <Bot className="w-4 h-4 mr-2 text-[#8B4513]" />
                Available Agents
              </h3>
              <div className="space-y-2">
                {agents.map((agent) => {
                  const AgentIcon = agent.icon;
                  return (
                    <div
                      key={agent.id}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm",
                        selectedAgent.id === agent.id
                          ? "border-[#8B4513] bg-[#8B4513]/5"
                          : "border-[#D1C4B8] hover:border-[#8B4513]/50"
                      )}
                      onClick={() => handleAgentSwitch(agent)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#8B4513]/10 rounded-lg flex items-center justify-center">
                          <AgentIcon className="w-4 h-4 text-[#8B4513]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-[#2A2A2A] text-sm">{agent.name}</h4>
                            <Badge className={cn("text-xs", getStatusColor(agent.status))}>
                              {agent.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-[#8B7355] mt-1">{agent.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Agent Memory */}
            <div>
              <h3 className="font-semibold text-[#2A2A2A] mb-3 flex items-center">
                <Brain className="w-4 h-4 mr-2 text-[#8B4513]" />
                Agent Memory
              </h3>
              <Card className="border-[#D1C4B8]">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#8B7355]">Context Size</span>
                      <span className="text-sm font-medium text-[#2A2A2A]">
                        {Math.round(conversationHistory.length * 0.1)}KB
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#8B7355]">Messages</span>
                      <span className="text-sm font-medium text-[#2A2A2A]">
                        {conversationHistory.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#8B7355]">Business Context</span>
                      <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                        Loaded
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="font-semibold text-[#2A2A2A] mb-3 flex items-center">
                <Zap className="w-4 h-4 mr-2 text-[#8B4513]" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "File GST", icon: Calculator, prompt: "I need help filing my GST return for this quarter" },
                  { label: "Check Compliance", icon: Shield, prompt: "What compliance deadlines are coming up for my company?" },
                  { label: "Generate Doc", icon: FileText, prompt: "I need to draft an employment contract" },
                  { label: "Ask Question", icon: MessageCircle, prompt: "I have a general question about my business" },
                ].map((action, index) => {
                  const ActionIcon = action.icon;
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="border-[#D1C4B8] text-[#8B7355] hover:bg-[#8B4513] hover:text-white h-auto p-3 flex flex-col items-center space-y-1"
                      onClick={() => {
                        setInputValue(action.prompt);
                        setIsSidePanelOpen(false);
                      }}
                    >
                      <ActionIcon className="w-4 h-4" />
                      <span className="text-xs">{action.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Conversation Starters */}
            <div>
              <h3 className="font-semibold text-[#2A2A2A] mb-3 flex items-center">
                <MessageCircle className="w-4 h-4 mr-2 text-[#8B4513]" />
                Conversation Starters
              </h3>
              <div className="space-y-2">
                {[
                  "What are the upcoming compliance deadlines for my company?",
                  "Help me understand my tax obligations for this financial year",
                  "I received a notice from GST department, what should I do?",
                  "Draft a non-disclosure agreement for my new hire",
                  "Explain the benefits of Section 80IAC for startups"
                ].map((starter, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-2 text-xs text-[#8B7355] hover:text-[#8B4513] hover:bg-[#8B4513]/5 rounded border border-transparent hover:border-[#8B4513]/20 transition-all"
                    onClick={() => {
                      setInputValue(starter);
                      setIsSidePanelOpen(false);
                    }}
                  >
                    "{starter}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
