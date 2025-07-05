"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
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
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Grid3X3,
  List,
  Clock3,
  Hash,
  FileImage,
  FileArchiveIcon,
  FileSpreadsheet,
  FileCode,
  FileArchive,
  FileVideo,
  FileAudio,
  Star,
  Edit,
  Copy,
  Lock,
  Unlock,
  Tag,
  History,
  Settings,
  Plus,
  X,
  Check,
  AlertTriangle,
  Info,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Folder structure data
const folderStructure = [
  {
    id: "tax",
    name: "Tax Documents",
    icon: Folder,
    isOpen: true,
    children: [
      { id: "itr", name: "ITR Files", icon: FileText, count: 4 },
      { id: "gst", name: "GST Returns", icon: FileText, count: 3 },
      { id: "tds", name: "TDS Certificates", icon: FileText, count: 2 },
    ],
  },
  {
    id: "legal",
    name: "Legal Documents",
    icon: Folder,
    isOpen: false,
    children: [
      { id: "contracts", name: "Contracts", icon: FileText, count: 2 },
      { id: "agreements", name: "Agreements", icon: FileText, count: 1 },
      { id: "notices", name: "Notices", icon: FileText, count: 1 },
    ],
  },
  {
    id: "compliance",
    name: "Compliance",
    icon: Folder,
    isOpen: false,
    children: [
      { id: "licenses", name: "Licenses", icon: FileText, count: 1 },
      { id: "registrations", name: "Registrations", icon: FileText, count: 1 },
    ],
  },
]

// Mock documents data with Ronit Raj as author and unique notary hashes
const documents = [
  {
    id: 1,
    name: "Annual Compliance Report 2024.pdf",
    type: "pdf",
    folder: "compliance",
    status: "processed",
    uploadedBy: "Ronit Raj",
    uploadDate: "2024-03-15",
    modifiedDate: "2024-03-15",
    size: "2.4 MB",
    pages: 24,
    blockchainHash: "0x1234...abcd",
    notaryHash: "0x7a8b9c...F1e2d3",
    tags: ["compliance", "annual", "2024"],
    ocrData: "Extracted text from document...",
    version: "1.0",
    isFavorite: true,
  },
  {
    id: 2,
    name: "GST Return Filing - March.xlsx",
    type: "spreadsheet",
    folder: "tax/gst",
    status: "pending",
    uploadedBy: "Ronit Raj",
    uploadDate: "2024-03-14",
    modifiedDate: "2024-03-14",
    size: "1.8 MB",
    pages: 12,
    blockchainHash: "0x5678...efgh",
    notaryHash: "0x4f5e6d...C9b8a7",
    tags: ["tax", "gst", "march"],
    ocrData: null,
    version: "1.0",
    isFavorite: false,
  },
  {
    id: 3,
    name: "Employment Contract - Amit Patel.docx",
    type: "document",
    folder: "legal/contracts",
    status: "error",
    uploadedBy: "Ronit Raj",
    uploadDate: "2024-03-13",
    modifiedDate: "2024-03-13",
    size: "856 KB",
    pages: 8,
    blockchainHash: null,
    notaryHash: "0x2d3c4b...E7f6g5",
    tags: ["legal", "contract", "employment"],
    ocrData: null,
    version: "1.0",
    isFavorite: false,
  },
  {
    id: 4,
    name: "Partnership Agreement Draft.pdf",
    type: "pdf",
    folder: "legal/agreements",
    status: "processed",
    uploadedBy: "Ronit Raj",
    uploadDate: "2024-03-12",
    modifiedDate: "2024-03-12",
    size: "3.2 MB",
    pages: 32,
    blockchainHash: "0x9abc...ijkl",
    notaryHash: "0x1e2f3g...H8i7j6",
    tags: ["legal", "agreement", "partnership"],
    ocrData: "Extracted text from agreement...",
    version: "1.0",
    isFavorite: true,
  },
]

