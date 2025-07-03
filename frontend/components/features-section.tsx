"use client"

import { Scale, Shield, Users, FileText, Clock, Award } from "lucide-react"
import Image from "next/image"

export default function FeaturesSection() {
  const legalServices = [
    {
      icon: Scale,
      title: "MEET OUR MOST TALENTED AND QUALIFIED ATTORNEYS",
      subtitle: "LEAD COUNSEL VERIFIED ATTORNEYS",
      description: "When looking for a attorney, you want a professional who has experience dealing with cases similar to yours and who maintains the highest ethical and customer service standards.",
      stats: [
        { percentage: "90%", label: "Legal Solutions" },
        { percentage: "95%", label: "Client Success" },
        { percentage: "85%", label: "Results Driven" }
      ],
      image: "/images/image1.jpeg",
      isLawyer: true,
    },
    {
      icon: Shield,
      title: "WHAT BENEFITS WILL YOU GET FROM US?",
      description: "We provide high quality law service for you and your loved ones and business. You should find the best people.",
      services: [
        {
          title: "Legal representation",
          description: "We can handle whatever civil litigation and business legal services",
        },
        {
          title: "Allegations",
          description: "We'll look at liability based on the specifics of the allegations.",
        },
        {
          title: "Support",
          description: "Our clients get excellent 24/7 around first class legal help and support.",
        }
      ],
      image: "/images/image2.jpeg",
      isDark: true,
    },
    {
      icon: Users,
      title: "THE AREA WHERE WE PRACTISE LAW",
      description: "We offer a wide range of services to our customers and we go the extra length to make sure justice is served.",
      practiceAreas: [
        {
          icon: Users,
          title: "Business Law",
          description: "These are various forms of legal business services ranging from the sole trader",
        },
        {
          icon: Scale,
          title: "Criminal Law", 
          description: "Criminal law is the body of law that relates to crime. Concerns perceived as threatening lawful",
        },
        {
          icon: Shield,
          title: "Family Law",
          description: "Family law is a legal practice area that focuses on issues involving family relationships",
        }
      ],
      image: "/images/image6.jpeg",
    }
  ]

  return (
    <section className="legal-section-bg py-20 transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl legal-heading mb-4">
            THE AREA WHERE WE PRACTISE LAW
          </h2>
          <div className="legal-divider mb-6"></div>
          <p className="text-xl legal-text max-w-3xl mx-auto">
            We offer a wide range of services to our customers and we go the extra length to make sure justice is served.
          </p>
        </div>

        <div className="space-y-24">
          {legalServices.map((service, index) => {
            const IconComponent = service.icon
            const isEven = index % 2 === 0

            return (
              <div
                key={index}
                className={`grid lg:grid-cols-2 gap-12 items-center ${!isEven ? "lg:grid-flow-col-dense" : ""}`}
              >
                {/* Content Section */}
                <div className={`${isEven ? "lg:order-1" : "lg:order-2"} ${service.isDark ? "bg-amber-900 text-white p-12 rounded-2xl legal-shadow-lg" : ""}`}>
                  <div className={`legal-icon-bg w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${service.isDark ? "bg-amber-700" : ""}`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className={`text-2xl md:text-3xl font-bold mb-6 ${service.isDark ? "text-white" : "legal-heading"}`}>
                    {service.title}
                  </h3>
                  
                  {service.subtitle && (
                    <h4 className={`text-lg font-semibold mb-4 ${service.isDark ? "text-amber-200" : "legal-subheading"}`}>
                      {service.subtitle}
                    </h4>
                  )}
                  
                  <p className={`text-lg leading-relaxed mb-6 ${service.isDark ? "text-amber-100" : "legal-text"}`}>
                    {service.description}
                  </p>

                  {/* Lawyer Stats */}
                  {service.isLawyer && service.stats && (
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {service.stats.map((stat, idx) => (
                        <div key={idx} className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                          <div className="text-2xl font-bold text-amber-700">{stat.percentage}</div>
                          <div className="text-sm legal-text-muted">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Legal Services */}
                  {service.services && (
                    <div className="space-y-4 mb-6">
                      {service.services.map((item, idx) => (
                        <div key={idx} className="border-l-4 border-amber-400 pl-4">
                          <h5 className="font-semibold text-amber-200 mb-1">{item.title}</h5>
                          <p className="text-amber-100 text-sm">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Practice Areas */}
                  {service.practiceAreas && (
                    <div className="grid gap-4">
                      {service.practiceAreas.map((area, idx) => {
                        const AreaIcon = area.icon
                        return (
                          <div key={idx} className="flex items-start space-x-4 legal-professional-card">
                            <div className="legal-icon-bg w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                              <AreaIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h5 className="legal-subheading text-base mb-1">{area.title}</h5>
                              <p className="legal-text-muted text-sm">{area.description}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {service.isLawyer && (
                    <button className="btn-legal-secondary mt-6">
                      Learn More
                    </button>
                  )}

                  {service.isDark && (
                    <button className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 mt-6">
                      FIND ATTORNEY
                    </button>
                  )}
                </div>

                {/* Image Section */}
                <div className={isEven ? "lg:order-2" : "lg:order-1"}>
                  <div className="legal-feature-card">
                    <div className="relative w-full h-80 lg:h-96 rounded-xl overflow-hidden">
                      <Image
                        src={service.image || "/placeholder.svg"}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-20 text-center bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-12 legal-shadow">
          <h3 className="text-3xl legal-heading mb-4">WANT A LAWYER?</h3>
          <p className="text-xl legal-text mb-6">LET'S TALK</p>
          <p className="text-2xl font-bold text-amber-800 mb-8">HELLO@OSPACE.CO</p>
          <button className="btn-legal-primary">
            CONTACT US
          </button>
        </div>
      </div>
    </section>
  )
}
