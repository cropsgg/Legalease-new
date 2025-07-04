"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  HelpCircle, 
  Search,
  MessageCircle, 
  BookOpen, 
  Video,
  FileText,
  Mail,
  Phone,
  Clock,
  ChevronRight,
  ExternalLink,
  Play,
  Download,
  Star,
  ThumbsUp,
  ThumbsDown,
  Send,
  Lightbulb,
  Users,
  Shield,
  Zap,
  Globe,
  CheckCircle
} from "lucide-react"

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  helpful: number
  notHelpful: number
}

interface Article {
  id: string
  title: string
  description: string
  category: string
  readTime: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  lastUpdated: string
}

interface VideoTutorial {
  id: string
  title: string
  description: string
  duration: string
  thumbnail: string
  category: string
}

const faqData: FAQItem[] = [
  {
    id: "1",
    question: "How do I upload documents for AI analysis?",
    answer: "To upload documents, go to the Documents page and click the 'Upload' button. You can drag and drop files or click to browse. Supported formats include PDF, DOC, DOCX, and TXT. Once uploaded, our AI will automatically analyze the document and provide insights.",
    category: "Getting Started",
    helpful: 89,
    notHelpful: 3
    },
    {
    id: "2", 
    question: "What file formats are supported?",
    answer: "LegalEase supports PDF, Microsoft Word (DOC, DOCX), Rich Text Format (RTF), and plain text (TXT) files. For best results, we recommend using searchable PDFs or Word documents.",
    category: "Documents",
    helpful: 76,
    notHelpful: 2
  },
  {
    id: "3",
    question: "How does the AI legal analysis work?",
    answer: "Our AI uses advanced natural language processing to analyze legal documents. It identifies key clauses, potential risks, compliance issues, and provides actionable recommendations. The AI is trained on millions of legal documents and continuously updated with the latest legal standards.",
    category: "AI Features",
    helpful: 94,
    notHelpful: 5
    },
    {
    id: "4",
    question: "Can I customize compliance workflows?",
    answer: "Yes! Professional and Enterprise plans include custom workflow creation. You can define approval processes, set automated reminders, and create multi-step compliance procedures tailored to your organization's needs.",
    category: "Workflows",
    helpful: 67,
    notHelpful: 1
    },
    {
    id: "5",
    question: "Is my data secure?",
    answer: "Absolutely. We use enterprise-grade encryption, SOC 2 Type II compliance, and follow strict data privacy regulations including GDPR and CCPA. Your documents are encrypted at rest and in transit, and we never share your data with third parties.",
    category: "Security",
    helpful: 102,
    notHelpful: 0
  }
]

const articles: Article[] = [
  {
    id: "1",
    title: "Getting Started with LegalEase",
    description: "A comprehensive guide to setting up your account and uploading your first documents",
    category: "Getting Started",
    readTime: "5 min read",
    difficulty: "Beginner",
    lastUpdated: "2023-12-15"
  },
  {
    id: "2",
    title: "Understanding AI Legal Analysis Results",
    description: "Learn how to interpret and act on AI-generated insights and recommendations",
    category: "AI Features",
    readTime: "8 min read",
    difficulty: "Intermediate",
    lastUpdated: "2023-12-10"
  },
  {
    id: "3",
    title: "Setting Up Compliance Workflows",
    description: "Create automated compliance processes and approval workflows for your team",
    category: "Workflows",
    readTime: "12 min read",
    difficulty: "Advanced",
    lastUpdated: "2023-12-08"
  },
  {
    id: "4",
    title: "Document Management Best Practices",
    description: "Organize and manage your legal documents effectively using LegalEase features",
    category: "Documents",
    readTime: "6 min read",
    difficulty: "Beginner",
    lastUpdated: "2023-12-05"
  }
  ]

