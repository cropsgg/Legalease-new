"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Building2,
  Bell,
  Shield,
  CreditCard,
  Eye,
  EyeOff,
  Check,
  X,
  FileText,
  Globe,
  Smartphone,
  Mail,
  Users,
  Settings,
  Save,
  Trash2,
  Download,
  Plus,
  Edit,
  Banknote,
  CheckCircle,
  Clock,
  Phone,
  MapPin,
  ExternalLink,
  Key,
  Link,
  Bot,
  Activity,
  Zap,
  Upload
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-api"

interface SettingsData {
  businessProfile: {
    name: string;
    description: string;
    logo: string;
    letterhead: string;
    contact: {
      email: string;
      phone: string;
      address: string;
      website: string;
    };
    bank: {
      accountNumber: string;
      ifscCode: string;
      bankName: string;
    };
  };
  documentSettings: {
    ocrEnabled: boolean;
    blockchainHashing: boolean;
    storageLocation: "local" | "cloud" | "hybrid";
    retentionPeriod: number;
    autoBackup: boolean;
    backupFrequency: "daily" | "weekly" | "monthly";
  };
  agentConfig: {
    memoryLimit: number;
    feedbackEnabled: boolean;
    automationRules: boolean;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  security: {
    passwordMinLength: number;
    require2FA: boolean;
    encryptionEnabled: boolean;
    sessionTimeout: number;
    privacyControls: {
      dataSharing: boolean;
      analytics: boolean;
      marketing: boolean;
    };
  };
  integrations: {
    googleWorkspace: boolean;
    microsoft365: boolean;
    slack: boolean;
    zapier: boolean;
    apiEnabled: boolean;
  };
}

const mockSettingsData: SettingsData = {
  businessProfile: {
    name: "LegalEase Solutions Pvt Ltd",
    description: "AI-powered legal document automation and compliance management platform",
    logo: "/logo.png",
    letterhead: "LegalEase Solutions Pvt Ltd\n123 Legal Street, Mumbai, Maharashtra 400001",
    contact: {
      email: "contact@legalease.com",
      phone: "+91-98765-43210",
      address: "123 Legal Street, Mumbai, Maharashtra 400001",
      website: "https://legalease.com"
    },
    bank: {
      accountNumber: "1234567890",
      ifscCode: "LEGL0001234",
      bankName: "Legal Bank of India"
    }
  },
  documentSettings: {
    ocrEnabled: true,
    blockchainHashing: true,
    storageLocation: "cloud",
    retentionPeriod: 7,
    autoBackup: true,
    backupFrequency: "daily"
  },
  agentConfig: {
    memoryLimit: 512,
    feedbackEnabled: true,
    automationRules: true,
    notifications: {
      email: true,
      push: true,
      sms: false
    }
  },
  security: {
    passwordMinLength: 8,
    require2FA: true,
    encryptionEnabled: true,
    sessionTimeout: 30,
    privacyControls: {
      dataSharing: false,
      analytics: true,
      marketing: false
    }
  },
  integrations: {
    googleWorkspace: true,
    microsoft365: false,
    slack: true,
    zapier: false,
    apiEnabled: true
  }
};

export default function SettingsPage() {
  const { user, isLoading } = useAuth()
  const { showToast } = useToast()

  const [activeTab, setActiveTab] = useState("business-profile")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [data, setData] = useState<SettingsData>(mockSettingsData)
  const [showBankDetails, setShowBankDetails] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Form states
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    company: user?.companyName || "",
    companySize: "",
    phone: "",
    bio: "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    weeklyReports: true,
    documentUpdates: true,
    complianceAlerts: true,
  })

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "private",
      dataSharing: false,
    analyticsOptOut: false,
    twoFactorAuth: false,
  })

  const handleProfileUpdate = async () => {
    try {
      // Mock update profile functionality
      showToast("Profile updated successfully!", "success")
    } catch (error) {
      showToast("Failed to update profile", "error")
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("Passwords don't match", "error")
      return
    }

    try {
      // Password change logic here
      showToast("Password changed successfully!", "success")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error) {
      showToast("Failed to change password", "error")
    }
  }

  const handleDeleteAccount = () => {
    // Show confirmation dialog
    showToast("This feature is not implemented yet", "info")
  }

  const handleExportData = () => {
    showToast("Data export will be sent to your email", "info")
  }

  const updateData = <K extends keyof SettingsData>(section: K, field: keyof SettingsData[K], value: any) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateNestedData = (section: keyof SettingsData, parent: string, field: string, value: any) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parent]: {
          ...(prev[section] as any)[parent],
          [field]: value
        }
      }
    }));
  };

  const settingsTabs = [
    { key: "business-profile", label: "Business Profile", icon: Building2 },
    { key: "document-settings", label: "Document Settings", icon: FileText },
    { key: "agent-configuration", label: "Agent Configuration", icon: Bot },
    { key: "billing-subscription", label: "Billing & Subscription", icon: CreditCard },
    { key: "security-privacy", label: "Security & Privacy", icon: Shield },
    { key: "integration-settings", label: "Integration Settings", icon: Settings }
  ];



  return (
    <div className="min-h-screen legal-bg-primary p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 legal-icon-bg rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl text-legal-dark-text">Settings & Configuration</h1>
              <p className="text-legal-secondary legal-body">Manage your account settings and preferences</p>
            </div>
          </div>
        </div>

        {/* Settings Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <Card className="legal-card-hover border-legal-border">
              <CardHeader>
                <CardTitle className="text-legal-dark-text">Settings</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {settingsTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                          activeTab === tab.key
                            ? "bg-legal-accent text-white"
                            : "text-legal-secondary hover:bg-legal-bg-secondary hover:text-legal-dark-text"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="legal-body font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Business Profile Tab */}
            {activeTab === "business-profile" && (
              <Card className="legal-card-hover border-legal-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-legal-dark-text flex items-center space-x-2">
                        <Building2 className="w-5 h-5 text-legal-accent" />
                        <span>Business Profile</span>
                      </CardTitle>
                      <p className="text-legal-secondary legal-body">Manage your business information and branding</p>
                    </div>
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      className="btn-legal-primary"
                    >
                      {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                      {isEditing ? "Save Changes" : "Edit Profile"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Logo Upload */}
                  <div className="space-y-4">
                    <Label className="legal-text font-semibold">Company Logo</Label>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-legal-bg-secondary rounded-lg flex items-center justify-center border-2 border-dashed border-legal-border">
                        {data.businessProfile.logo ? (
                          <img src={data.businessProfile.logo} alt="Logo" className="w-16 h-16 object-contain" />
                        ) : (
                          <Upload className="w-8 h-8 text-legal-secondary" />
                        )}
                      </div>
                      <div>
                        <Button variant="outline" className="border-legal-border text-legal-accent hover:bg-legal-bg-secondary">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Logo
                        </Button>
                        <p className="text-sm text-legal-secondary mt-1">Recommended: 200x200px, PNG or JPG</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="businessName" className="legal-text font-semibold">Business Name *</Label>
                      <Input
                        id="businessName"
                        value={data.businessProfile.name}
                        onChange={(e) => updateData("businessProfile", "name", e.target.value)}
                        disabled={!isEditing}
                        className="border-legal-border focus:border-legal-accent"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website" className="legal-text font-semibold">Website</Label>
                      <Input
                        id="website"
                        value={data.businessProfile.contact.website}
                        onChange={(e) => updateNestedData("businessProfile", "contact", "website", e.target.value)}
                        disabled={!isEditing}
                        className="border-legal-border focus:border-legal-accent"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="legal-text font-semibold">Business Description</Label>
                    <Textarea
                      id="description"
                      value={data.businessProfile.description}
                      onChange={(e) => updateData("businessProfile", "description", e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      className="border-legal-border focus:border-legal-accent"
                    />
                  </div>

                  <Separator />

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="legal-subheading flex items-center space-x-2">
                      <Mail className="w-5 h-5 text-legal-accent" />
                      <span>Contact Information</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="legal-text font-semibold">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={data.businessProfile.contact.email}
                          onChange={(e) => updateNestedData("businessProfile", "contact", "email", e.target.value)}
                          disabled={!isEditing}
                          className="border-legal-border focus:border-legal-accent"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="legal-text font-semibold">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={data.businessProfile.contact.phone}
                          onChange={(e) => updateNestedData("businessProfile", "contact", "phone", e.target.value)}
                          disabled={!isEditing}
                          className="border-legal-border focus:border-legal-accent"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="legal-text font-semibold">Address</Label>
                      <Textarea
                        id="address"
                        value={data.businessProfile.contact.address}
                        onChange={(e) => updateNestedData("businessProfile", "contact", "address", e.target.value)}
                        disabled={!isEditing}
                        rows={3}
                        className="border-legal-border focus:border-legal-accent"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Bank Details */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="legal-subheading flex items-center space-x-2">
                        <Banknote className="w-5 h-5 text-legal-accent" />
                        <span>Bank Details</span>
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowBankDetails(!showBankDetails)}
                        className="border-legal-border text-legal-accent hover:bg-legal-bg-secondary"
                      >
                        {showBankDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showBankDetails ? "Hide" : "Show"} Details
                      </Button>
                    </div>
                    {showBankDetails && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-legal-bg-secondary rounded-lg">
                        <div className="space-y-2">
                          <Label htmlFor="accountNumber" className="legal-text font-semibold">Account Number</Label>
                          <Input
                            id="accountNumber"
                            value={data.businessProfile.bank.accountNumber}
                            onChange={(e) => updateNestedData("businessProfile", "bank", "accountNumber", e.target.value)}
                            disabled={!isEditing}
                            className="border-legal-border focus:border-legal-accent"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ifscCode" className="legal-text font-semibold">IFSC Code</Label>
                          <Input
                            id="ifscCode"
                            value={data.businessProfile.bank.ifscCode}
                            onChange={(e) => updateNestedData("businessProfile", "bank", "ifscCode", e.target.value)}
                            disabled={!isEditing}
                            className="border-legal-border focus:border-legal-accent"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bankName" className="legal-text font-semibold">Bank Name</Label>
                          <Input
                            id="bankName"
                            value={data.businessProfile.bank.bankName}
                            onChange={(e) => updateNestedData("businessProfile", "bank", "bankName", e.target.value)}
                            disabled={!isEditing}
                            className="border-legal-border focus:border-legal-accent"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}



            {/* Document Settings Tab */}
            {activeTab === "document-settings" && (
              <Card className="legal-card-hover border-legal-border">
                <CardHeader>
                  <CardTitle className="text-legal-dark-text flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-legal-accent" />
                    <span>Document Settings</span>
                  </CardTitle>
                  <p className="text-legal-secondary legal-body">Configure document processing and storage preferences</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="legal-text font-semibold">OCR Processing</Label>
                          <p className="text-sm text-legal-secondary">Enable automatic text extraction from documents</p>
                        </div>
                        <Switch
                          checked={data.documentSettings.ocrEnabled}
                          onCheckedChange={(checked) => updateData("documentSettings", "ocrEnabled", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="legal-text font-semibold">Blockchain Hashing</Label>
                          <p className="text-sm text-legal-secondary">Store document hashes on blockchain for verification</p>
                        </div>
                        <Switch
                          checked={data.documentSettings.blockchainHashing}
                          onCheckedChange={(checked) => updateData("documentSettings", "blockchainHashing", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="legal-text font-semibold">Auto Backup</Label>
                          <p className="text-sm text-legal-secondary">Automatically backup documents</p>
                        </div>
                        <Switch
                          checked={data.documentSettings.autoBackup}
                          onCheckedChange={(checked) => updateData("documentSettings", "autoBackup", checked)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="legal-text font-semibold">Storage Location</Label>
                        <Select
                          value={data.documentSettings.storageLocation}
                          onValueChange={(value) => updateData("documentSettings", "storageLocation", value)}
                        >
                          <SelectTrigger className="border-legal-border focus:border-legal-accent">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="local">Local Storage</SelectItem>
                            <SelectItem value="cloud">Cloud Storage</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="legal-text font-semibold">Retention Period (years)</Label>
                        <Input
                          type="number"
                          value={data.documentSettings.retentionPeriod}
                          onChange={(e) => updateData("documentSettings", "retentionPeriod", parseInt(e.target.value))}
                          className="border-legal-border focus:border-legal-accent"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="legal-text font-semibold">Backup Frequency</Label>
                        <Select
                          value={data.documentSettings.backupFrequency}
                          onValueChange={(value) => updateData("documentSettings", "backupFrequency", value)}
                        >
                          <SelectTrigger className="border-legal-border focus:border-legal-accent">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Agent Configuration Tab */}
            {activeTab === "agent-configuration" && (
              <Card className="legal-card-hover border-legal-border">
                <CardHeader>
                  <CardTitle className="text-legal-dark-text flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-legal-accent" />
                    <span>Agent Configuration</span>
                  </CardTitle>
                  <p className="text-legal-secondary legal-body">Configure AI agent behavior and preferences</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="legal-text font-semibold">Memory Limit (MB)</Label>
                        <Input
                          type="number"
                          value={data.agentConfig.memoryLimit}
                          onChange={(e) => updateData("agentConfig", "memoryLimit", parseInt(e.target.value))}
                          className="border-legal-border focus:border-legal-accent"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="legal-text font-semibold">Feedback Collection</Label>
                          <p className="text-sm text-legal-secondary">Allow agents to collect user feedback</p>
                        </div>
                        <Switch
                          checked={data.agentConfig.feedbackEnabled}
                          onCheckedChange={(checked) => updateData("agentConfig", "feedbackEnabled", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="legal-text font-semibold">Automation Rules</Label>
                          <p className="text-sm text-legal-secondary">Enable automated workflow rules</p>
                        </div>
                        <Switch
                          checked={data.agentConfig.automationRules}
                          onCheckedChange={(checked) => updateData("agentConfig", "automationRules", checked)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="legal-subheading">Notification Preferences</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-legal-accent" />
                            <Label className="legal-text">Email Notifications</Label>
                          </div>
                          <Switch
                            checked={data.agentConfig.notifications.email}
                            onCheckedChange={(checked) => updateNestedData("agentConfig", "notifications", "email", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Bell className="w-4 h-4 text-legal-accent" />
                            <Label className="legal-text">Push Notifications</Label>
                          </div>
                          <Switch
                            checked={data.agentConfig.notifications.push}
                            onCheckedChange={(checked) => updateNestedData("agentConfig", "notifications", "push", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-legal-accent" />
                            <Label className="legal-text">SMS Notifications</Label>
                          </div>
                          <Switch
                            checked={data.agentConfig.notifications.sms}
                            onCheckedChange={(checked) => updateNestedData("agentConfig", "notifications", "sms", checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Billing & Subscription Tab */}
            {activeTab === "billing-subscription" && (
              <Card className="legal-card-hover border-legal-border">
                <CardHeader>
                  <CardTitle className="text-legal-dark-text flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-legal-accent" />
                    <span>Billing & Subscription</span>
                  </CardTitle>
                  <p className="text-legal-secondary legal-body">Manage your subscription and billing information</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-legal-border">
                      <CardHeader className="pb-3">
                        <CardTitle className="legal-subheading text-center">Current Plan</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <div className="text-3xl font-bold text-legal-accent mb-2">Professional</div>
                        <p className="text-legal-secondary legal-body mb-4">₹2,999/month</p>
                        <Button className="btn-legal-primary w-full">Upgrade Plan</Button>
                      </CardContent>
                    </Card>

                    <Card className="border-legal-border">
                      <CardHeader className="pb-3">
                        <CardTitle className="legal-subheading text-center">Usage</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm">
                              <span>Documents</span>
                              <span>1,247 / 5,000</span>
                            </div>
                            <Progress value={25} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm">
                              <span>Storage</span>
                              <span>2.1 GB / 10 GB</span>
                            </div>
                            <Progress value={21} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm">
                              <span>Users</span>
                              <span>3 / 10</span>
                            </div>
                            <Progress value={30} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-legal-border">
                      <CardHeader className="pb-3">
                        <CardTitle className="legal-subheading text-center">Next Billing</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <div className="text-2xl font-bold text-legal-accent mb-2">Feb 15, 2024</div>
                        <p className="text-legal-secondary legal-body mb-4">₹2,999</p>
                        <Button variant="outline" className="border-legal-border text-legal-accent hover:bg-legal-bg-secondary w-full">
                          View Invoice
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="legal-subheading">Payment Methods</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-legal-bg-secondary rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="w-6 h-6 text-legal-accent" />
                          <div>
                            <p className="legal-subheading">•••• •••• •••• 4242</p>
                            <p className="text-legal-secondary legal-body">Expires 12/25</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-green-300">Default</Badge>
                      </div>
                      <Button variant="outline" className="border-legal-border text-legal-accent hover:bg-legal-bg-secondary">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Payment Method
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security & Privacy Tab */}
            {activeTab === "security-privacy" && (
              <Card className="legal-card-hover border-legal-border">
                <CardHeader>
                  <CardTitle className="text-legal-dark-text flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-legal-accent" />
                    <span>Security & Privacy</span>
                  </CardTitle>
                  <p className="text-legal-secondary legal-body">Manage security settings and privacy preferences</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="legal-text font-semibold">Minimum Password Length</Label>
                        <Input
                          type="number"
                          value={data.security.passwordMinLength}
                          onChange={(e) => updateData("security", "passwordMinLength", parseInt(e.target.value))}
                          className="border-legal-border focus:border-legal-accent"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="legal-text font-semibold">Two-Factor Authentication</Label>
                          <p className="text-sm text-legal-secondary">Require 2FA for all users</p>
                        </div>
                        <Switch
                          checked={data.security.require2FA}
                          onCheckedChange={(checked) => updateData("security", "require2FA", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="legal-text font-semibold">Data Encryption</Label>
                          <p className="text-sm text-legal-secondary">Enable end-to-end encryption</p>
                        </div>
                        <Switch
                          checked={data.security.encryptionEnabled}
                          onCheckedChange={(checked) => updateData("security", "encryptionEnabled", checked)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="legal-text font-semibold">Session Timeout (minutes)</Label>
                        <Input
                          type="number"
                          value={data.security.sessionTimeout}
                          onChange={(e) => updateData("security", "sessionTimeout", parseInt(e.target.value))}
                          className="border-legal-border focus:border-legal-accent"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="legal-subheading">Privacy Controls</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="legal-text font-semibold">Data Sharing</Label>
                            <p className="text-sm text-legal-secondary">Allow data sharing with partners</p>
                          </div>
                          <Switch
                            checked={data.security.privacyControls.dataSharing}
                            onCheckedChange={(checked) => updateNestedData("security", "privacyControls", "dataSharing", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="legal-text font-semibold">Analytics</Label>
                            <p className="text-sm text-legal-secondary">Collect usage analytics</p>
                          </div>
                          <Switch
                            checked={data.security.privacyControls.analytics}
                            onCheckedChange={(checked) => updateNestedData("security", "privacyControls", "analytics", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="legal-text font-semibold">Marketing</Label>
                            <p className="text-sm text-legal-secondary">Receive marketing communications</p>
                          </div>
                          <Switch
                            checked={data.security.privacyControls.marketing}
                            onCheckedChange={(checked) => updateNestedData("security", "privacyControls", "marketing", checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="legal-subheading">Access Logs</h3>
                    <div className="space-y-2">
                      {[
                        { action: "Login", user: "priya@legalease.com", time: "2024-01-15 10:30:00", ip: "192.168.1.100" },
                        { action: "Document Upload", user: "amit@legalease.com", time: "2024-01-15 09:15:00", ip: "192.168.1.101" },
                        { action: "Settings Change", user: "rohit@legalease.com", time: "2024-01-14 16:45:00", ip: "192.168.1.102" }
                      ].map((log, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-legal-bg-secondary rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Activity className="w-4 h-4 text-legal-accent" />
                            <div>
                              <p className="legal-text font-medium">{log.action}</p>
                              <p className="text-sm text-legal-secondary">{log.user}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-legal-secondary">{log.time}</p>
                            <p className="text-xs text-legal-secondary">{log.ip}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Integration Settings Tab */}
            {activeTab === "integration-settings" && (
              <Card className="legal-card-hover border-legal-border">
                <CardHeader>
                  <CardTitle className="text-legal-dark-text flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-legal-accent" />
                    <span>Integration Settings</span>
                  </CardTitle>
                  <p className="text-legal-secondary legal-body">Connect with third-party services and APIs</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-legal-bg-secondary rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Globe className="w-6 h-6 text-legal-accent" />
                          <div>
                            <h4 className="legal-subheading">Google Workspace</h4>
                            <p className="text-sm text-legal-secondary">Connect Google Drive and Docs</p>
                          </div>
                        </div>
                        <Switch
                          checked={data.integrations.googleWorkspace}
                          onCheckedChange={(checked) => updateData("integrations", "googleWorkspace", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-legal-bg-secondary rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Globe className="w-6 h-6 text-legal-accent" />
                          <div>
                            <h4 className="legal-subheading">Microsoft 365</h4>
                            <p className="text-sm text-legal-secondary">Connect OneDrive and Office</p>
                          </div>
                        </div>
                        <Switch
                          checked={data.integrations.microsoft365}
                          onCheckedChange={(checked) => updateData("integrations", "microsoft365", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-legal-bg-secondary rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Bell className="w-6 h-6 text-legal-accent" />
                          <div>
                            <h4 className="legal-subheading">Slack</h4>
                            <p className="text-sm text-legal-secondary">Send notifications to Slack</p>
                          </div>
                        </div>
                        <Switch
                          checked={data.integrations.slack}
                          onCheckedChange={(checked) => updateData("integrations", "slack", checked)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-legal-bg-secondary rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Zap className="w-6 h-6 text-legal-accent" />
                          <div>
                            <h4 className="legal-subheading">Zapier</h4>
                            <p className="text-sm text-legal-secondary">Connect with 5000+ apps</p>
                          </div>
                        </div>
                        <Switch
                          checked={data.integrations.zapier}
                          onCheckedChange={(checked) => updateData("integrations", "zapier", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-legal-bg-secondary rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Link className="w-6 h-6 text-legal-accent" />
                          <div>
                            <h4 className="legal-subheading">API Access</h4>
                            <p className="text-sm text-legal-secondary">Enable REST API access</p>
                          </div>
                        </div>
                        <Switch
                          checked={data.integrations.apiEnabled}
                          onCheckedChange={(checked) => updateData("integrations", "apiEnabled", checked)}
                        />
                      </div>

                      <div className="space-y-3">
                        <Button variant="outline" className="border-legal-border text-legal-accent hover:bg-legal-bg-secondary w-full">
                          <Key className="w-4 h-4 mr-2" />
                          Generate API Key
                        </Button>
                        <Button variant="outline" className="border-legal-border text-legal-accent hover:bg-legal-bg-secondary w-full">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View API Documentation
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="legal-subheading">Connected Services</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { name: "Google Drive", status: "Connected", icon: "📁" },
                        { name: "Slack", status: "Connected", icon: "💬" },
                        { name: "Zapier", status: "Disconnected", icon: "⚡" }
                      ].map((service, index) => (
                        <div key={index} className="p-4 bg-legal-bg-secondary rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{service.icon}</span>
                            <Badge className={service.status === "Connected" ? "bg-green-100 text-green-700 border-green-300" : "bg-gray-100 text-gray-700 border-gray-300"}>
                              {service.status}
                            </Badge>
                          </div>
                          <h4 className="legal-subheading">{service.name}</h4>
                          <Button variant="outline" size="sm" className="border-legal-border text-legal-accent hover:bg-legal-bg-secondary mt-2">
                            {service.status === "Connected" ? "Disconnect" : "Connect"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
