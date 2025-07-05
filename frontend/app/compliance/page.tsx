"use client";

import type React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComplianceCalendar from "@/components/compliance-calendar";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Download,
  Eye,
  Calendar,
  TrendingUp,
  AlertCircle,
  Users,
  Building,
  Globe,
  Scale,
  BookOpen,
  Target,
  Zap,
} from "lucide-react";

interface ComplianceItem {
  id: string;
  title: string;
  description: string;
  status: "compliant" | "non-compliant" | "pending" | "warning";
  dueDate: string;
  category: string;
  priority: "high" | "medium" | "low";
  progress: number;
}

const complianceData: ComplianceItem[] = [
  {
    id: "1",
    title: "GDPR Data Protection",
    description:
      "General Data Protection Regulation compliance for EU customers",
    status: "compliant",
    dueDate: "2024-05-25",
    category: "Data Protection",
    priority: "high",
    progress: 100,
  },
  {
    id: "2",
    title: "SOX Financial Reporting",
    description: "Sarbanes-Oxley Act compliance for financial reporting",
    status: "pending",
    dueDate: "2024-03-31",
    category: "Financial",
    priority: "high",
    progress: 75,
  },
  {
    id: "3",
    title: "CCPA Consumer Privacy",
    description: "California Consumer Privacy Act compliance",
    status: "warning",
    dueDate: "2024-01-30",
    category: "Privacy",
    priority: "medium",
    progress: 60,
  },
  {
    id: "4",
    title: "HIPAA Healthcare Data",
    description: "Health Insurance Portability and Accountability Act",
    status: "non-compliant",
    dueDate: "2024-02-15",
    category: "Healthcare",
    priority: "high",
    progress: 30,
  },
  {
    id: "5",
    title: "PCI DSS Payment Processing",
    description: "Payment Card Industry Data Security Standard",
    status: "compliant",
    dueDate: "2024-12-31",
    category: "Payment",
    priority: "medium",
    progress: 95,
  },
];

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "non-compliant":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-amber-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      default:
        return <Clock className="w-5 h-5 text-legal-secondary" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "compliant":
        return (
          <Badge className="legal-badge legal-badge-success">Compliant</Badge>
        );
      case "non-compliant":
        return (
          <Badge className="legal-badge legal-badge-error">Non-Compliant</Badge>
        );
      case "pending":
        return (
          <Badge className="legal-badge legal-badge-warning">Pending</Badge>
        );
      case "warning":
        return (
          <Badge className="legal-badge legal-badge-warning">Warning</Badge>
        );
      default:
        return <Badge className="legal-badge">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="destructive" className="text-xs">
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="secondary" className="text-xs">
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge variant="outline" className="text-xs">
            Low
          </Badge>
        );
      default:
        return <Badge className="text-xs">Unknown</Badge>;
    }
  };

  const filteredData =
    selectedCategory === "all"
      ? complianceData
      : complianceData.filter(
          (item) =>
            item.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  const complianceStats = {
    total: complianceData.length,
    compliant: complianceData.filter((item) => item.status === "compliant")
      .length,
    nonCompliant: complianceData.filter(
      (item) => item.status === "non-compliant"
    ).length,
    pending: complianceData.filter((item) => item.status === "pending").length,
    warning: complianceData.filter((item) => item.status === "warning").length,
  };

  const overallComplianceRate =
    (complianceStats.compliant / complianceStats.total) * 100;

  return (
    <div className="min-h-screen legal-bg-primary p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 legal-icon-bg rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl text-legal-dark-text">
                Compliance Dashboard
              </h1>
              <p className=" legal-body">
                Monitor and manage your regulatory compliance status
              </p>
            </div>
          </div>
        </div>

        {/* Compliance Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="legal-card-hover border-legal-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-legal-secondary legal-body text-sm">
                    Overall Compliance
                  </p>
                  <p className="text-2xl font-bold text-legal-dark-text ">
                    {Math.round(overallComplianceRate)}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <Progress value={overallComplianceRate} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="legal-card-hover border-legal-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-legal-secondary legal-body text-sm">
                    Compliant
                  </p>
                  <p className="text-2xl font-bold text-green-600 ">
                    {complianceStats.compliant}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="legal-card-hover border-legal-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-legal-secondary legal-body text-sm">
                    Pending
                  </p>
                  <p className="text-2xl font-bold text-amber-600 ">
                    {complianceStats.pending}
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="legal-card-hover border-legal-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-legal-secondary legal-body text-sm">
                    Issues
                  </p>
                  <p className="text-2xl font-bold text-red-600 ">
                    {complianceStats.nonCompliant + complianceStats.warning}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5 legal-card p-2 h-auto">
            <TabsTrigger
              value="overview"
              className="flex items-center space-x-2 py-3 data-[state=active]:bg-legal-bg-secondary data-[state=active]:text-legal-dark-text rounded-xl transition-all duration-200"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline legal-body">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="flex items-center space-x-2 py-3 data-[state=active]:bg-legal-bg-secondary data-[state=active]:text-legal-dark-text rounded-xl transition-all duration-200"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline legal-body">Calendar</span>
            </TabsTrigger>
            <TabsTrigger
              value="requirements"
              className="flex items-center space-x-2 py-3 data-[state=active]:bg-legal-bg-secondary data-[state=active]:text-legal-dark-text rounded-xl transition-all duration-200"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline legal-body">Requirements</span>
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="flex items-center space-x-2 py-3 data-[state=active]:bg-legal-bg-secondary data-[state=active]:text-legal-dark-text rounded-xl transition-all duration-200"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline legal-body">Reports</span>
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="flex items-center space-x-2 py-3 data-[state=active]:bg-legal-bg-secondary data-[state=active]:text-legal-dark-text rounded-xl transition-all duration-200"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline legal-body">Resources</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <Card className="legal-card-hover border-legal-border">
              <CardHeader>
                <CardTitle className="text-legal-dark-text">
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-legal-secondary legal-body">
                  Common compliance tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="btn-legal-primary h-auto p-4 flex-col space-y-2">
                    <Zap className="w-6 h-6" />
                    <span className="legal-body">Run Compliance Scan</span>
                  </Button>
                  <Button className="btn-legal-primary h-auto p-4 flex-col space-y-2 rounded-none">
                    <Download className="w-6 h-6" />
                    <span className="legal-body">Generate Report</span>
                  </Button>
                  <Button className="btn-legal-primary h-auto p-4 flex-col space-y-2 rounded-none">
                    <Target className="w-6 h-6" />
                    <span className="legal-body">Set Compliance Goals</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Calendar */}
            <Card className="legal-card-hover border-legal-border">
              <CardHeader>
                <CardTitle className="text-legal-dark-text">
                  Compliance Calendar
                </CardTitle>
                <CardDescription className="text-legal-secondary legal-body">
                  Track deadlines and important compliance events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComplianceCalendar compact={true} />
              </CardContent>
            </Card>

            {/* Recent Compliance Activities */}
            <Card className="legal-card-hover border-legal-border">
              <CardHeader>
                <CardTitle className="text-legal-dark-text">
                  Recent Activities
                </CardTitle>
                <CardDescription className="text-legal-secondary legal-body">
                  Latest compliance updates and changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "GDPR compliance verified",
                      description: "Annual audit completed successfully",
                      time: "2 hours ago",
                      status: "success",
                    },
                    {
                      title: "SOX documentation updated",
                      description: "Financial controls documentation refreshed",
                      time: "1 day ago",
                      status: "info",
                    },
                    {
                      title: "HIPAA compliance warning",
                      description: "Data access logs require review",
                      time: "3 days ago",
                      status: "warning",
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-legal-bg-secondary/50 rounded-xl"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          activity.status === "success"
                            ? "bg-green-500"
                            : activity.status === "warning"
                            ? "bg-amber-500"
                            : "bg-blue-500"
                        }`}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-legal-dark-text legal-body">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-legal-secondary legal-body">
                          {activity.description}
                        </p>
                        <p className="text-xs text-legal-secondary legal-body mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <ComplianceCalendar />
          </TabsContent>

          {/* Requirements Tab */}
          <TabsContent value="requirements" className="space-y-6">
            {/* Filter Options */}
            <Card className="legal-card border-legal-border">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-legal-dark-text legal-body">
                    Filter by category:
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="legal-input w-auto"
                  >
                    <option value="all">All Categories</option>
                    <option value="data protection">Data Protection</option>
                    <option value="financial">Financial</option>
                    <option value="privacy">Privacy</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="payment">Payment</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Requirements List */}
            <div className="space-y-4">
              {filteredData.map((item) => (
                <Card
                  key={item.id}
                  className="legal-card-hover border-legal-border"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="mt-1">{getStatusIcon(item.status)}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-legal-dark-text legal-heading">
                              {item.title}
                            </h3>
                            {getStatusBadge(item.status)}
                            {getPriorityBadge(item.priority)}
                          </div>
                          <p className="text-legal-secondary legal-body mb-3">
                            {item.description}
                          </p>

                          <div className="flex items-center space-x-6 text-sm text-legal-secondary">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span className="legal-body">
                                Due:{" "}
                                {new Date(item.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Building className="w-4 h-4" />
                              <span className="legal-body">
                                {item.category}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-legal-secondary legal-body">
                                Progress
                              </span>
                              <span className="font-medium text-legal-dark-text legal-body">
                                {item.progress}%
                              </span>
                            </div>
                            <Progress value={item.progress} className="h-2" />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-legal-accent hover:text-legal-brown"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-legal-accent hover:text-legal-brown"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Compliance Score Chart */}
              <Card className="legal-card-hover border-legal-border">
                <CardHeader>
                  <CardTitle className="legal-heading">
                    Compliance Score Trend
                  </CardTitle>
                  <CardDescription className="text-legal-secondary legal-body">
                    Monthly compliance score over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-legal-bg-secondary/30 rounded-xl">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-legal-accent mx-auto mb-2" />
                      <p className="text-legal-secondary legal-body">
                        Chart visualization would go here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Compliance by Category */}
              <Card className="legal-card-hover border-legal-border">
                <CardHeader>
                  <CardTitle className="legal-heading">
                    Compliance by Category
                  </CardTitle>
                  <CardDescription className="text-legal-secondary legal-body">
                    Breakdown by compliance area
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      "Data Protection",
                      "Financial",
                      "Privacy",
                      "Healthcare",
                      "Payment",
                    ].map((category, index) => {
                      const percentage = Math.floor(Math.random() * 40 + 60); // Random for demo
                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-legal-dark-text legal-body">
                              {category}
                            </span>
                            <span className="text-legal-secondary legal-body">
                              {percentage}%
                            </span>
                          </div>
                          <Progress value={percentage} />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Report Generation */}
            <Card className="legal-card-hover border-legal-border">
              <CardHeader>
                <CardTitle className="legal-heading">
                  Generate Reports
                </CardTitle>
                <CardDescription className="text-legal-secondary legal-body">
                  Create custom compliance reports for stakeholders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-legal-border rounded-xl hover:bg-legal-bg-secondary/50 transition-colors cursor-pointer">
                    <FileText className="w-8 h-8 text-legal-accent mb-3" />
                    <h4 className="font-medium text-legal-dark-text legal-body mb-2">
                      Executive Summary
                    </h4>
                    <p className="text-sm text-legal-secondary legal-body">
                      High-level compliance overview
                    </p>
                  </div>
                  <div className="p-4 border border-legal-border rounded-xl hover:bg-legal-bg-secondary/50 transition-colors cursor-pointer">
                    <Scale className="w-8 h-8 text-legal-accent mb-3" />
                    <h4 className="font-medium text-legal-dark-text legal-body mb-2">
                      Detailed Audit
                    </h4>
                    <p className="text-sm text-legal-secondary legal-body">
                      Comprehensive compliance audit
                    </p>
                  </div>
                  <div className="p-4 border border-legal-border rounded-xl hover:bg-legal-bg-secondary/50 transition-colors cursor-pointer">
                    <Users className="w-8 h-8 text-legal-accent mb-3" />
                    <h4 className="font-medium text-legal-dark-text legal-body mb-2">
                      Stakeholder Report
                    </h4>
                    <p className="text-sm text-legal-secondary legal-body">
                      Report for external stakeholders
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Compliance Guides */}
              <Card className="legal-card-hover border-legal-border">
                <CardHeader>
                  <CardTitle className="legal-heading">
                    Compliance Guides
                  </CardTitle>
                  <CardDescription className="text-legal-secondary legal-body">
                    Step-by-step guidance for regulations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "GDPR Implementation Guide",
                      "SOX Compliance Checklist",
                      "HIPAA Security Rules",
                      "PCI DSS Requirements",
                      "CCPA Privacy Guidelines",
                    ].map((guide, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-legal-border rounded-xl hover:bg-legal-bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <BookOpen className="w-5 h-5 text-legal-accent" />
                          <span className="text-legal-dark-text legal-body">
                            {guide}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-legal-accent hover:text-legal-brown"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Training Materials */}
              <Card className="legal-card-hover border-legal-border">
                <CardHeader>
                  <CardTitle className="legal-heading">
                    Training Materials
                  </CardTitle>
                  <CardDescription className="text-legal-secondary legal-body">
                    Educational resources and courses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Data Protection Training",
                      "Financial Compliance Course",
                      "Privacy Best Practices",
                      "Security Awareness Training",
                      "Regulatory Updates Webinar",
                    ].map((training, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-legal-border rounded-xl hover:bg-legal-bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Users className="w-5 h-5 text-legal-accent" />
                          <span className="text-legal-dark-text legal-body">
                            {training}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-legal-accent hover:text-legal-brown"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Support */}
            <Card className="legal-card-hover border-legal-border">
              <CardHeader>
                <CardTitle className="legal-heading">Need Help?</CardTitle>
                <CardDescription className="text-legal-secondary legal-body">
                  Get expert assistance with your compliance questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-legal-dark-text legal-body mb-2">
                      Contact our compliance experts for personalized guidance
                    </p>
                    <p className="text-sm text-legal-secondary legal-body">
                      Available 24/7 for urgent compliance matters
                    </p>
                  </div>
                  <Button className="btn-legal-primary">Contact Support</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
