"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Search,
  MessageSquare,
  Book,
  Video,
  FileText,
  Crown,
  ArrowRight,
  ExternalLink,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  Zap,
} from "lucide-react"

export default function HelpPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  const quickHelp = [
    {
      title: "Getting Started",
      description: "Learn the basics of LegalEase",
      icon: Book,
      articles: 12,
      color: "bg-blue-500",
    },
    {
      title: "Document Analysis",
      description: "How to use AI for document review",
      icon: FileText,
      articles: 8,
      color: "bg-green-500",
    },
    {
      title: "Compliance Tracking",
      description: "Stay on top of deadlines",
      icon: CheckCircle,
      articles: 15,
      color: "bg-purple-500",
    },
    {
      title: "Workflows",
      description: "Automate your legal processes",
      icon: Zap,
      articles: 10,
      color: "bg-orange-500",
    },
  ]

  const faqs = [
    {
      question: "How does AI document analysis work?",
      answer:
        "Our AI uses advanced natural language processing to analyze legal documents, identify key clauses, assess risks, and provide plain English summaries. The AI is trained on Indian legal frameworks and can handle contracts, agreements, compliance documents, and more.",
    },
    {
      question: "Is my data secure and confidential?",
      answer:
        "Yes, we use enterprise-grade security with end-to-end encryption. All documents are processed securely, and we follow strict data protection protocols. We're SOC 2 compliant and adhere to Indian data protection regulations.",
    },
    {
      question: "What compliance requirements does LegalEase track?",
      answer:
        "We track GST returns, MCA filings, labor law compliance, environmental clearances, tax deadlines, and more. Our system integrates with government APIs to provide real-time updates on regulatory changes.",
    },
    {
      question: "Can I integrate LegalEase with other tools?",
      answer:
        "Yes, we offer API access and integrations with popular business tools. Enterprise plans include custom integrations and dedicated support for implementation.",
    },
    {
      question: "How accurate is the AI analysis?",
      answer:
        "Our AI has a 95%+ accuracy rate for document analysis and risk assessment. However, we always recommend having critical documents reviewed by qualified legal professionals for final decisions.",
    },
    {
      question: "What happens if I miss a compliance deadline?",
      answer:
        "Our system sends multiple alerts before deadlines. If you miss one, we provide guidance on penalty mitigation and next steps. Pro users get priority support for urgent compliance issues.",
    },
  ]

  const supportOptions = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "24/7 for Pro users",
      icon: MessageSquare,
      action: "Start Chat",
      premium: false,
    },
    {
      title: "WhatsApp Support",
      description: "Quick assistance via WhatsApp",
      availability: "Business hours",
      icon: Phone,
      action: "Message Us",
      premium: true,
    },
    {
      title: "Email Support",
      description: "Detailed help via email",
      availability: "Response within 24 hours",
      icon: Mail,
      action: "Send Email",
      premium: false,
    },
    {
      title: "Video Call",
      description: "Screen sharing and personalized help",
      availability: "By appointment",
      icon: Video,
      action: "Schedule Call",
      premium: true,
    },
  ]

  const tutorials = [
    {
      title: "Setting Up Your First Workflow",
      duration: "5 min",
      type: "Video",
      difficulty: "Beginner",
      views: "2.1k",
    },
    {
      title: "AI Document Analysis Deep Dive",
      duration: "12 min",
      type: "Video",
      difficulty: "Intermediate",
      views: "1.8k",
    },
    {
      title: "Compliance Dashboard Overview",
      duration: "8 min",
      type: "Video",
      difficulty: "Beginner",
      views: "3.2k",
    },
    {
      title: "Advanced Workflow Automation",
      duration: "15 min",
      type: "Video",
      difficulty: "Advanced",
      views: "956",
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Help Center</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find answers, tutorials, and get support for all your questions
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white gap-2">
          <MessageSquare className="w-4 h-4" />
          Contact Support
        </Button>
      </div>

      {/* Guest Mode Banner */}
      {user?.isGuest && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">Limited Support Access</p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-300">
                    Upgrade to get priority support, WhatsApp assistance, and video calls
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

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search for help articles, tutorials, or FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Help Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickHelp.map((category, index) => {
              const IconComponent = category.icon
              return (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-4`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{category.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{category.description}</p>
                    <Badge variant="outline">{category.articles} articles</Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Popular Articles */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Articles</CardTitle>
              <CardDescription>Most viewed help articles this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  "How to upload and analyze your first document",
                  "Setting up compliance tracking for your startup",
                  "Understanding AI risk assessment scores",
                  "Creating automated workflows for legal processes",
                  "Managing team access and permissions",
                ].map((article, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{article}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tutorials Tab */}
        <TabsContent value="tutorials" className="space-y-6">
          <div className="grid gap-4">
            {tutorials.map((tutorial, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Video className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{tutorial.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {tutorial.duration}
                          </span>
                          <span>{tutorial.views} views</span>
                          <Badge className={getDifficultyColor(tutorial.difficulty)}>{tutorial.difficulty}</Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline">
                      Watch Now
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* FAQs Tab */}
        <TabsContent value="faqs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:no-underline">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-600 dark:text-gray-400 pb-4">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="support" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {supportOptions.map((option, index) => {
              const IconComponent = option.icon
              return (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{option.title}</h3>
                          {option.premium && user?.isGuest && <Crown className="w-4 h-4 text-yellow-500" />}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">{option.description}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">{option.availability}</p>
                        <Button
                          className="w-full"
                          variant={option.premium && user?.isGuest ? "outline" : "default"}
                          disabled={option.premium && user?.isGuest}
                        >
                          {option.premium && user?.isGuest ? "Upgrade Required" : option.action}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Other Ways to Reach Us</CardTitle>
              <CardDescription>Alternative contact methods and office hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Business Hours</h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM IST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 4:00 PM IST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Emergency Support</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    For critical compliance deadlines and urgent legal matters
                  </p>
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">Pro Users Only</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
