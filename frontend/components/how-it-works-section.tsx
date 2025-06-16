import { Upload, Bot, CheckCircle, Download, BarChart } from "lucide-react"

export default function HowItWorksSection() {
  const steps = [
    {
      icon: Upload,
      title: "Upload or Fill Form",
      description: "Upload documents, IDs, or fill out our smart forms with your requirements",
    },
    {
      icon: Bot,
      title: "AI Drafting & Parsing",
      description: "Our AI powered by OpenAI and Gemini processes and generates your legal documents",
    },
    {
      icon: CheckCircle,
      title: "Deadline & Law Check",
      description: "Government API integration ensures compliance with latest regulations and deadlines",
    },
    {
      icon: Download,
      title: "Get Final Docs",
      description: "Receive completed documents via PDF, email, or WhatsApp notifications",
    },
    {
      icon: BarChart,
      title: "Track Everything",
      description: "Monitor all your legal tasks with calendar integration, alerts, and audit logs",
    },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Simple 5-step process to automate your legal workflows
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 -translate-y-1/2" />

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon
              return (
                <div key={index} className="relative text-center">
                  {/* Step Circle */}
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>

                  {/* Step Number */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm z-20">
                    {index + 1}
                  </div>

                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
