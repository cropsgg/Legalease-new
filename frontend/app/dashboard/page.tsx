"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  FileText,
  Calendar,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Plus,
  Crown,
  ArrowRight,
} from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const stats = [
    {
      title: "Active Documents",
      value: user.isGuest ? "3" : "12",
      change: "+2 this week",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Upcoming Deadlines",
      value: user.isGuest ? "2" : "8",
      change: "Next: GST Return",
      icon: Calendar,
      color: "text-orange-600",
    },
    {
      title: "Compliance Score",
      value: user.isGuest ? "85%" : "92%",
      change: "+5% this month",
      icon: Shield,
      color: "text-green-600",
    },
    {
      title: "Time Saved",
      value: user.isGuest ? "2.5 hrs" : "15.2 hrs",
      change: "This month",
      icon: Clock,
      color: "text-purple-600",
    },
  ]

  const recentDocuments = [
    {
      name: "Annual Compliance Report 2024",
      type: "Compliance",
      status: "Completed",
      date: "2 hours ago",
    },
    {
      name: "GST Return Filing - March",
      type: "Tax",
      status: "In Progress",
      date: "1 day ago",
    },
    {
      name: "Employment Contract - John Doe",
      type: "Legal",
      status: "Under Review",
      date: "3 days ago",
    },
  ]

  const upcomingDeadlines = [
    {
      title: "GST Return Filing",
      date: "March 20, 2024",
      priority: "High",
      progress: 75,
    },
    {
      title: "Annual Return (MCA)",
      date: "March 30, 2024",
      priority: "Medium",
      progress: 30,
    },
    {
      title: "Income Tax Return",
      date: "July 31, 2024",
      priority: "Low",
      progress: 10,
    },
  ]

  const notifications = [
    {
      type: "warning",
      message: "GST Return deadline approaching in 5 days",
      time: "2 hours ago",
    },
    {
      type: "success",
      message: "Document analysis completed successfully",
      time: "1 day ago",
    },
    {
      type: "info",
      message: "New compliance regulation updates available",
      time: "2 days ago",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {user.isGuest ? "Welcome, Guest!" : `Welcome back, ${user.firstName}!`}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {user.isGuest
                ? "Explore LegalEase features with your guest account"
                : "Here's what's happening with your legal compliance today"}
            </p>
          </div>
        </div>

        {user.isGuest && (
          <Button
            onClick={() => router.push("/signup?upgrade=true")}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade Account
          </Button>
        )}
      </div>

      {/* Guest Mode Banner */}
      {user.isGuest && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">You're in Guest Mode</p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-300">
                    Create a full account to access all features and save your progress
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push("/signup?upgrade=true")}
                variant="outline"
                size="sm"
                className="border-yellow-300 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-600 dark:text-yellow-300"
              >
                Upgrade Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.change}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Documents */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Documents</CardTitle>
              <Button variant="outline" size="sm" onClick={() => router.push("/documents")}>
                <Plus className="w-4 h-4 mr-2" />
                Upload New
              </Button>
            </div>
            <CardDescription>Your latest document activity and AI analysis results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDocuments.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{doc.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {doc.type} • {doc.date}
                    </p>
                  </div>
                  <Badge
                    variant={
                      doc.status === "Completed" ? "default" : doc.status === "In Progress" ? "secondary" : "outline"
                    }
                  >
                    {doc.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Deadlines</CardTitle>
              <Button variant="outline" size="sm" onClick={() => router.push("/compliance")}>
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <CardDescription>Stay on top of your compliance requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{deadline.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{deadline.date}</p>
                    </div>
                    <Badge
                      variant={
                        deadline.priority === "High"
                          ? "destructive"
                          : deadline.priority === "Medium"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {deadline.priority}
                    </Badge>
                  </div>
                  <Progress value={deadline.progress} className="h-2" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">{deadline.progress}% complete</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>Important updates and alerts for your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                {notification.type === "warning" && <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />}
                {notification.type === "success" && <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />}
                {notification.type === "info" && <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />}
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to help you get started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => router.push("/documents")}
            >
              <FileText className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-medium">Upload Document</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => router.push("/workflows")}
            >
              <TrendingUp className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium">Run Workflow</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => router.push("/assistant")}
            >
              <Shield className="w-6 h-6 text-purple-600" />
              <span className="text-sm font-medium">Ask AI Assistant</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => router.push("/compliance")}
            >
              <Calendar className="w-6 h-6 text-orange-600" />
              <span className="text-sm font-medium">Check Deadlines</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
