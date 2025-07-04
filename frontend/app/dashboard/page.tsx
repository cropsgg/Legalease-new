"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  FileText,
  Calendar as CalendarIcon,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Plus,
  Crown,
  ArrowRight,
  Scale,
  Home,
  Folder,
  Bot,
  Settings,
  Search,
  Bell,
  MessageCircle,
  Upload,
  ChevronDown,
  Users,
  Building,
  Target,
  Zap,
  FileCheck,
  AlertCircle,
  Star,
  BarChart3,
  PieChart,
  Activity,
  CalendarDays,
  Lightbulb,
  Clock3,
  Sparkles,
  DollarSign,
  Award,
  TrendingDown,
  Eye,
  Download,
  Share2,
  MoreHorizontal,
  User,
  LogOut,
  CreditCard,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center legal-bg-primary">
        <div className="animate-spin -full h-8 w-8 border-b-2 border-legal-brown"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Mock data for widgets
  const quickActions = [
    {
      title: "AI Assistant",
      description: "Ask me anything",
      icon: MessageCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      action: () => router.push("/automation"),
    },
    {
      title: "Generate Document",
      description: "Create legal docs",
      icon: FileText,
      color: "text-[#8B4513]",
      bgColor: "bg-[#F8F3EE]",
      action: () => router.push("/editor"),
    },
    {
      title: "File Returns",
      description: "Submit tax filings",
      icon: Upload,
      color: "text-green-600",
      bgColor: "bg-green-50",
      action: () => router.push("/compliance"),
    },
  ];

  const statusCards = [
    {
      title: "Compliance Score",
      value: "85%",
      change: "+5% this month",
      icon: Shield,
      color: "text-green-600",
      bgColor: "bg-green-50",
      progress: 85,
      status: "Good",
    },
    {
      title: "Pending Tasks",
      value: "12",
      change: "3 urgent",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      urgent: 3,
      normal: 9,
    },
    {
      title: "Recent Filings",
      value: "8",
      change: "This month",
      icon: FileCheck,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      recent: [
        { name: "GST Return", date: "2 days ago", status: "Completed" },
        { name: "TDS Filing", date: "1 week ago", status: "Completed" },
        { name: "PF Return", date: "2 weeks ago", status: "Completed" },
      ],
    },
    {
      title: "Document Count",
      value: "156",
      change: "2.3 GB used",
      icon: Folder,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      storage: 2.3,
      total: 5.0,
    },
  ];

  const recentActivity = [
    {
      type: "document",
      title: "Employment Contract Generated",
      description: "AI created contract for John Doe",
      time: "2 hours ago",
      icon: FileText,
      color: "text-[#8B4513]",
    },
    {
      type: "filing",
      title: "GST Return Filed",
      description: "Successfully submitted for March 2024",
      time: "1 day ago",
      icon: FileCheck,
      color: "text-green-600",
    },
    {
      type: "compliance",
      title: "Compliance Check Completed",
      description: "All requirements met for Q1 2024",
      time: "2 days ago",
      icon: Shield,
      color: "text-blue-600",
    },
    {
      type: "ai",
      title: "AI Analysis Complete",
      description: "Document analysis finished",
      time: "3 days ago",
      icon: Bot,
      color: "text-purple-600",
    },
  ];

  const upcomingDeadlines = [
    { date: "2024-03-20", title: "GST Return", priority: "high" },
    { date: "2024-03-25", title: "TDS Filing", priority: "medium" },
    { date: "2024-03-30", title: "PF Return", priority: "low" },
    { date: "2024-04-15", title: "Income Tax", priority: "medium" },
  ];

  const quickInsights = [
    {
      title: "Tax Savings Opportunity",
      description: "You can save ₹45,000 by claiming additional deductions",
      icon: DollarSign,
      color: "text-green-600",
      action: "View Details",
    },
    {
      title: "Upcoming Deadlines",
      description: "3 deadlines in next 30 days",
      icon: AlertCircle,
      color: "text-orange-600",
      action: "View Calendar",
    },
    {
      title: "AI Recommendations",
      description: "5 new recommendations available",
      icon: Sparkles,
      color: "text-purple-600",
      action: "View All",
    },
  ];

  const getUserInitials = () => {
    if (!user) return "U";
    if (user.isGuest) return "G";
    return (
      `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
      "U"
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F3EE] flex">
      {/* Sidebar Navigation */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-[#D1C4B8] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8B7355]" />
                <Input
                  placeholder="Search or type @ for commands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#F8F3EE] border-[#D1C4B8] focus:border-[#8B4513]"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Business Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-[#D1C4B8] text-[#8B7355] hover:bg-[#F8F3EE]"
                  >
                    <Building className="w-4 h-4 mr-2" />
                    My Business
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Select Business</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Building className="w-4 h-4 mr-2" />
                    My Business
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Business
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notification Bell */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5 text-[#8B7355]" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 -full rounded-full"></div>
              </Button>

              {/* User Avatar Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 -full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-[#8B4513] text-white text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.isGuest
                          ? "Guest User"
                          : `${user.firstName} ${user.lastName}`}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#2A2A2A] mb-2">
                {user.isGuest
                  ? "Welcome, Guest!"
                  : `Welcome back, ${user.firstName}!`}
              </h1>
              <p className="text-[#8B7355]">
                {user.isGuest
                  ? "Explore LegalEase features with your guest account"
                  : "Here's what's happening with your legal compliance today"}
              </p>
            </div>
            {user.isGuest && (
              <Button
                onClick={() => router.push("/signup?upgrade=true")}
                className="bg-[#8B4513] hover:bg-[#6B3410] text-white"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Account
              </Button>
            )}
          </div>

          {/* Row 1 - Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card
                  key={index}
                  className="border-[#D1C4B8] rounded-none hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={action.action}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 ${action.bgColor} -lg flex items-center justify-center`}
                      >
                        <Icon className={`w-6 h-6 ${action.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#2A2A2A]">
                          {action.title}
                        </h3>
                        <p className="text-sm text-[#8B7355]">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Row 2 - Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statusCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Card key={index} className="border-[#D1C4B8] rounded-none">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-10 h-10 ${card.bgColor} -lg flex items-center justify-center`}
                      >
                        <Icon className={`w-5 h-5 ${card.color}`} />
                      </div>
                      {card.progress && (
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#2A2A2A]">
                            {card.value}
                          </div>
                          <div className="text-xs text-[#8B7355]">
                            {card.change}
                          </div>
                        </div>
                      )}
                    </div>

                    <h3 className="font-semibold text-[#2A2A2A] mb-2">
                      {card.title}
                    </h3>

                    {card.progress && (
                      <div className="space-y-2">
                        <Progress value={card.progress} className="h-2" />
                        <p className="text-xs text-[#8B7355]">{card.status}</p>
                      </div>
                    )}

                    {card.urgent && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#8B7355]">
                            Urgent: {card.urgent}
                          </span>
                          <span className="text-[#8B7355]">
                            Normal: {card.normal}
                          </span>
                        </div>
                        <p className="text-xs text-[#8B7355]">{card.change}</p>
                      </div>
                    )}

                    {card.recent && (
                      <div className="space-y-1">
                        {card.recent.map((item, idx) => (
                          <div key={idx} className="text-xs text-[#8B7355]">
                            {item.name} - {item.date}
                          </div>
                        ))}
                      </div>
                    )}

                    {card.storage && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#8B7355]">Storage</span>
                          <span className="text-[#2A2A2A]">
                            {card.storage}GB / {card.total}GB
                          </span>
                        </div>
                        <Progress
                          value={(card.storage / card.total) * 100}
                          className="h-2"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Row 3 - Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity Feed */}
            <Card className="border-[#D1C4B8] rounded-none">
              <CardHeader>
                <CardTitle className="text-[#2A2A2A]">
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-[#8B7355]">
                  Timeline of agent actions and document activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div
                        className={`w-8 h-8 ${activity.color
                          .replace("text-", "bg-")
                          .replace(
                            "600",
                            "100"
                          )} -full flex items-center justify-center mt-1`}
                      >
                        <Icon className={`w-4 h-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#2A2A2A]">
                          {activity.title}
                        </p>
                        <p className="text-xs text-[#8B7355]">
                          {activity.description}
                        </p>
                        <p className="text-xs text-[#8B7355] mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Compliance Calendar */}
            <Card className="border-[#D1C4B8] rounded-none">
              <CardHeader>
                <CardTitle className="text-[#2A2A2A]">
                  Compliance Calendar
                </CardTitle>
                <CardDescription className="text-[#8B7355]">
                  Monthly view with color-coded deadlines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className=" w-[60%] border-[#D1C4B8]"
                />

                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium text-[#2A2A2A]">
                    Upcoming Deadlines
                  </h4>
                  {upcomingDeadlines.slice(0, 3).map((deadline, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 text-xs"
                    >
                      <div
                        className={`w-2 h-2 -full ${
                          deadline.priority === "high"
                            ? "bg-red-500"
                            : deadline.priority === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      ></div>
                      <span className="text-[#8B7355]">{deadline.date}</span>
                      <span className="text-[#2A2A2A]">{deadline.title}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Row 4 - Quick Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickInsights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <Card key={index} className="border-[#D1C4B8] rounded-none">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-10 h-10 ${insight.color
                          .replace("text-", "bg-")
                          .replace(
                            "600",
                            "100"
                          )} -lg flex items-center justify-center`}
                      >
                        <Icon className={`w-5 h-5 ${insight.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#2A2A2A] mb-1">
                          {insight.title}
                        </h3>
                        <p className="text-sm text-[#8B7355] mb-3">
                          {insight.description}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
                        >
                          {insight.action}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
