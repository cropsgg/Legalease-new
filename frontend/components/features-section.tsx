"use client"

import { FileText, Search, Calendar, Shield, MessageSquare, CreditCard } from "lucide-react"
import Image from "next/image"

export default function FeaturesSection() {
  const features = [
    {
      icon: FileText,
      title: "Auto-Draft Contracts with AI",
      description: "Generate NDAs, service agreements, and employment contracts in minutes using advanced AI models.",
      image: "/images/contract-drafting.jpg",
      fallback: "Contract drafting interface with AI assistance",
    },
    {
      icon: Search,
      title: "Parse & Explain Agreements",
      description:
        "Upload any legal document and get AI-powered analysis, risk assessment, and plain English explanations.",
      image: "/images/document-analysis.jpg",
      fallback: "Document analysis dashboard with highlighted terms",
    },
    {
      icon: Calendar,
      title: "Deadline Tracking",
      description: "Never miss GST, MCA, ISO, or labor law deadlines with intelligent calendar integration and alerts.",
      image: "/images/deadline-tracking.jpg",
      fallback: "Calendar interface showing compliance deadlines",
    },
    {
      icon: Shield,
      title: "PAN/Aadhaar Verification",
      description: "Instant identity verification and KYC compliance using government APIs and secure data handling.",
      image: "/images/verification-system.jpg",
      fallback: "Identity verification interface with security badges",
    },
    {
      icon: MessageSquare,
      title: "Vernacular Alerts",
      description: "Get notifications and document summaries in Hindi, Tamil, and other regional languages.",
      image: "/images/multilingual-support.jpg",
      fallback: "Multi-language notification interface",
    },
    {
      icon: CreditCard,
      title: "Smart Secure Payment Flows",
      description: "Integrated payment processing with invoice generation, tax calculations, and compliance tracking.",
      image: "/images/payment-system.jpg",
      fallback: "Payment processing dashboard with security features",
    },
  ]

  const ImageWithFallback = ({ src, alt, fallback }: { src: string; alt: string; fallback: string }) => {
    return (
      <div className="relative w-full h-full min-h-[300px] rounded-xl overflow-hidden">
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = "none"
            const fallbackDiv = target.nextElementSibling as HTMLElement
            if (fallbackDiv) fallbackDiv.style.display = "flex"
          }}
        />
        <div className="image-fallback absolute inset-0 hidden">
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-slate-300 dark:bg-gray-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <FileText className="w-8 h-8 text-slate-500 dark:text-gray-400" />
            </div>
            <p className="text-sm text-slate-500 dark:text-gray-400">{fallback}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="py-20 bg-slate-50 dark:bg-gray-900/30 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
            What LegalEase Can Do for You
          </h2>
          <p className="text-xl text-slate-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive AI-powered legal automation designed specifically for Indian startups and SMEs
          </p>
        </div>

        <div className="space-y-20">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            const isEven = index % 2 === 0

            return (
              <div
                key={index}
                className={`grid lg:grid-cols-2 gap-12 items-center ${!isEven ? "lg:grid-flow-col-dense" : ""}`}
              >
                <div className={isEven ? "lg:order-1" : "lg:order-2"}>
                  <div className="feature-icon-bg w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-slate-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                </div>

                <div className={isEven ? "lg:order-2" : "lg:order-1"}>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 rounded-2xl p-6 shadow-lg">
                    <ImageWithFallback
                      src={feature.image || "/placeholder.svg"}
                      alt={feature.title}
                      fallback={feature.fallback}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
