import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Zap, Shield, Globe, Database, Cpu } from "lucide-react"

export default function TechnologyPage() {
  const technologies = [
    {
      icon: Brain,
      title: "Advanced AI & Machine Learning",
      description: "Powered by state-of-the-art language models and custom-trained legal AI",
      features: ["GPT-4 Integration", "Custom Legal Models", "Natural Language Processing", "Document Understanding"],
      color: "bg-blue-500",
    },
    {
      icon: Zap,
      title: "Workflow Automation",
      description: "n8n-powered automation for seamless legal process management",
      features: ["Visual Workflow Builder", "API Integrations", "Scheduled Tasks", "Event Triggers"],
      color: "bg-purple-500",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with end-to-end encryption and compliance",
      features: ["256-bit Encryption", "SOC 2 Compliance", "Data Residency", "Access Controls"],
      color: "bg-green-500",
    },
    {
      icon: Globe,
      title: "Cloud Infrastructure",
      description: "Scalable, reliable cloud architecture built for performance",
      features: ["99.9% Uptime", "Auto-scaling", "Global CDN", "Disaster Recovery"],
      color: "bg-orange-500",
    },
    {
      icon: Database,
      title: "Data Management",
      description: "Intelligent data processing and storage solutions",
      features: ["Real-time Sync", "Backup & Recovery", "Data Analytics", "Version Control"],
      color: "bg-red-500",
    },
    {
      icon: Cpu,
      title: "Performance Optimization",
      description: "Optimized for speed and efficiency across all operations",
      features: ["Edge Computing", "Caching Layer", "Load Balancing", "Performance Monitoring"],
      color: "bg-indigo-500",
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117] transition-colors duration-300">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Technology Stack</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Built on cutting-edge technology to deliver reliable, secure, and scalable legal automation solutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {technologies.map((tech, index) => {
            const Icon = tech.icon
            return (
              <Card key={index} className="border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 ${tech.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-gray-900 dark:text-white">{tech.title}</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">{tech.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tech.features.map((feature, featureIndex) => (
                      <Badge key={featureIndex} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Built for the Future</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Our technology stack is continuously evolving to incorporate the latest advances in AI, security, and cloud
            computing to serve your legal needs better.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="px-4 py-2 text-sm">AI-First Architecture</Badge>
            <Badge className="px-4 py-2 text-sm">Microservices Design</Badge>
            <Badge className="px-4 py-2 text-sm">API-Driven Platform</Badge>
            <Badge className="px-4 py-2 text-sm">Real-time Processing</Badge>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
