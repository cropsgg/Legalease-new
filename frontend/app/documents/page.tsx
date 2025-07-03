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
  Scale,
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
      color: "bg-success",
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
      color: "bg-legal-brown",
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
      color: "bg-warning",
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
      color: "bg-legal-gold",
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
      color: "bg-success",
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
      color: "bg-legal-beige",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "legal-badge-success"
      case "In Progress":
        return "legal-badge-warning"
      case "Under Review":
        return "legal-badge"
      case "Draft":
        return "legal-badge"
      default:
        return "legal-badge"
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
    <div className="space-y-8 legal-bg-primary min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl legal-heading mb-2">Documents</h1>
          <p className="text-legal-secondary legal-body text-lg">Upload, analyze, and manage your legal documents with AI</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="btn-legal-secondary gap-2">
            <Bot className="w-4 h-4" />
            AI Analysis
          </Button>
          <Button className="btn-legal-primary gap-2">
            <Upload className="w-4 h-4" />
            Upload Document
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
                  <p className="font-playfair font-semibold text-legal-dark-text">Limited Document Storage</p>
                  <p className="text-legal-secondary legal-body">
                    Upgrade to store unlimited documents and access advanced AI analysis
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="legal-card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-legal-secondary legal-body">Total Documents</p>
                <p className="text-3xl font-playfair font-semibold text-legal-dark-text mt-2">
                  {user?.isGuest ? "4" : documents.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-legal-brown/10 rounded-2xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-legal-brown" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="legal-card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-legal-secondary legal-body">AI Analyzed</p>
                <p className="text-3xl font-playfair font-semibold text-legal-dark-text mt-2">
                  {user?.isGuest ? "3" : documents.filter((d) => d.status === "Completed").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-legal-gold/10 rounded-2xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-legal-gold" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="legal-card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-legal-secondary legal-body">Under Review</p>
                <p className="text-3xl font-playfair font-semibold text-legal-dark-text mt-2">
                  {user?.isGuest ? "1" : documents.filter((d) => d.status === "Under Review").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-2xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="legal-card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-legal-secondary legal-body">Storage Used</p>
                <p className="text-3xl font-playfair font-semibold text-legal-dark-text mt-2">
                  {user?.isGuest ? "8.2 MB" : "24.8 MB"}
                </p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-2xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-legal-secondary" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="legal-input pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[180px] legal-input">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="legal-card">
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="legal">Legal</SelectItem>
            <SelectItem value="compliance">Compliance</SelectItem>
            <SelectItem value="tax">Tax</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="legal-card">
          <TabsTrigger value="all" className="data-[state=active]:bg-legal-beige data-[state=active]:text-legal-dark-text">All Documents</TabsTrigger>
          <TabsTrigger value="recent" className="data-[state=active]:bg-legal-beige data-[state=active]:text-legal-dark-text">Recent</TabsTrigger>
          <TabsTrigger value="favorites" className="data-[state=active]:bg-legal-beige data-[state=active]:text-legal-dark-text">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6 mt-6">
          {/* Documents Grid */}
          <div className="grid gap-6">
            {filteredDocuments.map((document) => {
              const IconComponent = document.icon
              return (
                <Card key={document.id} className="legal-card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-14 h-14 ${document.color}/10 rounded-2xl flex items-center justify-center`}>
                          <IconComponent className={`w-7 h-7 ${document.color.replace('bg-', 'text-')}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-playfair font-semibold text-legal-dark-text text-lg">{document.name}</h3>
                            <Badge className="legal-badge">{document.type}</Badge>
                            <Badge className={getStatusColor(document.status)}>
                              {getStatusIcon(document.status)}
                              <span className="ml-1">{document.status}</span>
                            </Badge>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-legal-secondary mb-3">
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
                            <Scale className="w-4 h-4 text-legal-brown" />
                            <span className="text-sm font-medium text-legal-brown">
                              AI Analysis: {document.aiAnalysis}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" className="btn-legal-outline gap-2">
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost" className="text-legal-secondary hover:text-legal-dark-text">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="legal-card">
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

          {filteredDocuments.length === 0 && (
            <Card className="legal-card">
              <CardContent className="p-16 text-center">
                <FileText className="w-16 h-16 text-legal-secondary mx-auto mb-6" />
                <h3 className="text-xl font-playfair font-semibold text-legal-dark-text mb-3">No documents found</h3>
                <p className="text-legal-secondary legal-body mb-6">
                  {searchQuery ? "Try adjusting your search terms" : "Upload your first document to get started"}
                </p>
                <Button className="btn-legal-primary gap-2">
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