export default function DocumentsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFolder, setSelectedFolder] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list" | "timeline">("grid")
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])
  const [previewDocument, setPreviewDocument] = useState<any>(null)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<string[]>(["tax"])
  const [showNotaryHashes, setShowNotaryHashes] = useState(false)
  const [loadingHashes, setLoadingHashes] = useState<number[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle notary hash toggle
  const handleNotaryHashToggle = () => {
    if (!showNotaryHashes) {
      setLoadingHashes(documents.map(doc => doc.id))
      setTimeout(() => {
        setLoadingHashes([])
        setShowNotaryHashes(true)
      }, 1000)
    } else {
      setShowNotaryHashes(false)
    }
  }

  // Filter documents based on search and folder
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesFolder = selectedFolder === "all" || doc.folder.includes(selectedFolder)
    return matchesSearch && matchesFolder
  })

  // Get file type icon
  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return FileArchiveIcon
      case "spreadsheet":
        return FileSpreadsheet
      case "document":
        return FileText
      case "image":
        return FileImage
      case "video":
        return FileVideo
      case "audio":
        return FileAudio
      case "archive":
        return FileArchive
      default:
        return FileText
    }
  }



  // Toggle folder expansion
  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    )
  }

  // Handle document selection
  const toggleDocumentSelection = (docId: number) => {
    setSelectedDocuments(prev =>
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    )
  }

  // Handle bulk selection
  const selectAll = () => {
    setSelectedDocuments(filteredDocuments.map(doc => doc.id))
  }

  const deselectAll = () => {
    setSelectedDocuments([])
  }

  // Handle file upload
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setIsUploadModalOpen(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFileUpload(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className="min-h-screen bg-[#F8F3EE] flex">
      {/* Left Sidebar - Folder Structure */}
      <div className="w-64 bg-white border-r border-[#D1C4B8] flex flex-col">
        <div className="p-4 border-b border-[#D1C4B8]">
          <h2 className="font-semibold text-[#2A2A2A] mb-2">Folders</h2>
          <Button
            variant="outline"
            size="sm"
            className="w-full border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-1">
            {/* All Documents */}
            <div
              className={cn(
                "flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors",
                selectedFolder === "all"
                  ? "bg-[#F8F3EE] text-[#8B4513]"
                  : "text-[#8B7355] hover:bg-[#F8F3EE] hover:text-[#8B4513]"
              )}
              onClick={() => setSelectedFolder("all")}
            >
              <Folder className="w-4 h-4" />
              <span className="text-sm">All Documents</span>
              <Badge variant="secondary" className="ml-auto text-xs bg-[#E8DDD1] text-[#8B7355]">
                {documents.length}
              </Badge>
            </div>

            {/* Folder Structure */}
            {folderStructure.map((folder) => (
              <div key={folder.id}>
                <div
                  className={cn(
                    "flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors",
                    selectedFolder === folder.id
                      ? "bg-[#F8F3EE] text-[#8B4513]"
                      : "text-[#8B7355] hover:bg-[#F8F3EE] hover:text-[#8B4513]"
                  )}
                  onClick={() => setSelectedFolder(folder.id)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFolder(folder.id)
                    }}
                    className="p-1 hover:bg-[#E8DDD1] rounded"
                  >
                    {expandedFolders.includes(folder.id) ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </button>
                  <Folder className="w-4 h-4" />
                  <span className="text-sm flex-1">{folder.name}</span>
                  <Badge variant="secondary" className="text-xs bg-[#E8DDD1] text-[#8B7355]">
                    {folder.children.reduce((sum, child) => sum + child.count, 0)}
                  </Badge>
                </div>

                {expandedFolders.includes(folder.id) && (
                  <div className="ml-6 space-y-1 mt-1">
                    {folder.children.map((child) => (
                      <div
                        key={child.id}
                        className={cn(
                          "flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors",
                          selectedFolder === `${folder.id}/${child.id}`
                            ? "bg-[#F8F3EE] text-[#8B4513]"
                            : "text-[#8B7355] hover:bg-[#F8F3EE] hover:text-[#8B4513]"
                        )}
                        onClick={() => setSelectedFolder(`${folder.id}/${child.id}`)}
                      >
                        <child.icon className="w-3 h-3" />
                        <span className="text-xs flex-1">{child.name}</span>
                        <Badge variant="secondary" className="text-xs bg-[#E8DDD1] text-[#8B7355]">
                          {child.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header Section */}
        <div className="bg-white border-b border-[#D1C4B8] p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-[#2A2A2A]">Documents</h1>
              <p className="text-[#8B7355] text-sm">
                {filteredDocuments.length} documents in {selectedFolder === "all" ? "all folders" : selectedFolder}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {/* Notary Hash Toggle */}
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-[#8B4513]" />
                <span className="text-sm text-[#8B7355]">Notary Hashes</span>
                <Switch
                  checked={showNotaryHashes}
                  onCheckedChange={handleNotaryHashToggle}
                  disabled={loadingHashes.length > 0}
                />
              </div>

              {/* View Mode Toggles */}
              <div className="flex border border-[#D1C4B8] rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "rounded-r-none border-0",
                    viewMode === "grid"
                      ? "bg-[#8B4513] text-white"
                      : "text-[#8B7355] hover:bg-[#F8F3EE]"
                  )}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "rounded-none border-0",
                    viewMode === "list"
                      ? "bg-[#8B4513] text-white"
                      : "text-[#8B7355] hover:bg-[#F8F3EE]"
                  )}
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "timeline" ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "rounded-l-none border-0",
                    viewMode === "timeline"
                      ? "bg-[#8B4513] text-white"
                      : "text-[#8B7355] hover:bg-[#F8F3EE]"
                  )}
                  onClick={() => setViewMode("timeline")}
                >
                  <Clock3 className="w-4 h-4" />
                </Button>
              </div>

              {/* Upload Button */}
              <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#8B4513] hover:bg-[#6B3410] text-white">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Upload Documents</DialogTitle>
                    <DialogDescription>
                      Drag and drop files here or click to browse
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div
                      className="border-2 border-dashed border-[#D1C4B8] rounded-lg p-8 text-center"
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                    >
                      {isUploading ? (
                        <div className="space-y-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B4513] mx-auto"></div>
                          <Progress value={uploadProgress} className="w-full" />
                          <p className="text-sm text-[#8B7355]">Uploading... {uploadProgress}%</p>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-12 h-12 text-[#8B7355] mx-auto mb-4" />
                          <p className="text-sm text-[#8B7355] mb-2">
                            Drag and drop files here, or click to select
                          </p>
                          <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
                          >
                            Choose Files
                          </Button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => handleFileUpload(e.target.files)}
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="ocr" defaultChecked />
                        <label htmlFor="ocr" className="text-sm text-[#8B7355]">
                          Enable OCR processing
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="blockchain" defaultChecked />
                        <label htmlFor="blockchain" className="text-sm text-[#8B7355]">
                          Generate blockchain hash
                        </label>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8B7355]" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#F8F3EE] border-[#D1C4B8] focus:border-[#8B4513]"
              />
            </div>

            <Select>
              <SelectTrigger className="w-48 border-[#D1C4B8]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
                <SelectItem value="spreadsheet">Spreadsheets</SelectItem>
                <SelectItem value="image">Images</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-48 border-[#D1C4B8]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedDocuments.length > 0 && (
            <div className="flex items-center space-x-2 mt-4 p-3 bg-[#F8F3EE] rounded-lg">
              <span className="text-sm text-[#8B7355]">
                {selectedDocuments.length} selected
              </span>
              <Separator orientation="vertical" className="h-4" />
              <Button size="sm" variant="outline" className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button size="sm" variant="outline" className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button size="sm" variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <Button size="sm" variant="ghost" onClick={deselectAll}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Documents Content */}
        <div className="flex-1 p-6">
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDocuments.map((doc) => {
                const FileIcon = getFileIcon(doc.type)

                return (
                  <Card
                    key={doc.id}
                    className="border-[#D1C4B8] hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setPreviewDocument(doc)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 bg-[#F8F3EE] rounded-lg flex items-center justify-center">
                          <FileIcon className="w-6 h-6 text-[#8B4513]" />
                        </div>
                        <div className="flex items-center space-x-1">
                          <Checkbox
                            checked={selectedDocuments.includes(doc.id)}
                            onCheckedChange={() => toggleDocumentSelection(doc.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => e.stopPropagation()}
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share className="w-4 h-4 mr-2" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
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

                      <div className="space-y-2">
                        <h3 className="font-medium text-[#2A2A2A] text-sm truncate">
                          {doc.name}
                        </h3>

                        {/* Notary Hash Display */}
                        {(showNotaryHashes || loadingHashes.includes(doc.id)) && (
                          <div className="flex items-center space-x-2">
                            <Shield className="w-3 h-3 text-[#8B4513]" />
                            {loadingHashes.includes(doc.id) ? (
                              <div className="flex items-center space-x-1">
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#8B4513]"></div>
                                <span className="text-xs text-[#8B7355]">Loading hash...</span>
                              </div>
                            ) : (
                              <code className="text-xs bg-[#E8DDD1] px-2 py-1 rounded text-[#8B4513]">
                                {doc.notaryHash}
                              </code>
                            )}
                          </div>
                        )}

                        <div className="flex items-center space-x-2 text-xs text-[#8B7355]">
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>{doc.pages} pages</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {doc.blockchainHash && (
                            <Hash className="w-3 h-3 text-[#8B7355]" />
                          )}
                          {doc.isFavorite && (
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-[#8B7355]">
                          <User className="w-3 h-3" />
                          <span>{doc.uploadedBy}</span>
                          <span>•</span>
                          <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {viewMode === "list" && (
            <Card className="border-[#D1C4B8]">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#F8F3EE]">
                      <tr>
                        <th className="p-4 text-left">
                          <Checkbox
                            checked={selectedDocuments.length === filteredDocuments.length}
                            onCheckedChange={(checked) => checked ? selectAll() : deselectAll()}
                          />
                        </th>
                        <th className="p-4 text-left text-sm font-medium text-[#2A2A2A]">Name</th>
                        <th className="p-4 text-left text-sm font-medium text-[#2A2A2A]">Type</th>
                        <th className="p-4 text-left text-sm font-medium text-[#2A2A2A]">Modified</th>
                        <th className="p-4 text-left text-sm font-medium text-[#2A2A2A]">Size</th>
                        <th className="p-4 text-left text-sm font-medium text-[#2A2A2A]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDocuments.map((doc) => {
                        const FileIcon = getFileIcon(doc.type)

                        return (
                          <tr key={doc.id} className="border-b border-[#D1C4B8] hover:bg-[#F8F3EE]">
                            <td className="p-4">
                              <Checkbox
                                checked={selectedDocuments.includes(doc.id)}
                                onCheckedChange={() => toggleDocumentSelection(doc.id)}
                              />
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <FileIcon className="w-5 h-5 text-[#8B7355]" />
                                <div>
                                  <div className="font-medium text-[#2A2A2A]">{doc.name}</div>
                                  <div className="text-sm text-[#8B7355]">{doc.uploadedBy}</div>
                                  {/* Notary Hash in List View */}
                                  {(showNotaryHashes || loadingHashes.includes(doc.id)) && (
                                    <div className="flex items-center space-x-1 mt-1">
                                      <Shield className="w-3 h-3 text-[#8B4513]" />
                                      {loadingHashes.includes(doc.id) ? (
                                        <div className="flex items-center space-x-1">
                                          <div className="animate-spin rounded-full h-2 w-2 border-b-2 border-[#8B4513]"></div>
                                          <span className="text-xs text-[#8B7355]">Loading...</span>
                                        </div>
                                      ) : (
                                        <code className="text-xs bg-[#E8DDD1] px-1 py-0.5 rounded text-[#8B4513]">
                                          {doc.notaryHash}
                                        </code>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-sm text-[#8B7355] capitalize">{doc.type}</td>
                            <td className="p-4 text-sm text-[#8B7355]">
                              {new Date(doc.modifiedDate).toLocaleDateString()}
                            </td>
                            <td className="p-4 text-sm text-[#8B7355]">{doc.size}</td>
                            <td className="p-4">
                              <div className="flex items-center space-x-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setPreviewDocument(doc)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {filteredDocuments.length === 0 && (
            <Card className="border-[#D1C4B8]">
              <CardContent className="p-16 text-center">
                <FileText className="w-16 h-16 text-[#8B7355] mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-[#2A2A2A] mb-3">No documents found</h3>
                <p className="text-[#8B7355] mb-6">
                  {searchQuery ? "Try adjusting your search terms" : "Upload your first document to get started"}
                </p>
                <Button
                  className="bg-[#8B4513] hover:bg-[#6B3410] text-white"
                  onClick={() => setIsUploadModalOpen(true)}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Document Preview Panel */}
      <Sheet open={!!previewDocument} onOpenChange={() => setPreviewDocument(null)}>
        <SheetContent className="w-[600px] sm:w-[800px]">
          {previewDocument && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>{previewDocument.name}</span>
                </SheetTitle>
                <SheetDescription>
                  Document preview and metadata
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Preview Area */}
                <div className="border border-[#D1C4B8] rounded-lg p-4 bg-[#F8F3EE] min-h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-16 h-16 text-[#8B7355] mx-auto mb-4" />
                    <p className="text-[#8B7355]">Document preview would appear here</p>
                  </div>
                </div>

                {/* Metadata */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-[#2A2A2A]">Document Information</h3>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-[#8B7355]">Type:</span>
                      <span className="ml-2 text-[#2A2A2A] capitalize">{previewDocument.type}</span>
                    </div>
                    <div>
                      <span className="text-[#8B7355]">Size:</span>
                      <span className="ml-2 text-[#2A2A2A]">{previewDocument.size}</span>
                    </div>
                    <div>
                      <span className="text-[#8B7355]">Pages:</span>
                      <span className="ml-2 text-[#2A2A2A]">{previewDocument.pages}</span>
                    </div>
                    <div>
                      <span className="text-[#8B7355]">Version:</span>
                      <span className="ml-2 text-[#2A2A2A]">{previewDocument.version}</span>
                    </div>
                    <div>
                      <span className="text-[#8B7355]">Uploaded by:</span>
                      <span className="ml-2 text-[#2A2A2A]">{previewDocument.uploadedBy}</span>
                    </div>
                    <div>
                      <span className="text-[#8B7355]">Upload date:</span>
                      <span className="ml-2 text-[#2A2A2A]">
                        {new Date(previewDocument.uploadDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <span className="text-[#8B7355] text-sm">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {previewDocument.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs border-[#8B4513] text-[#8B4513]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Blockchain Hash */}
                  {previewDocument.blockchainHash && (
                    <div>
                      <span className="text-[#8B7355] text-sm">Blockchain Hash:</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <Hash className="w-4 h-4 text-[#8B7355]" />
                        <code className="text-xs bg-[#E8DDD1] px-2 py-1 rounded">
                          {previewDocument.blockchainHash}
                        </code>
                      </div>
                    </div>
                  )}

                  {/* Notary Hash */}
                  <div>
                    <span className="text-[#8B7355] text-sm">Notary Hash:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <Shield className="w-4 h-4 text-[#8B4513]" />
                      <code className="text-xs bg-[#E8DDD1] px-2 py-1 rounded text-[#8B4513]">
                        {previewDocument.notaryHash}
                      </code>
                    </div>
                  </div>

                  {/* OCR Data */}
                  {previewDocument.ocrData && (
                    <div>
                      <span className="text-[#8B7355] text-sm">OCR Extracted Data:</span>
                      <div className="mt-1 p-3 bg-[#E8DDD1] rounded text-xs text-[#2A2A2A]">
                        {previewDocument.ocrData}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 pt-4 border-t border-[#D1C4B8]">
                  <Button size="sm" className="bg-[#8B4513] hover:bg-[#6B3410] text-white">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline" className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button size="sm" variant="outline" className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white">
                    <History className="w-4 h-4 mr-2" />
                    Version History
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
