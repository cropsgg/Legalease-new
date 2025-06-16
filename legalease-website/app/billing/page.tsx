"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Crown, ArrowRight, Check, Download, TrendingUp, Zap, Star } from "lucide-react"

export default function BillingPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  const currentPlan = {
    name: "Pro Plan",
    price: "₹699",
    period: "month",
    features: [
      "Unlimited AI document generation",
      "Advanced compliance tracking",
      "Priority support + WhatsApp",
      "Custom templates",
      "Smart deadline management",
      "10 government filings included",
      "Multi-language support",
      "Payment workflow integration",
    ],
    usage: {
      documents: { used: 45, limit: "Unlimited" },
      workflows: { used: 12, limit: "Unlimited" },
      aiQueries: { used: 234, limit: "Unlimited" },
      storage: { used: 2.4, limit: 100 },
    },
  }

  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "",
      description: "Perfect for early-stage startups",
      features: [
        "3 AI document workflows per month",
        "Basic compliance tracking",
        "Email support",
        "Standard templates",
        "Basic deadline alerts",
      ],
      popular: false,
      current: false,
    },
    {
      name: "Pro",
      price: "₹699",
      period: "/month",
      description: "Best for growing startups",
      features: [
        "Unlimited AI document generation",
        "Advanced compliance tracking",
        "Priority support + WhatsApp",
        "Custom templates",
        "Smart deadline management",
        "10 government filings included",
        "Multi-language support",
        "Payment workflow integration",
      ],
      popular: true,
      current: !user?.isGuest,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For established businesses",
      features: [
        "Everything in Pro",
        "API access",
        "Team collaboration tools",
        "Custom integrations",
        "Dedicated account manager",
        "SLA guarantee",
        "Advanced analytics",
        "White-label options",
      ],
      popular: false,
      current: false,
    },
  ]

  const invoices = [
    {
      id: "INV-2024-003",
      date: "March 1, 2024",
      amount: "₹699",
      status: "Paid",
      description: "Pro Plan - Monthly Subscription",
    },
    {
      id: "INV-2024-002",
      date: "February 1, 2024",
      amount: "₹699",
      status: "Paid",
      description: "Pro Plan - Monthly Subscription",
    },
    {
      id: "INV-2024-001",
      date: "January 1, 2024",
      amount: "₹699",
      status: "Paid",
      description: "Pro Plan - Monthly Subscription",
    },
  ]

  const paymentMethods = [
    {
      id: 1,
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
    },
    {
      id: 2,
      type: "upi",
      identifier: "user@paytm",
      isDefault: false,
    },
  ]

  if (user?.isGuest) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Billing & Plans</h1>
            <p className="text-gray-600 dark:text-gray-400">Choose the perfect plan for your business needs</p>
          </div>
        </div>

        {/* Guest Mode Banner */}
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">You're Currently in Guest Mode</h3>
                  <p className="text-yellow-600 dark:text-yellow-300">
                    Upgrade to a full account to access billing features and premium plans
                  </p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                Upgrade to Pro
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Plans for Guest */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.popular
                  ? "border-blue-500 dark:border-blue-400 scale-105 shadow-lg"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mb-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 dark:text-gray-400">{plan.period}</span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      : "border border-gray-300 dark:border-gray-600"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Billing & Subscription</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your subscription and billing information</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Download Invoice
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    Current Plan: {currentPlan.name}
                  </CardTitle>
                  <CardDescription>
                    {currentPlan.price}
                    {currentPlan.period} • Next billing: March 31, 2024
                  </CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Plan Features</h4>
                  <ul className="space-y-2">
                    {currentPlan.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Cost</span>
                    <span className="font-semibold text-lg">{currentPlan.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Next Billing</span>
                    <span className="font-medium">March 31, 2024</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      Change Plan
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Cancel Subscription
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">₹699</p>
                  </div>
                  <CreditCard className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">₹2,097</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Savings</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">₹1,200</p>
                  </div>
                  <Zap className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Usage Tab */}
        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Usage</CardTitle>
              <CardDescription>Track your usage across different features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Documents Processed</span>
                      <span className="text-sm text-gray-500">
                        {currentPlan.usage.documents.used} / {currentPlan.usage.documents.limit}
                      </span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Active Workflows</span>
                      <span className="text-sm text-gray-500">
                        {currentPlan.usage.workflows.used} / {currentPlan.usage.workflows.limit}
                      </span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">AI Queries</span>
                      <span className="text-sm text-gray-500">
                        {currentPlan.usage.aiQueries.used} / {currentPlan.usage.aiQueries.limit}
                      </span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Storage Used</span>
                      <span className="text-sm text-gray-500">
                        {currentPlan.usage.storage.used} GB / {currentPlan.usage.storage.limit} GB
                      </span>
                    </div>
                    <Progress value={2.4} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View and download your past invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{invoice.description}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {invoice.id} • {invoice.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">{invoice.amount}</p>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          {invoice.status}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods and billing information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      {method.type === "card" ? (
                        <>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {method.brand} •••• {method.last4}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Expires {method.expiryMonth}/{method.expiryYear}
                          </p>
                        </>
                      ) : (
                        <>
                          <h4 className="font-medium text-gray-900 dark:text-white">UPI</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{method.identifier}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {method.isDefault && <Badge variant="outline">Default</Badge>}
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full gap-2">
                <CreditCard className="w-4 h-4" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
