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
  Scale,
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
      <div className="min-h-screen flex items-center justify-center legal-bg-primary">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-legal-brown"></div>
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
      color: "text-legal-brown",
      bgColor: "bg-legal-beige",
    },
    {
      title: "Upcoming Deadlines",
      value: user.isGuest ? "2" : "8",
      change: "Next: GST Return",
      icon: Calendar,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Compliance Score",
      value: user.isGuest ? "85%" : "92%",
      change: "+5% this month",
      icon: Shield,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Time Saved",
      value: user.isGuest ? "2.5 hrs" : "15.2 hrs",
      change: "This month",
      icon: Clock,
      color: "text-legal-gold",
      bgColor: "bg-legal-gold/10",
    },
  ]

  const recentDocuments = [
    {
      name: "Annual Compliance Report 2024",
      type: "Compliance",
      status: "Completed",
      date: "2 hours ago",
      statusColor: "legal-badge-success",
    },
    {
      name: "GST Return Filing - March",
      type: "Tax",
      status: "In Progress",
      date: "1 day ago",
      statusColor: "legal-badge-warning",
    },
    {
      name: "Employment Contract - John Doe",
      type: "Legal",
      status: "Under Review",
      date: "3 days ago",
      statusColor: "legal-badge",
    },
  ]

  const upcomingDeadlines = [
    {
      title: "GST Return Filing",
      date: "March 20, 2024",
      priority: "High",
      progress: 75,
      priorityColor: "legal-badge-error",
    },
    {
      title: "Annual Return (MCA)",
      date: "March 30, 2024",
      priority: "Medium",
      progress: 30,
      priorityColor: "legal-badge-warning",
    },
    {
      title: "Income Tax Return",
      date: "July 31, 2024",
      priority: "Low",
      progress: 10,
      priorityColor: "legal-badge",
    },
  ]

  const notifications = [
    {
      type: "warning",
      message: "GST Return deadline approaching in 5 days",
      time: "2 hours ago",
      icon: AlertTriangle,
      iconColor: "text-warning",
    },
    {
      type: "success",
      message: "Document analysis completed successfully",
      time: "1 day ago",
      icon: CheckCircle,
      iconColor: "text-success",
    },
    {
      type: "info",
      message: "New compliance regulation updates available",
      time: "2 days ago",
      icon: TrendingUp,
      iconColor: "text-legal-brown",
    },
  ]

  return (
    <div className="space-y-8 legal-bg-primary min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <div>
            <h1 className="text-4xl text-[#2A2A2A] mb-2">
              {user.isGuest
                ? "Welcome, Guest!"
                : `Welcome back, ${user.firstName}!`}
            </h1>
            <p className="text-legal-secondary legal-body text-lg">
              {user.isGuest
                ? "Explore LegalEase features with your guest account"
                : "Here's what's happening with your legal compliance today"}
            </p>
          </div>
        </div>

        {user.isGuest && (
          <Button
            onClick={() => router.push("/signup?upgrade=true")}
            className="btn-legal-primary flex items-center gap-2"
          >
            <Crown className="w-4 h-4" />
            Upgrade Account
          </Button>
        )}
      </div>

      {/* Guest Mode Banner */}
      {user.isGuest && (
        <Card className="legal-card border-warning/30 bg-warning/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-warning" />
                <div>
                  <p className="font-playfair font-semibold text-legal-dark-text">
                    You're in Guest Mode
                  </p>
                  <p className="text-legal-secondary legal-body">
                    Create a full account to access all features and save your
                    progress
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push("/signup?upgrade=true")}
                className="btn-legal-outline flex items-center gap-2"
              >
                Upgrade Now
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="legal-card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-legal-secondary legal-body">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-playfair font-semibold text-legal-dark-text mt-2">
                      {stat.value}
                    </p>
                    <p className="text-xs text-legal-secondary mt-1">
                      {stat.change}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 ${stat.bgColor} rounded-2xl flex items-center justify-center`}
                  >
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Documents */}
        <Card className="legal-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="legal-heading text-xl">
                Recent Documents
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/documents")}
                className="btn-legal-outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Upload New
              </Button>
            </div>
            <CardDescription className="legal-body text-legal-secondary">
              Your latest document activity and AI analysis results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentDocuments.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-2xl bg-legal-cream border border-legal-border"
              >
                <div className="flex-1">
                  <p className="font-medium text-legal-dark-text font-playfair">
                    {doc.name}
                  </p>
                  <p className="text-sm text-legal-secondary legal-body">
                    {doc.type} • {doc.date}
                  </p>
                </div>
                <Badge className={doc.statusColor}>{doc.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="legal-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="legal-heading text-xl">
                Upcoming Deadlines
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/compliance")}
                className="btn-legal-outline"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <CardDescription className="legal-body text-legal-secondary">
              Stay on top of your compliance requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-legal-dark-text font-playfair">
                      {deadline.title}
                    </p>
                    <p className="text-sm text-legal-secondary legal-body">
                      {deadline.date}
                    </p>
                  </div>
                  <Badge className={deadline.priorityColor}>
                    {deadline.priority}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Progress value={deadline.progress} className="h-2" />
                  <p className="text-xs text-legal-secondary">
                    {deadline.progress}% complete
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <Card className="legal-card">
        <CardHeader>
          <CardTitle className="legal-heading text-xl">
            Recent Notifications
          </CardTitle>
          <CardDescription className="legal-body text-legal-secondary">
            Important updates and alerts for your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.map((notification, index) => {
            const Icon = notification.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-2xl bg-legal-cream border border-legal-border"
              >
                <Icon className={`w-5 h-5 ${notification.iconColor} mt-0.5`} />
                <div className="flex-1">
                  <p className="text-sm text-legal-dark-text legal-body">
                    {notification.message}
                  </p>
                  <p className="text-xs text-legal-secondary mt-1">
                    {notification.time}
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="legal-card">
        <CardHeader>
          <CardTitle className="legal-heading text-xl">Quick Actions</CardTitle>
          <CardDescription className="legal-body text-legal-secondary">
            Common tasks to help you get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 btn-legal-secondary"
              onClick={() => router.push("/documents")}
            >
              <FileText className="w-8 h-8 text-legal-brown" />
              <span className="font-medium legal-body">Upload Document</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 btn-legal-secondary"
              onClick={() => router.push("/workflows")}
            >
              <TrendingUp className="w-8 h-8 text-success" />
              <span className="font-medium legal-body">Run Workflow</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 btn-legal-secondary"
              onClick={() => router.push("/assistant")}
            >
              <Scale className="w-8 h-8 text-legal-gold" />
              <span className="font-medium legal-body">Ask AI Assistant</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 btn-legal-secondary"
              onClick={() => router.push("/compliance")}
            >
              <Calendar className="w-8 h-8 text-warning" />
              <span className="font-medium legal-body">Check Deadlines</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

