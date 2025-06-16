"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import {
  Shield,
  CalendarIcon,
  AlertTriangle,
  CheckCircle,
  Clock,
  Bell,
  FileText,
  Crown,
  ArrowRight,
  Plus,
  Filter,
  Download,
  Settings,
} from "lucide-react"

export default function CompliancePage() {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [activeTab, setActiveTab] = useState("overview")

  const complianceStats = [
    {
      title: "Overall Score",
      value: user?.isGuest ? "85%" : "92%",
      change: "+5% this month",
      icon: Shield,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Active Deadlines",
      value: user?.isGuest ? "3" : "8",
      change: "2 due this week",
      icon: CalendarIcon,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
    {
      title: "Completed Tasks",
      value: user?.isGuest ? "12" : "24",
      change: "+3 this week",
      icon: CheckCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Risk Alerts",
      value: user?.isGuest ? "1" : "2",
      change: "Low priority",
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    },
  ]

  const upcomingDeadlines = [
    {
      title: "GST Return Filing",
      description: "Monthly GST return submission",
      dueDate: "March 20, 2024",
      priority: "High",
      progress: 75,
      category: "Tax",
      daysLeft: 5,
    },
    {
      title: "Annual Return (MCA)",
      description: "Company annual return filing with MCA",
      dueDate: "March 30, 2024",
      priority: "Medium",
      progress: 30,
      category: "Corporate",
      daysLeft: 15,
    },
    {
      title: "Income Tax Return",
      description: "Annual income tax return filing",
      dueDate: "July 31, 2024",
      priority: "Low",
      progress: 10,
      category: "Tax",
      daysLeft: 138,
    },
    {
      title: "ESI Contribution",
      description: "Employee State Insurance contribution",
      dueDate: "March 15, 2024",
      priority: "High",
      progress: 90,
      category: "Labor",
      daysLeft: 2,
    },
  ]

  const complianceAreas = [
    {
      name: "Tax Compliance",
      score: 95,
      status: "Excellent",
      lastUpdated: "2 days ago",
      items: ["GST Returns", "Income Tax", "TDS Compliance"],
    },
    {
      name: "Corporate Compliance",
      score: 88,
      status: "Good",
      lastUpdated: "1 week ago",
      items: ["Annual Returns", "Board Resolutions", "Statutory Registers"],
    },
    {
      name: "Labor Compliance",
      score: 92,
      status: "Excellent",
      lastUpdated: "3 days ago",
      items: ["PF Compliance", "ESI Compliance", "Labor Licenses"],
    },
    {
      name: "Environmental Compliance",
      score: 78,
      status: "Needs Attention",
      lastUpdated: "2 weeks ago",
      items: ["Pollution Clearance", "Waste Management", "Environmental Audit"],
    },
  ]

  const recentActivities = [
    {
      title: "GST Return Filed Successfully",
      description: "February GST return submitted on time",
      time: "2 hours ago",
      type: "success",
      icon: CheckCircle,
    },
    {
      title: "Deadline Reminder",
      description: "ESI contribution due in 2 days",
      time: "4 hours ago",
      type: "warning",
      icon: Bell,
    },
    {
      title: "Compliance Report Generated",
      description: "Monthly compliance report ready for review",
      time: "1 day ago",
      type: "info",
      icon: FileText,
    },
    {
      title: "New Regulation Alert",
      description: "Updated labor law requirements",
      time: "2 days ago",
      type: "info",
      icon: AlertTriangle,
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-yellow-600"
    return "text-red-600"
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "error":
        return "text-red-600"
      default:
        return "text-blue-600"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Compliance Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Stay on top of all your regulatory requirements and deadlines
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white gap-2">
            <Plus className="w-4 h-4" />
            Add Compliance Item
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
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">Limited Compliance Tracking</p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-300">
                    Upgrade to track unlimited compliance requirements and get advanced alerts
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
        {complianceStats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.change}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <IconComponent className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
          <TabsTrigger value="areas">Compliance Areas</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Upcoming Deadlines</CardTitle>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
                <CardDescription>Critical compliance deadlines requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingDeadlines.slice(0, 3).map((deadline, index) => (
                    <div key={index} className="space-y-2 p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{deadline.title}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{deadline.description}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getPriorityColor(deadline.priority)}>{deadline.priority}</Badge>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{deadline.daysLeft} days</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{deadline.progress}%</span>
                        </div>
                        <Progress value={deadline.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest compliance updates and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => {
                    const IconComponent = activity.icon
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.type === "success" ? "bg-green-100 dark:bg-green-900/20" : activity.type === "warning" ? "bg-yellow-100 dark:bg-yellow-900/20" : "bg-blue-100 dark:bg-blue-900/20"}`}
                        >
                          <IconComponent className={`w-4 h-4 ${getActivityIcon(activity.type)}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">{activity.title}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{activity.description}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Deadlines Tab */}
        <TabsContent value="deadlines" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Deadlines</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {upcomingDeadlines.map((deadline, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{deadline.title}</h3>
                        <Badge variant="outline">{deadline.category}</Badge>
                        <Badge className={getPriorityColor(deadline.priority)}>{deadline.priority}</Badge>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">{deadline.description}</p>
                      <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          Due: {deadline.dueDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {deadline.daysLeft} days left
                        </span>
                      </div>
                    </div>
                    <div className="text-right min-w-[120px]">
                      <div className="mb-2">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{deadline.progress}%</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Complete</p>
                      </div>
                      <Progress value={deadline.progress} className="h-2 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Compliance Areas Tab */}
        <TabsContent value="areas" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {complianceAreas.map((area, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{area.name}</CardTitle>
                    <div className="text-right">
                      <span className={`text-2xl font-bold ${getScoreColor(area.score)}`}>{area.score}</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{area.status}</p>
                    </div>
                  </div>
                  <CardDescription>Last updated: {area.lastUpdated}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Progress value={area.score} className="h-2" />
                    <div className="space-y-2">
                      {area.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-gray-600 dark:text-gray-400">{item}</span>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Calendar</CardTitle>
                  <CardDescription>View all compliance deadlines in calendar format</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Today's Tasks</CardTitle>
                  <CardDescription>Compliance items due today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white">Review GST Returns</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Final review before submission</p>
                      <Badge className="mt-2 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                        In Progress
                      </Badge>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white">Update Statutory Registers</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Monthly register updates</p>
                      <Badge className="mt-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                        Pending
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
