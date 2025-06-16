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
        return "bg-green-500"
      case "running":
        return "bg-blue-500"
      case "paused":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Workflows</h1>
          <p className="text-gray-600 dark:text-gray-400">Automate your legal processes with AI-powered workflows</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white gap-2">
            <Plus className="w-4 h-4" />
            New Workflow
          </Button>
        </div>
      </div>

      {/* Guest Mode Banner */}
      {user?.isGuest && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">Limited Workflows in Guest Mode</p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-300">
                    Upgrade to access unlimited workflows and advanced automation features
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-yellow-300 text-yellow-700">
                Upgrade Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="all">All Workflows</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
        </TabsList>

        {/* All Workflows Tab */}
        <TabsContent value="all" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Workflows</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user?.isGuest ? "3" : workflows.length}
                    </p>
                  </div>
                  <Workflow className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user?.isGuest ? "2" : workflows.filter((w) => w.status === "active").length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">94%</p>
                  </div>
                  <Zap className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Runs</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{user?.isGuest ? "45" : "200"}</p>
                  </div>
                  <Play className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workflows List */}
          <div className="grid gap-4">
            {workflows.slice(0, user?.isGuest ? 3 : workflows.length).map((workflow) => {
              const IconComponent = workflow.icon
              return (
                <Card key={workflow.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{workflow.name}</h3>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(workflow.status)}`} />
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {getStatusText(workflow.status)}
                              </span>
                            </div>
                            <Badge variant="secondary">{workflow.category}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{workflow.description}</p>
                          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Last run: {workflow.lastRun}
                            </span>
                            <span>{workflow.runs} runs</span>
                            <span className="flex items-center gap-1">
                              Success: {workflow.success}%
                              <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-green-500 rounded-full"
                                  style={{ width: `${workflow.success}%` }}
                                />
                              </div>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {workflow.status === "running" ? (
                          <Button size="sm" variant="outline" className="gap-2">
                            <Pause className="w-4 h-4" />
                            Pause
                          </Button>
                        ) : (
                          <Button size="sm" className="gap-2">
                            <Play className="w-4 h-4" />
                            Run
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Settings className="w-4 h-4 mr-2" />
                              Configure
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
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
        <TabsContent value="templates" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {templates.map((template, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="outline">{template.category}</Badge>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Complexity:</span>
                      <span className="font-medium">{template.complexity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Setup Time:</span>
                      <span className="font-medium">{template.estimatedTime}</span>
                    </div>
                    <Button className="w-full">Use Template</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Create New Tab */}
        <TabsContent value="create" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* New Workflow */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  New Workflow
                </CardTitle>
                <CardDescription>Create a new workflow from scratch.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workflowName">Workflow Name</Label>
                  <Input
                    id="workflowName"
                    placeholder="Enter workflow name"
                    value={newWorkflowName}
                    onChange={(e) => setNewWorkflowName(e.target.value)}
                  />
                </div>
                <Button className="w-full" disabled={!newWorkflowName.trim()}>
                  Create Workflow
                </Button>
              </CardContent>
            </Card>

            {/* Import Workflow */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Import Workflow
                </CardTitle>
                <CardDescription>Import an existing workflow from a file.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workflowFile">Workflow File</Label>
                  <Input id="workflowFile" type="file" accept=".json,.yaml,.yml" />
                </div>
                <Button className="w-full">Import Workflow</Button>
              </CardContent>
            </Card>

            {/* Example Workflows */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Example Workflows
                </CardTitle>
                <CardDescription>Start with a pre-built example workflow.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose from a list of example workflows to get started quickly.
                </p>
                <Button className="w-full">View Examples</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
