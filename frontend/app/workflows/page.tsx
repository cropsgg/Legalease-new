"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Upload,
  Zap,
  Play,
  Pause,
  MoreHorizontal,
  Clock,
  CheckCircle,
  FileText,
  Bot,
  Crown,
  ArrowRight,
  Workflow,
  Settings,
  Copy,
  Trash2,
  Scale,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function WorkflowsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("all")
  const [newWorkflowName, setNewWorkflowName] = useState("")

  const workflows = [
    {
      id: 1,
      name: "Contract Review & Analysis",
      description: "Automated contract analysis with AI-powered risk assessment",
      status: "active",
      lastRun: "2 hours ago",
      runs: 24,
      success: 96,
      category: "Legal",
      icon: FileText,
    },
    {
      id: 2,
      name: "GST Return Filing",
      description: "Automated GST return preparation and filing workflow",
      status: "running",
      lastRun: "Running now",
      runs: 12,
      success: 100,
      category: "Compliance",
      icon: Bot,
    },
    {
      id: 3,
      name: "Employee Onboarding",
      description: "Complete employee onboarding with document generation",
      status: "paused",
      lastRun: "1 day ago",
      runs: 8,
      success: 88,
      category: "HR",
      icon: Workflow,
    },
    {
      id: 4,
      name: "Invoice Processing",
      description: "Automated invoice processing and approval workflow",
      status: "active",
      lastRun: "30 minutes ago",
      runs: 156,
      success: 94,
      category: "Finance",
      icon: FileText,
    },
  ]

  const templates = [
    {
      name: "Contract Analysis",
      description: "AI-powered contract review and risk assessment",
      category: "Legal",
      complexity: "Intermediate",
      estimatedTime: "5-10 minutes",
    },
    {
      name: "Compliance Monitoring",
      description: "Automated compliance tracking and deadline management",
      category: "Compliance",
      complexity: "Advanced",
      estimatedTime: "15-20 minutes",
    },
    {
      name: "Document Generation",
      description: "Generate legal documents from templates",
      category: "Legal",
      complexity: "Beginner",
      estimatedTime: "2-5 minutes",
    },
    {
      name: "Payment Processing",
      description: "Automated payment workflow with notifications",
      category: "Finance",
      complexity: "Intermediate",
      estimatedTime: "10-15 minutes",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "legal-badge-success"
      case "running":
        return "legal-badge-warning"
      case "paused":
        return "legal-badge"
      default:
        return "legal-badge"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active"
      case "running":
        return "Running"
      case "paused":
        return "Paused"
      default:
        return "Inactive"
    }
  }

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "active":
        return <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
      case "running":
        return <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
      case "paused":
        return <div className="w-2 h-2 rounded-full bg-legal-secondary" />
      default:
        return <div className="w-2 h-2 rounded-full bg-legal-secondary" />
    }
  }

  return (
    <div className="space-y-8 legal-bg-primary min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl legal-heading mb-2">Workflows</h1>
          <p className="text-legal-secondary legal-body text-lg">Automate your legal processes with AI-powered workflows</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="btn-legal-secondary gap-2">
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Button className="btn-legal-primary gap-2">
            <Plus className="w-4 h-4" />
            New Workflow
          </Button>
        </div>
      </div>

      {/* Guest Mode Banner */}
      {user?.isGuest && (
        <Card className="legal-card border-warning/30 bg-warning/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-warning" />
                <div>
                  <p className="font-playfair font-semibold text-legal-dark-text">Limited Workflows in Guest Mode</p>
                  <p className="text-legal-secondary legal-body">
                    Upgrade to access unlimited workflows and advanced automation features
                  </p>
                </div>
              </div>
              <Button className="btn-legal-outline flex items-center gap-2">
                Upgrade Now
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="legal-card grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="all" className="data-[state=active]:bg-legal-beige data-[state=active]:text-legal-dark-text">All Workflows</TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-legal-beige data-[state=active]:text-legal-dark-text">Templates</TabsTrigger>
          <TabsTrigger value="create" className="data-[state=active]:bg-legal-beige data-[state=active]:text-legal-dark-text">Create New</TabsTrigger>
        </TabsList>

        {/* All Workflows Tab */}
        <TabsContent value="all" className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="legal-card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-legal-secondary legal-body">Total Workflows</p>
                    <p className="text-3xl font-playfair font-semibold text-legal-dark-text mt-2">
                      {user?.isGuest ? "3" : workflows.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-legal-brown/10 rounded-2xl flex items-center justify-center">
                    <Workflow className="w-6 h-6 text-legal-brown" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="legal-card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-legal-secondary legal-body">Active</p>
                    <p className="text-3xl font-playfair font-semibold text-legal-dark-text mt-2">
                      {user?.isGuest ? "2" : workflows.filter((w) => w.status === "active").length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-success/10 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="legal-card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-legal-secondary legal-body">Success Rate</p>
                    <p className="text-3xl font-playfair font-semibold text-legal-dark-text mt-2">94%</p>
                  </div>
                  <div className="w-12 h-12 bg-legal-gold/10 rounded-2xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-legal-gold" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="legal-card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-legal-secondary legal-body">Total Runs</p>
                    <p className="text-3xl font-playfair font-semibold text-legal-dark-text mt-2">{user?.isGuest ? "45" : "200"}</p>
                  </div>
                  <div className="w-12 h-12 bg-warning/10 rounded-2xl flex items-center justify-center">
                    <Play className="w-6 h-6 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workflows List */}
          <div className="grid gap-6">
            {workflows.slice(0, user?.isGuest ? 3 : workflows.length).map((workflow) => {
              const IconComponent = workflow.icon
              return (
                <Card key={workflow.id} className="legal-card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-14 h-14 legal-icon-bg rounded-2xl flex items-center justify-center">
                          <IconComponent className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-playfair font-semibold text-legal-dark-text text-lg">{workflow.name}</h3>
                            <div className="flex items-center gap-2">
                              {getStatusIndicator(workflow.status)}
                              <span className="text-sm text-legal-secondary">
                                {getStatusText(workflow.status)}
                              </span>
                            </div>
                            <Badge className="legal-badge">{workflow.category}</Badge>
                          </div>
                          <p className="text-sm text-legal-secondary legal-body mb-3">{workflow.description}</p>
                          <div className="flex items-center gap-6 text-sm text-legal-secondary">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Last run: {workflow.lastRun}
                            </span>
                            <span>{workflow.runs} runs</span>
                            <span className="flex items-center gap-2">
                              Success: {workflow.success}%
                              <div className="w-16 h-1 bg-legal-border rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-success rounded-full"
                                  style={{ width: `${workflow.success}%` }}
                                />
                              </div>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {workflow.status === "running" ? (
                          <Button size="sm" className="btn-legal-outline gap-2">
                            <Pause className="w-4 h-4" />
                            Pause
                          </Button>
                        ) : (
                          <Button size="sm" className="btn-legal-primary gap-2">
                            <Play className="w-4 h-4" />
                            Run
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost" className="text-legal-secondary hover:text-legal-dark-text">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="legal-card">
                            <DropdownMenuItem>
                              <Settings className="w-4 h-4 mr-2" />
                              Configure
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            {templates.map((template, index) => (
              <Card key={index} className="legal-card-hover">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="legal-heading text-xl">{template.name}</CardTitle>
                    <Badge className="legal-badge">{template.category}</Badge>
                  </div>
                  <CardDescription className="legal-body text-legal-secondary">{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-legal-secondary">Complexity:</span>
                      <span className="font-medium text-legal-dark-text">{template.complexity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-legal-secondary">Setup Time:</span>
                      <span className="font-medium text-legal-dark-text">{template.estimatedTime}</span>
                    </div>
                  </div>
                  <Button className="btn-legal-primary w-full">Use Template</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Create New Tab */}
        <TabsContent value="create" className="space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* New Workflow */}
            <Card className="legal-card-hover">
              <CardHeader className="pb-4">
                <CardTitle className="legal-heading text-xl flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  New Workflow
                </CardTitle>
                <CardDescription className="legal-body text-legal-secondary">Create a new workflow from scratch.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="workflowName" className="text-legal-dark-text font-medium">Workflow Name</Label>
                  <Input
                    id="workflowName"
                    placeholder="Enter workflow name"
                    value={newWorkflowName}
                    onChange={(e) => setNewWorkflowName(e.target.value)}
                    className="legal-input"
                  />
                </div>
                <Button className="btn-legal-primary w-full" disabled={!newWorkflowName.trim()}>
                  Create Workflow
                </Button>
              </CardContent>
            </Card>

            {/* Import Workflow */}
            <Card className="legal-card-hover">
              <CardHeader className="pb-4">
                <CardTitle className="legal-heading text-xl flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Import Workflow
                </CardTitle>
                <CardDescription className="legal-body text-legal-secondary">Import an existing workflow from a file.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="workflowFile" className="text-legal-dark-text font-medium">Workflow File</Label>
                  <Input id="workflowFile" type="file" accept=".json,.yaml,.yml" className="legal-input" />
                </div>
                <Button className="btn-legal-primary w-full">Import Workflow</Button>
              </CardContent>
            </Card>

            {/* Example Workflows */}
            <Card className="legal-card-hover">
              <CardHeader className="pb-4">
                <CardTitle className="legal-heading text-xl flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  Example Workflows
                </CardTitle>
                <CardDescription className="legal-body text-legal-secondary">Start with a pre-built example workflow.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-legal-secondary legal-body">
                  Choose from a list of example workflows to get started quickly.
                </p>
                <Button className="btn-legal-primary w-full">View Examples</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
