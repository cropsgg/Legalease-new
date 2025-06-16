import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Building, Globe, Target, BarChart3 } from "lucide-react"

export default function MarketPage() {
  const marketStats = [
    {
      icon: TrendingUp,
      title: "₹2.5 Trillion",
      subtitle: "Indian Legal Services Market",
      description: "Growing at 8.5% CAGR with increasing digitization demand",
      color: "bg-blue-500",
    },
    {
      icon: Users,
      title: "75 Million+",
      subtitle: "SMEs in India",
      description: "Underserved market with limited access to affordable legal services",
      color: "bg-purple-500",
    },
    {
      icon: Building,
      title: "1.2 Million+",
      subtitle: "New Company Registrations",
      description: "Annual registrations creating massive compliance demand",
      color: "bg-green-500",
    },
    {
      icon: Globe,
      title: "65%",
      subtitle: "Digital Adoption Rate",
      description: "Rapid shift towards digital-first legal solutions",
      color: "bg-orange-500",
    },
  ]

  const targetSegments = [
    {
      title: "Startups & SMEs",
      size: "75M+ businesses",
      pain: "Complex compliance, high legal costs",
      solution: "Automated workflows, affordable pricing",
    },
    {
      title: "CA Firms",
      size: "150K+ practices",
      pain: "Manual processes, client management",
      solution: "Practice management, client portals",
    },
    {
      title: "Legal Professionals",
      size: "2M+ lawyers",
      pain: "Document drafting, case management",
      solution: "AI-powered drafting, workflow automation",
    },
    {
      title: "Enterprises",
      size: "50K+ companies",
      pain: "Compliance tracking, legal operations",
      solution: "Enterprise solutions, API integrations",
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117] transition-colors duration-300">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Market Opportunity</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Addressing the massive underserved legal technology market in India with AI-powered solutions
          </p>
        </div>

        {/* Market Statistics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {marketStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="border-gray-200 dark:border-gray-800 text-center">
                <CardHeader>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">{stat.title}</CardTitle>
                  <CardDescription className="font-medium text-gray-700 dark:text-gray-300">
                    {stat.subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Target Segments */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Target Market Segments</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {targetSegments.map((segment, index) => (
              <Card key={index} className="border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">{segment.title}</CardTitle>
                  <Badge variant="secondary" className="w-fit">
                    {segment.size}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">Pain Points:</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{segment.pain}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">Our Solution:</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{segment.solution}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Market Opportunity */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Now?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Perfect convergence of market demand, technology maturity, and regulatory push
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Market Demand</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Rising compliance requirements and digital transformation needs
              </p>
            </div>
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Technology Ready</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI/ML maturity enabling sophisticated legal automation
              </p>
            </div>
            <div className="text-center">
              <Globe className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Regulatory Push</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Government digitization initiatives and compliance mandates
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