const videoTutorials: VideoTutorial[] = [
    {
    id: "1",
    title: "LegalEase Platform Overview",
    description: "A complete walkthrough of the LegalEase platform and its features",
    duration: "15:30",
    thumbnail: "/placeholder.jpg",
    category: "Getting Started"
    },
    {
    id: "2",
    title: "Document Upload and Analysis",
    description: "Step-by-step guide to uploading documents and understanding AI analysis",
    duration: "8:45",
    thumbnail: "/placeholder.jpg",
    category: "Documents"
    },
    {
    id: "3",
    title: "Creating Custom Workflows",
    description: "Learn how to create and manage custom compliance workflows",
    duration: "12:20",
    thumbnail: "/placeholder.jpg",
    category: "Workflows"
  }
]

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState("faq")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: "medium"
  })

  const categories = ["all", "Getting Started", "Documents", "AI Features", "Workflows", "Security", "Billing"]

  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return <Badge className="legal-badge legal-badge-success text-xs">Beginner</Badge>
      case "Intermediate":
        return <Badge className="legal-badge legal-badge-warning text-xs">Intermediate</Badge>
      case "Advanced":
        return <Badge className="legal-badge legal-badge-error text-xs">Advanced</Badge>
      default:
        return <Badge className="legal-badge text-xs">Unknown</Badge>
    }
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle contact form submission
    console.log("Contact form submitted:", contactForm)
    // Reset form or show success message
  }

  return (
    <div className="min-h-screen legal-bg-primary p-6">
      <div className="max-w-6xl mx-auto">
      {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 legal-icon-bg rounded-xl flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-white" />
      </div>
                <div>
              <h1 className="text-3xl legal-heading">Help Center</h1>
              <p className="text-legal-secondary legal-body">Find answers, guides, and get support</p>
            </div>
          </div>

          {/* Search Bar */}
          <Card className="legal-card border-legal-border">
        <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-legal-secondary" />
            <Input
                  placeholder="Search for help articles, FAQs, or guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
                  className="legal-input pl-12 py-4 text-base"
            />
          </div>
        </CardContent>
      </Card>
        </div>

        {/* Quick Help Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BookOpen, title: "Getting Started", description: "New to LegalEase? Start here" },
            { icon: Zap, title: "AI Features", description: "Learn about AI analysis" },
            { icon: Shield, title: "Security & Privacy", description: "Data protection info" },
            { icon: MessageCircle, title: "Contact Support", description: "Get help from our team" }
          ].map((item, index) => (
            <Card key={index} className="legal-card-hover border-legal-border cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 legal-icon-bg rounded-xl flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium text-legal-dark-text legal-body mb-1">{item.title}</h3>
                <p className="text-sm text-legal-secondary legal-body">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 legal-card p-2 h-auto">
            <TabsTrigger 
              value="faq" 
              className="flex items-center space-x-2 py-3 data-[state=active]:bg-legal-bg-secondary data-[state=active]:text-legal-dark-text rounded-xl transition-all duration-200"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline legal-body">FAQ</span>
            </TabsTrigger>
            <TabsTrigger 
              value="articles" 
              className="flex items-center space-x-2 py-3 data-[state=active]:bg-legal-bg-secondary data-[state=active]:text-legal-dark-text rounded-xl transition-all duration-200"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline legal-body">Articles</span>
            </TabsTrigger>
            <TabsTrigger 
              value="videos" 
              className="flex items-center space-x-2 py-3 data-[state=active]:bg-legal-bg-secondary data-[state=active]:text-legal-dark-text rounded-xl transition-all duration-200"
            >
              <Video className="w-4 h-4" />
              <span className="hidden sm:inline legal-body">Videos</span>
            </TabsTrigger>
            <TabsTrigger 
              value="contact" 
              className="flex items-center space-x-2 py-3 data-[state=active]:bg-legal-bg-secondary data-[state=active]:text-legal-dark-text rounded-xl transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline legal-body">Contact</span>
            </TabsTrigger>
        </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            {/* Category Filter */}
            <Card className="legal-card border-legal-border">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category 
                        ? "btn-legal-primary" 
                        : "border-legal-border hover:bg-legal-bg-secondary text-legal-secondary hover:text-legal-dark-text"
                      }
                    >
                      {category === "all" ? "All Categories" : category}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* FAQ Accordion */}
            <Card className="legal-card-hover border-legal-border">
              <CardHeader>
                <CardTitle className="legal-heading">Frequently Asked Questions</CardTitle>
                <CardDescription className="text-legal-secondary legal-body">
                  Find quick answers to common questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id} className="border border-legal-border rounded-xl px-4">
                      <AccordionTrigger className="text-left legal-body hover:no-underline">
                        <div className="flex items-start justify-between w-full">
                          <span className="font-medium text-legal-dark-text pr-4">{faq.question}</span>
                          <Badge variant="outline" className="text-xs text-legal-secondary border-legal-border ml-2">
                            {faq.category}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4 pb-6">
                        <p className="text-legal-secondary legal-body mb-4">{faq.answer}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-sm text-legal-secondary">
                            <span className="legal-body">Was this helpful?</span>
                            <Button variant="ghost" size="sm" className="h-8 px-3 hover:bg-green-50 hover:text-green-600">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              {faq.helpful}
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-3 hover:bg-red-50 hover:text-red-600">
                              <ThumbsDown className="w-4 h-4 mr-1" />
                              {faq.notHelpful}
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-6">
            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="legal-card-hover border-legal-border cursor-pointer">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-legal-dark-text legal-heading mb-2">{article.title}</h3>
                          <p className="text-legal-secondary legal-body text-sm mb-3">{article.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-legal-secondary ml-2 flex-shrink-0" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs text-legal-secondary border-legal-border">
                            {article.category}
                          </Badge>
                          {getDifficultyBadge(article.difficulty)}
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-legal-secondary">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span className="legal-body">{article.readTime}</span>
                          </div>
                          <span className="legal-body">Updated {new Date(article.lastUpdated).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

            {/* Featured Articles */}
            <Card className="legal-card-hover border-legal-border">
            <CardHeader>
                <CardTitle className="legal-heading flex items-center space-x-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  <span>Featured Articles</span>
                </CardTitle>
                <CardDescription className="text-legal-secondary legal-body">
                  Essential guides for getting the most out of LegalEase
                </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                    "Complete Guide to Document Analysis",
                    "Setting Up Your First Compliance Workflow",
                    "Understanding Legal AI Recommendations",
                    "Best Practices for Document Organization"
                  ].map((title, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-legal-bg-secondary/30 rounded-xl hover:bg-legal-bg-secondary/50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-legal-accent/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-legal-accent" />
                        </div>
                        <span className="font-medium text-legal-dark-text legal-body">{title}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-legal-secondary" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-6">
            {/* Video Tutorials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoTutorials.map((video) => (
                <Card key={video.id} className="legal-card-hover border-legal-border cursor-pointer">
                <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Video Thumbnail */}
                      <div className="relative bg-legal-bg-secondary/30 rounded-xl h-40 flex items-center justify-center">
                        <div className="w-12 h-12 bg-legal-accent/20 rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 text-legal-accent ml-1" />
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded legal-body">
                          {video.duration}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-legal-dark-text legal-heading mb-2">{video.title}</h3>
                        <p className="text-legal-secondary legal-body text-sm mb-3">{video.description}</p>
                        <Badge variant="outline" className="text-xs text-legal-secondary border-legal-border">
                          {video.category}
                        </Badge>
                      </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

            {/* Video Series */}
            <Card className="legal-card-hover border-legal-border">
            <CardHeader>
                <CardTitle className="legal-heading">Getting Started Series</CardTitle>
                <CardDescription className="text-legal-secondary legal-body">
                  Complete video course for new users
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                  {[
                    { title: "Welcome to LegalEase", duration: "3:45", completed: true },
                    { title: "Setting Up Your Account", duration: "5:20", completed: true },
                    { title: "Uploading Your First Document", duration: "7:15", completed: false },
                    { title: "Understanding AI Analysis", duration: "9:30", completed: false },
                    { title: "Creating Custom Workflows", duration: "12:45", completed: false }
                  ].map((lesson, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-legal-border rounded-xl hover:bg-legal-bg-secondary/50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-legal-accent/10 rounded-lg flex items-center justify-center">
                          {lesson.completed ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Play className="w-4 h-4 text-legal-accent" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-legal-dark-text legal-body">{lesson.title}</p>
                          <p className="text-xs text-legal-secondary legal-body">{lesson.duration}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-legal-secondary" />
                    </div>
                ))}
                </div>
            </CardContent>
          </Card>
        </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Form */}
              <Card className="legal-card-hover border-legal-border">
                <CardHeader>
                  <CardTitle className="legal-heading">Send us a Message</CardTitle>
                  <CardDescription className="text-legal-secondary legal-body">
                    Can't find what you're looking for? We're here to help!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-legal-dark-text font-medium legal-body">
                          Name
                        </Label>
                        <Input
                          id="name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                          className="legal-input"
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-legal-dark-text font-medium legal-body">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                          className="legal-input"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-legal-dark-text font-medium legal-body">
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                        className="legal-input"
                        placeholder="How can we help?"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-legal-dark-text font-medium legal-body">
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        value={contactForm.message}
                        onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                        className="legal-input"
                        placeholder="Describe your question or issue..."
                        rows={4}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="btn-legal-primary w-full">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Options */}
              <div className="space-y-6">
                {/* Support Channels */}
                <Card className="legal-card-hover border-legal-border">
                  <CardHeader>
                    <CardTitle className="legal-heading">Other Ways to Reach Us</CardTitle>
                    <CardDescription className="text-legal-secondary legal-body">
                      Choose the best way to get in touch
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-4 border border-legal-border rounded-xl">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-legal-dark-text legal-body">Email Support</h4>
                          <p className="text-sm text-legal-secondary legal-body">support@legalease.com</p>
                          <p className="text-xs text-legal-secondary legal-body">Response within 24 hours</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 p-4 border border-legal-border rounded-xl">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                          <Phone className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-legal-dark-text legal-body">Phone Support</h4>
                          <p className="text-sm text-legal-secondary legal-body">1-800-LEGAL-AI</p>
                          <p className="text-xs text-legal-secondary legal-body">Mon-Fri, 9AM-6PM PST</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 p-4 border border-legal-border rounded-xl">
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                          <MessageCircle className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-legal-dark-text legal-body">Live Chat</h4>
                          <p className="text-sm text-legal-secondary legal-body">Available in app</p>
                          <p className="text-xs text-legal-secondary legal-body">Instant response during business hours</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Status & Resources */}
                <Card className="legal-card-hover border-legal-border">
            <CardHeader>
                    <CardTitle className="legal-heading">System Status & Resources</CardTitle>
            </CardHeader>
            <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-legal-dark-text legal-body">System Status</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-green-600 text-sm legal-body">All systems operational</span>
                          <ExternalLink className="w-3 h-3 text-legal-secondary" />
                    </div>
                    </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-legal-dark-text legal-body">API Documentation</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-legal-accent text-sm legal-body">View docs</span>
                          <ExternalLink className="w-3 h-3 text-legal-secondary" />
                    </div>
                  </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-legal-dark-text legal-body">Feature Requests</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-legal-accent text-sm legal-body">Submit idea</span>
                          <Lightbulb className="w-3 h-3 text-legal-secondary" />
                </div>
                </div>
              </div>
            </CardContent>
          </Card>
              </div>
            </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
}
