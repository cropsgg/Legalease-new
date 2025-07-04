"use client"

import { Scale, Shield, Users, FileText, Clock, Award, Heart } from "lucide-react"
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
          description: "There are various forms of legal business entities including from the legal entity",
        },
        {
          icon: Scale,
          title: "Criminal Law",
          description: "Criminal law is the body of law that relates to crime. Conduct considered a criminal law area",
        },
        {
          icon: Heart,
          title: "Family Law",
          description: "Family law is a legal practice area that focuses on issues involving family relationships",
        }
      ],
      image: "/images/image6.jpeg",
    }
  ]

  const practiceAreas = [
    {
      icon: Users,
      title: "Business Law",
      description: "There are various forms of legal business entities including from the legal entity",
    },
    {
      icon: Scale,
      title: "Criminal Law",
      description: "Criminal law is the body of law that relates to crime. Conduct considered a criminal law area",
    },
    {
      icon: Heart,
      title: "Family Law",
      description: "Family law is a legal practice area that focuses on issues involving family relationships",
    },
  ]

  return (
    <section className="py-16 bg-[#F8F3EE]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#2A2A2A] mb-8 tracking-wide">
            THE AREA WHERE WE
            <br />
            PRACTISE LAW
          </h2>
          <p className="text-base md:text-lg text-[#8B7355] max-w-2xl mx-auto leading-relaxed">
            We offer a wide range of services to our customers and we go the extra length 
            to make sure justice is served.
          </p>
        </div>

        {/* Practice Areas Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {practiceAreas.map((area, index) => {
            const IconComponent = area.icon
            return (
              <div
                key={index}
                className="text-center group cursor-pointer"
              >
                {/* Icon Circle */}
                <div className="w-20 h-20 bg-[#D4B59E] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#C4A584] transition-colors duration-300">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-semibold text-[#2A2A2A] mb-4">
                  {area.title}
                </h3>
                
                {/* Description */}
                <p className="text-[#8B7355] leading-relaxed text-sm md:text-base">
                  {area.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
