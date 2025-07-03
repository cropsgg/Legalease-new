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
  Download
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-api"

export default function SettingsPage() {
  const { user, isLoading } = useAuth()
  const { showToast } = useToast()
  
  const [activeTab, setActiveTab] = useState("profile")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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

  return (
    <div className="min-h-screen legal-bg-primary p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 legal-icon-bg rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl legal-heading">Settings</h1>
              <p className="text-legal-secondary legal-body">Manage your account settings and preferences</p>
            </div>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 legal-card p-2 h-auto">
            <TabsTrigger 
              value="profile" 
              className="flex items-center space-x-2 py-3 data-[state=active]:bg-legal-bg-secondary data-[state=active]:text-legal-dark-text rounded-xl transition-all duration-200"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline legal-body">Profile</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="flex items-center space-x-2 py-3 data-[state=active]:bg-legal-bg-secondary data-[state=active]:text-legal-dark-text rounded-xl transition-all duration-200"
            >
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline legal-body">Notifications</span>
            </TabsTrigger>
            <TabsTrigger 
              value="privacy" 
              className="flex items-center space-x-2 py-3 data-[state=active]:bg-legal-bg-secondary data-[state=active]:text-legal-dark-text rounded-xl transition-all duration-200"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline legal-body">Privacy</span>
            </TabsTrigger>
            <TabsTrigger 
              value="billing" 
              className="flex items-center space-x-2 py-3 data-[state=active]:bg-legal-bg-secondary data-[state=active]:text-legal-dark-text rounded-xl transition-all duration-200"
            >
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline legal-body">Billing</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="legal-card-hover border-legal-border">
              <CardHeader>
                <CardTitle className="legal-heading flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription className="text-legal-secondary legal-body">
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-legal-dark-text font-medium legal-body">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="legal-input"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-legal-dark-text font-medium legal-body">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="legal-input"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-legal-dark-text font-medium legal-body">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="legal-input"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-legal-dark-text font-medium legal-body">
                      Company Name
                    </Label>
                    <Input
                      id="company"
                      value={profileData.company}
                      onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                      className="legal-input"
                      placeholder="Your Company"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companySize" className="text-legal-dark-text font-medium legal-body">
                      Company Size
                    </Label>
                    <Select 
                      value={profileData.companySize} 
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, companySize: value }))}
                    >
                      <SelectTrigger className="legal-input">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent className="legal-card">
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="200+">200+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-legal-dark-text font-medium legal-body">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    className="legal-input"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-legal-dark-text font-medium legal-body">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    className="legal-input"
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>

                <Button onClick={handleProfileUpdate} disabled={isLoading} className="btn-legal-primary">
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>

            {/* Password Change */}
            <Card className="legal-card-hover border-legal-border">
              <CardHeader>
                <CardTitle className="legal-heading flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Change Password</span>
                </CardTitle>
                <CardDescription className="text-legal-secondary legal-body">
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-legal-dark-text font-medium legal-body">
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="legal-input pr-12"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-legal-secondary hover:text-legal-dark-text transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-legal-dark-text font-medium legal-body">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="legal-input pr-12"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-legal-secondary hover:text-legal-dark-text transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-legal-dark-text font-medium legal-body">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="legal-input pr-12"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-legal-secondary hover:text-legal-dark-text transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button onClick={handlePasswordChange} className="btn-legal-primary">
                  <Shield className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="legal-card-hover border-legal-border">
              <CardHeader>
                <CardTitle className="legal-heading flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
                <CardDescription className="text-legal-secondary legal-body">
                  Choose how you want to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email Notifications */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-legal-dark-text font-medium legal-body flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Email Notifications</span>
                    </Label>
                    <p className="text-sm text-legal-secondary legal-body">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>

                {/* Push Notifications */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-legal-dark-text font-medium legal-body flex items-center space-x-2">
                      <Smartphone className="w-4 h-4" />
                      <span>Push Notifications</span>
                    </Label>
                    <p className="text-sm text-legal-secondary legal-body">
                      Receive push notifications on your device
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))
                    }
                  />
                </div>

                {/* Marketing Emails */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-legal-dark-text font-medium legal-body flex items-center space-x-2">
                      <Globe className="w-4 h-4" />
                      <span>Marketing Emails</span>
                    </Label>
                    <p className="text-sm text-legal-secondary legal-body">
                      Receive product updates and promotional content
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, marketingEmails: checked }))
                    }
                  />
                </div>

                {/* Weekly Reports */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-legal-dark-text font-medium legal-body flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>Weekly Reports</span>
                    </Label>
                    <p className="text-sm text-legal-secondary legal-body">
                      Get weekly summaries of your legal activities
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.weeklyReports}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, weeklyReports: checked }))
                    }
                  />
                </div>

                {/* Document Updates */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-legal-dark-text font-medium legal-body flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>Document Updates</span>
                    </Label>
                    <p className="text-sm text-legal-secondary legal-body">
                      Notifications when your documents are processed
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.documentUpdates}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, documentUpdates: checked }))
                    }
                  />
                </div>

                {/* Compliance Alerts */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-legal-dark-text font-medium legal-body flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span>Compliance Alerts</span>
                    </Label>
                    <p className="text-sm text-legal-secondary legal-body">
                      Important compliance deadlines and updates
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.complianceAlerts}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, complianceAlerts: checked }))
                    }
                  />
                </div>

                <Button className="btn-legal-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="legal-card-hover border-legal-border">
              <CardHeader>
                <CardTitle className="legal-heading flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Privacy & Security</span>
                </CardTitle>
                <CardDescription className="text-legal-secondary legal-body">
                  Control your privacy settings and data usage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Visibility */}
                <div className="space-y-3">
                  <Label className="text-legal-dark-text font-medium legal-body">
                    Profile Visibility
                  </Label>
                  <Select 
                    value={privacySettings.profileVisibility} 
                    onValueChange={(value) => setPrivacySettings(prev => ({ ...prev, profileVisibility: value }))}
                  >
                    <SelectTrigger className="legal-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="legal-card">
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="contacts">Contacts Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-legal-secondary legal-body">
                    Control who can see your profile information
                  </p>
                </div>

                {/* Data Sharing */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-legal-dark-text font-medium legal-body">
                      Data Sharing
                    </Label>
                    <p className="text-sm text-legal-secondary legal-body">
                      Allow anonymized data sharing for product improvement
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.dataSharing}
                    onCheckedChange={(checked) => 
                      setPrivacySettings(prev => ({ ...prev, dataSharing: checked }))
                    }
                  />
                </div>

                {/* Analytics Opt-out */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-legal-dark-text font-medium legal-body">
                      Analytics Opt-out
                    </Label>
                    <p className="text-sm text-legal-secondary legal-body">
                      Opt out of usage analytics and tracking
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.analyticsOptOut}
                    onCheckedChange={(checked) => 
                      setPrivacySettings(prev => ({ ...prev, analyticsOptOut: checked }))
                    }
                  />
                </div>

                {/* Two-Factor Authentication */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-legal-dark-text font-medium legal-body">
                      Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-legal-secondary legal-body">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.twoFactorAuth}
                    onCheckedChange={(checked) => 
                      setPrivacySettings(prev => ({ ...prev, twoFactorAuth: checked }))
                    }
                  />
                </div>

                <Button className="btn-legal-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Save Privacy Settings
                </Button>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card className="legal-card-hover border-legal-border">
              <CardHeader>
                <CardTitle className="legal-heading">Data Management</CardTitle>
                <CardDescription className="text-legal-secondary legal-body">
                  Export or delete your account data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div>
                    <h4 className="font-medium text-blue-900 legal-body">Export Data</h4>
                    <p className="text-sm text-blue-700 legal-body">Download all your account data</p>
                  </div>
                  <Button onClick={handleExportData} className="btn-legal-secondary">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div>
                    <h4 className="font-medium text-red-900 legal-body">Delete Account</h4>
                    <p className="text-sm text-red-700 legal-body">Permanently delete your account and all data</p>
                  </div>
                  <Button onClick={handleDeleteAccount} variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card className="legal-card-hover border-legal-border">
              <CardHeader>
                <CardTitle className="legal-heading flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Billing & Subscription</span>
                </CardTitle>
                <CardDescription className="text-legal-secondary legal-body">
                  Manage your subscription and billing information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Plan */}
                <div className="p-6 bg-gradient-to-r from-legal-accent/10 to-legal-brown/10 border border-legal-border rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-legal-dark-text legal-heading">Professional Plan</h3>
                      <p className="text-legal-secondary legal-body">$99/month • Billed monthly</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-legal-brown legal-heading">$99</div>
                      <div className="text-sm text-legal-secondary legal-body">per month</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-legal-border">
                    <p className="text-sm text-legal-secondary legal-body">
                      Next billing date: <span className="font-medium text-legal-dark-text">January 15, 2024</span>
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button className="btn-legal-primary">
                    Upgrade Plan
                  </Button>
                  <Button className="btn-legal-secondary">
                    Change Plan
                  </Button>
                  <Button variant="outline" className="border-legal-border hover:bg-legal-bg-secondary">
                    Cancel Subscription
                  </Button>
                </div>

                {/* Billing History */}
                <div>
                  <h4 className="font-medium text-legal-dark-text mb-4 legal-heading">Billing History</h4>
                  <div className="space-y-3">
                    {[
                      { date: "Dec 15, 2023", amount: "$99.00", status: "Paid", invoice: "INV-001" },
                      { date: "Nov 15, 2023", amount: "$99.00", status: "Paid", invoice: "INV-002" },
                      { date: "Oct 15, 2023", amount: "$99.00", status: "Paid", invoice: "INV-003" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-legal-border rounded-xl">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-medium text-legal-dark-text legal-body">{item.invoice}</p>
                            <p className="text-sm text-legal-secondary legal-body">{item.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="font-medium text-legal-dark-text legal-body">{item.amount}</span>
                          <span className="legal-badge legal-badge-success">{item.status}</span>
                          <Button variant="ghost" size="sm" className="text-legal-accent hover:text-legal-brown">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
