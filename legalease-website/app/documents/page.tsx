"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  FileText,
  Search,
  Filter,
  MoreHorizontal,
  Download,
  Eye,
  Share,
  Trash2,
  Crown,
  ArrowRight,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  Bot,
  Zap,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DocumentsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  const documents = [
    {
      id: 1,
      name: "Annual Compliance Report 2024",
      type: "Compliance",
      status: "Completed",
      aiAnalysis: "Risk Score: Low",
      uploadedBy: "John Doe",
      uploadDate: "2 hours ago",
      size: "2.4 MB",
      pages: 24,
      icon: FileText,
      color: "bg-green-500",
    },
    {
      id: 2,
      name: "GST Return Filing - March",
      type: "Tax",
      status: "In Progress",
      aiAnalysis: "Processing...",
      uploadedBy: "Jane Smith",
      uploadDate: "1 day ago",
      size: "1.8 MB",
      pages: 12,
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      id: 3,
      name: "Employment Contract - John Doe",
      type: "Legal",
      status: "Under Review",
      aiAnalysis: "3 clauses flagged",
      uploadedBy: "HR Team",
      uploadDate: "3 days ago",
      size: "856 KB",
      pages: 8,
      icon: FileText,
      color: "bg-yellow-500",
    },
    {
      id: 4,
      name: "Partnership Agreement Draft",
      type: "Legal",
      status: "Completed",
      aiAnalysis: "Risk Score: Medium",
      uploadedBy: "Legal Team",
      uploadDate: "1 week ago",
      size: "3.2 MB",
      pages: 32,
      icon: FileText,
      color: "bg-purple-500",
    },
    {
      id: 5,
      name: "Financial Audit Report Q4",
      type: "Finance",
      status: "Completed",
      aiAnalysis: "No issues found",
      uploadedBy: "Finance Team",
      uploadDate: "2 weeks ago",
      size: "4.1 MB",
      pages: 45,
      icon: FileText,
      color: "bg-green-500",
    },
    {
      id: 6,
      name: "Privacy Policy Update",
      type: "Compliance",
      status: "Draft",
      aiAnalysis: "GDPR compliant",
      uploadedBy: "Legal Team",
      uploadDate: "3 days ago",
      size: "1.2 MB",
      pages: 16,
      icon: FileText,
      color: "bg-orange-500",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "Under Review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "Draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4" />
      case "In Progress":
        return <Clock className="w-4 h-4" />
      case "Under Review":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const filteredDocuments = documents
    .filter((doc) => selectedCategory === "all" || doc.type.toLowerCase() === selectedCategory)
    .filter((doc) => doc.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, user?.isGuest ? 4 : documents.length)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Documents</h1>
          <p className="text-gray-600 dark:text-gray-400">Upload, analyze, and manage your legal documents with AI</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Bot className="w-4 h-4" />
            AI Analysis
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white gap-2">
            <Upload className="w-4 h-4" />
            Upload Document
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
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">Limited Document Storage</p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-300">
                    Upgrade to store unlimited documents and access advanced AI analysis
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.isGuest ? "4" : documents.length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">AI Analyzed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.isGuest ? "3" : documents.filter((d) => d.status === "Completed").length}
                </p>
              </div>
              <Bot className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Under Review</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.isGuest ? "1" : documents.filter((d) => d.status === "Under Review").length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Storage Used</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.isGuest ? "8.2 MB" : "24.8 MB"}
                </p>
              </div>
              <Zap className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="legal">Legal</SelectItem>
            <SelectItem value="compliance">Compliance</SelectItem>
            <SelectItem value="tax">Tax</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {/* Documents Grid */}
          <div className="grid gap-4">
            {filteredDocuments.map((document) => {
              const IconComponent = document.icon
              return (
                <Card key={document.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-12 h-12 ${document.color} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{document.name}</h3>
                            <Badge variant="outline">{document.type}</Badge>
                            <Badge className={getStatusColor(document.status)}>
                              {getStatusIcon(document.status)}
                              <span className="ml-1">{document.status}</span>
                            </Badge>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-2">
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {document.uploadedBy}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {document.uploadDate}
                            </span>
                            <span>{document.size}</span>
                            <span>{document.pages} pages</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Bot className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                              AI Analysis: {document.aiAnalysis}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="gap-2">
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share className="w-4 h-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Bot className="w-4 h-4 mr-2" />
                              Re-analyze
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

          {filteredDocuments.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No documents found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchQuery ? "Try adjusting your search terms" : "Upload your first document to get started"}
                </p>
                <Button className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Document
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
