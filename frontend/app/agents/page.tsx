"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Calculator,
  Shield,
  Mail,
  FileText,
  MessageCircle,
  Sparkles,
  CheckCircle,
  Clock,
  AlertCircle,
  Settings,
  Play,
  Pause,
  Zap,
  Brain,
  Memory,
  Activity,
  BarChart3,
  History,
  TestTube,
  ArrowRight,
  Star,
  Users,
  Globe,
  Lock,
  Unlock,
  RefreshCw,
  Download,
  Upload,
  Copy,
  Share2,
  MoreHorizontal,
  ChevronRight,
  Info,
  HelpCircle,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Agent data
const agents = [
  {
    id: "tax-filing-copilot",
    name: "Tax Filing Copilot",
    description: "Automates ITR and GST filing",
    icon: Calculator,
    status: "available",
    lastUsed: "2 hours ago",
    usageCount: 156,
    successRate: 94.2,
    avgResponseTime: "2.3s",
    capabilities: [
      "ITR filing automation",
      "GST return preparation",
      "Tax calculation",
      "Document verification",
      "Deadline tracking"
    ],
    configuration: {
      autoProcess: true,
      notifications: true,
      backupMode: false,
      priority: "high"
    },
    memory: {
      contextSize: "2.5MB",
      retentionDays: 30,
      sharedContext: true
    }
  },
  {
    id: "compliance-health-agent",
    name: "Compliance Health Agent",
    description: "Monitors compliance deadlines",
    icon: Shield,
    status: "busy",
    lastUsed: "5 minutes ago",
    usageCount: 89,
    successRate: 97.8,
    avgResponseTime: "1.8s",
    capabilities: [
      "Deadline monitoring",
      "Compliance alerts",
      "Risk assessment",
      "Regulatory updates",
      "Audit preparation"
    ],
    configuration: {
      autoProcess: true,
      notifications: true,
      backupMode: false,
      priority: "high"
    },
    memory: {
      contextSize: "1.8MB",
      retentionDays: 60,
      sharedContext: true
    }
  },
  {
    id: "notice-responder",
    name: "Notice Responder",
    description: "Drafts responses to tax notices",
    icon: Mail,
    status: "available",
    lastUsed: "1 day ago",
    usageCount: 42,
    successRate: 91.5,
    avgResponseTime: "3.1s",
    capabilities: [
      "Notice analysis",
      "Response drafting",
      "Legal compliance",
      "Document generation",
      "Follow-up tracking"
    ],
    configuration: {
      autoProcess: false,
      notifications: true,
      backupMode: true,
      priority: "medium"
    },
    memory: {
      contextSize: "3.2MB",
      retentionDays: 90,
      sharedContext: false
    }
  },
  {
    id: "document-generator",
    name: "Document Generator",
    description: "Creates legal documents",
    icon: FileText,
    status: "available",
    lastUsed: "30 minutes ago",
    usageCount: 203,
    successRate: 96.1,
    avgResponseTime: "4.2s",
    capabilities: [
      "Contract generation",
      "Agreement drafting",
      "Legal templates",
      "Document review",
      "Version control"
    ],
    configuration: {
      autoProcess: true,
      notifications: false,
      backupMode: true,
      priority: "medium"
    },
    memory: {
      contextSize: "4.1MB",
      retentionDays: 45,
      sharedContext: true
    }
  },
  {
    id: "trademark-assistant",
    name: "Trademark Assistant",
    description: "Handles trademark applications",
    icon: Star,
    status: "offline",
    lastUsed: "3 days ago",
    usageCount: 67,
    successRate: 88.9,
    avgResponseTime: "5.7s",
    capabilities: [
      "Trademark search",
      "Application filing",
      "Status tracking",
      "Opposition handling",
      "Renewal reminders"
    ],
    configuration: {
      autoProcess: false,
      notifications: true,
      backupMode: false,
      priority: "low"
    },
    memory: {
      contextSize: "2.1MB",
      retentionDays: 120,
      sharedContext: false
    }
  },
  {
    id: "general-assistant",
    name: "General Assistant",
    description: "General Q&A and guidance",
    icon: MessageCircle,
    status: "available",
    lastUsed: "10 minutes ago",
    usageCount: 445,
    successRate: 92.3,
    avgResponseTime: "1.5s",
    capabilities: [
      "Legal Q&A",
      "Guidance provision",
      "Research assistance",
      "Best practices",
      "Resource recommendations"
    ],
    configuration: {
      autoProcess: true,
      notifications: true,
      backupMode: true,
      priority: "medium"
    },
    memory: {
      contextSize: "5.2MB",
      retentionDays: 30,
      sharedContext: true
    }
  }
];

export default function AgentsPage() {
  const { user } = useAuth();
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testQuery, setTestQuery] = useState("");

  // Get status color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "available":
        return {
          color: "text-green-600",
          bgColor: "bg-green-50",
          icon: CheckCircle,
          label: "Available"
        };
      case "busy":
        return {
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          icon: Clock,
          label: "Busy"
        };
      case "offline":
        return {
          color: "text-red-600",
          bgColor: "bg-red-50",
          icon: AlertCircle,
          label: "Offline"
        };
      default:
        return {
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          icon: AlertCircle,
          label: "Unknown"
        };
    }
  };

  // Handle agent run
  const handleRunAgent = (agent: any) => {
    // Simulate agent activation
    console.log(`Running agent: ${agent.name}`);
  };

  // Handle agent configuration
  const handleConfigureAgent = (agent: any) => {
    setSelectedAgent(agent);
    setIsConfigModalOpen(true);
  };

  // Handle agent test
  const handleTestAgent = (agent: any) => {
    setSelectedAgent(agent);
    setIsTestModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F3EE] p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#2A2A2A] mb-2">AI Agents</h1>
            <p className="text-[#8B7355]">
              Manage and configure your AI agents for legal automation
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {user?.isGuest && (
              <Badge variant="outline" className="border-[#8B4513] text-[#8B4513]">
                <Crown className="w-3 h-3 mr-1" />
                Premium Feature
              </Badge>
            )}
            <Button
              variant="outline"
              className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
            >
              <Activity className="w-4 h-4 mr-2" />
              Agent Analytics
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-[#D1C4B8]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#8B7355]">Total Agents</p>
                  <p className="text-2xl font-bold text-[#2A2A2A]">{agents.length}</p>
                </div>
                <div className="w-10 h-10 bg-[#8B4513]/10 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-[#8B4513]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#D1C4B8]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#8B7355]">Available</p>
                  <p className="text-2xl font-bold text-[#2A2A2A]">
                    {agents.filter(a => a.status === "available").length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#D1C4B8]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#8B7355]">Total Usage</p>
                  <p className="text-2xl font-bold text-[#2A2A2A]">
                    {agents.reduce((sum, agent) => sum + agent.usageCount, 0)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#D1C4B8]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#8B7355]">Avg Success Rate</p>
                  <p className="text-2xl font-bold text-[#2A2A2A]">
                    {Math.round(agents.reduce((sum, agent) => sum + agent.successRate, 0) / agents.length)}%
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const AgentIcon = agent.icon;
          const statusInfo = getStatusInfo(agent.status);
          const StatusIcon = statusInfo.icon;

          return (
            <Card key={agent.id} className="border-[#D1C4B8] hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#8B4513]/10 rounded-lg flex items-center justify-center">
                      <AgentIcon className="w-6 h-6 text-[#8B4513]" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-[#2A2A2A]">{agent.name}</CardTitle>
                      <p className="text-sm text-[#8B7355]">{agent.description}</p>
                    </div>
                  </div>
                  <Badge className={`${statusInfo.bgColor} ${statusInfo.color}`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Usage Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[#8B7355]">Usage</p>
                    <p className="font-semibold text-[#2A2A2A]">{agent.usageCount}</p>
                  </div>
                  <div>
                    <p className="text-[#8B7355]">Success Rate</p>
                    <p className="font-semibold text-[#2A2A2A]">{agent.successRate}%</p>
                  </div>
                  <div>
                    <p className="text-[#8B7355]">Response Time</p>
                    <p className="font-semibold text-[#2A2A2A]">{agent.avgResponseTime}</p>
                  </div>
                  <div>
                    <p className="text-[#8B7355]">Last Used</p>
                    <p className="font-semibold text-[#2A2A2A]">{agent.lastUsed}</p>
                  </div>
                </div>

                {/* Capabilities Preview */}
                <div>
                  <p className="text-xs text-[#8B7355] mb-2">Capabilities</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.slice(0, 3).map((capability, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-[#8B4513] text-[#8B4513]">
                        {capability}
                      </Badge>
                    ))}
                    {agent.capabilities.length > 3 && (
                      <Badge variant="outline" className="text-xs border-[#8B7355] text-[#8B7355]">
                        +{agent.capabilities.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 pt-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-[#8B4513] hover:bg-[#6B3410] text-white"
                    onClick={() => handleRunAgent(agent)}
                    disabled={agent.status === "offline"}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Run
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
                    onClick={() => handleConfigureAgent(agent)}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
                    onClick={() => handleTestAgent(agent)}
                  >
                    <TestTube className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Agent Configuration Modal */}
      <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
        <DialogContent className="max-w-2xl">
          {selectedAgent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <selectedAgent.icon className="w-5 h-5" />
                  <span>Configure {selectedAgent.name}</span>
                </DialogTitle>
                <DialogDescription>
                  Customize agent settings and behavior
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Agent Description */}
                <div>
                  <h3 className="font-semibold text-[#2A2A2A] mb-2">Description</h3>
                  <p className="text-[#8B7355]">{selectedAgent.description}</p>
                </div>

                {/* Capabilities */}
                <div>
                  <h3 className="font-semibold text-[#2A2A2A] mb-3">Capabilities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedAgent.capabilities.map((capability: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-[#8B7355]">{capability}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Configuration Options */}
                <div>
                  <h3 className="font-semibold text-[#2A2A2A] mb-4">Configuration</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="autoProcess" className="text-[#2A2A2A]">Auto Process</Label>
                        <p className="text-xs text-[#8B7355]">Automatically process requests</p>
                      </div>
                      <Switch
                        id="autoProcess"
                        defaultChecked={selectedAgent.configuration.autoProcess}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notifications" className="text-[#2A2A2A]">Notifications</Label>
                        <p className="text-xs text-[#8B7355]">Send status notifications</p>
                      </div>
                      <Switch
                        id="notifications"
                        defaultChecked={selectedAgent.configuration.notifications}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="backupMode" className="text-[#2A2A2A]">Backup Mode</Label>
                        <p className="text-xs text-[#8B7355]">Enable backup processing</p>
                      </div>
                      <Switch
                        id="backupMode"
                        defaultChecked={selectedAgent.configuration.backupMode}
                      />
                    </div>

                    <div>
                      <Label htmlFor="priority" className="text-[#2A2A2A]">Priority Level</Label>
                      <Select defaultValue={selectedAgent.configuration.priority}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Memory Settings */}
                <div>
                  <h3 className="font-semibold text-[#2A2A2A] mb-4">Memory & Context</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[#8B7355]">Context Size</p>
                      <p className="font-semibold text-[#2A2A2A]">{selectedAgent.memory.contextSize}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#8B7355]">Retention Days</p>
                      <p className="font-semibold text-[#2A2A2A]">{selectedAgent.memory.retentionDays}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#8B7355]">Shared Context</p>
                      <p className="font-semibold text-[#2A2A2A]">
                        {selectedAgent.memory.sharedContext ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Usage Statistics */}
                <div>
                  <h3 className="font-semibold text-[#2A2A2A] mb-4">Usage Statistics</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#2A2A2A]">{selectedAgent.usageCount}</p>
                      <p className="text-xs text-[#8B7355]">Total Uses</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#2A2A2A]">{selectedAgent.successRate}%</p>
                      <p className="text-xs text-[#8B7355]">Success Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#2A2A2A]">{selectedAgent.avgResponseTime}</p>
                      <p className="text-xs text-[#8B7355]">Avg Response</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsConfigModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-[#8B4513] hover:bg-[#6B3410] text-white">
                    Save Configuration
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Agent Test Modal */}
      <Dialog open={isTestModalOpen} onOpenChange={setIsTestModalOpen}>
        <DialogContent className="max-w-2xl">
          {selectedAgent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <TestTube className="w-5 h-5" />
                  <span>Test {selectedAgent.name}</span>
                </DialogTitle>
                <DialogDescription>
                  Test the agent with sample queries and see responses
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Test Interface */}
                <div>
                  <Label htmlFor="testQuery" className="text-[#2A2A2A]">Test Query</Label>
                  <Textarea
                    id="testQuery"
                    placeholder={`Enter a test query for ${selectedAgent.name}...`}
                    value={testQuery}
                    onChange={(e) => setTestQuery(e.target.value)}
                    className="mt-2 border-[#D1C4B8] focus:border-[#8B4513]"
                    rows={3}
                  />
                </div>

                {/* Sample Queries */}
                <div>
                  <h3 className="font-semibold text-[#2A2A2A] mb-3">Sample Queries</h3>
                  <div className="space-y-2">
                    {selectedAgent.capabilities.slice(0, 3).map((capability: string, index: number) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start border-[#D1C4B8] text-[#8B7355] hover:bg-[#F8F3EE]"
                        onClick={() => setTestQuery(`Test ${capability.toLowerCase()}`)}
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Test {capability}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Response Area */}
                <div>
                  <h3 className="font-semibold text-[#2A2A2A] mb-3">Response</h3>
                  <div className="border border-[#D1C4B8] rounded-lg p-4 bg-[#F8F3EE] min-h-[100px]">
                    <div className="flex items-center justify-center h-full text-[#8B7355]">
                      <div className="text-center">
                        <TestTube className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Enter a query above to test the agent</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsTestModalOpen(false)}>
                    Close
                  </Button>
                  <Button
                    className="bg-[#8B4513] hover:bg-[#6B3410] text-white"
                    disabled={!testQuery.trim()}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Run Test
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
