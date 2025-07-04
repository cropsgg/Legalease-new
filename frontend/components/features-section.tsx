"use client";
// feature-section.tsx
import {
  Scale,
  Shield,
  Users,
  FileText,
  Clock,
  Award,
  Heart,
  Currency,
} from "lucide-react";
import Image from "next/image";
import { Baskervville, Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic", "normal"],
  variable: "--font-montserrat",
});
const baskervville = Baskervville({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic", "normal"],
  variable: "--font-baskervville",
});
export default function FeaturesSection() {
  const legalServices = [
    {
      icon: Scale,
      title: "MEET OUR MOST TALENTED LEGAL & ACCOUNTING EXPERTS",
      subtitle: "VERIFIED ATTORNEYS & CHARTERED ACCOUNTANTS",
      description:
        "When looking for legal or accounting help, you want professionals with experience in cases and filings like yours, who maintain the highest ethical and customer service standards.",
      stats: [
        { percentage: "90%", label: "Legal Solutions" },
        { percentage: "95%", label: "Client Success" },
        { percentage: "85%", label: "Results Driven" },
      ],
      image: "/images/image1.jpeg",
      isLawyer: true,
    },
    {
      icon: Shield,
      title: "WHY CHOOSE LEGALEASE FOR LEGAL & ACCOUNTING NEEDS?",
      description:
        "We provide high quality legal and accounting services for you, your business, and your family. Get the best people for all your compliance and advisory needs.",
      services: [
        {
          title: "Legal & Accounting Representation",
          description:
            "We handle civil litigation, business legal services, GST filings, tax returns, and more.",
        },
        {
          title: "Compliance & Filings",
          description:
            "We ensure your business stays compliant with GST, tax, and regulatory filings.",
        },
        {
          title: "Support",
          description:
            "Our clients get excellent 24/7 legal and accounting help and support.",
        },
      ],
      image: "/images/image2.jpeg",
      isDark: true,
    },
    {
      icon: Users,
      title: "OUR LEGAL & ACCOUNTING PRACTICE AREAS",
      description:
        "We offer a wide range of legal and accounting services to our clients, going the extra mile to ensure compliance, justice, and peace of mind.",
      practiceAreas: [
        {
          icon: Users,
          title: "Startup, Business Law & Accounting",
          description:
            "Expert legal and accounting support for startups and businesses, including company formation, contracts, GST, tax, and regulatory compliance.",
        },
        {
          icon: Scale,
          title: "Criminal Law",
          description:
            "Comprehensive assistance in criminal matters, from legal advice to representation in criminal proceedings and bail matters.",
        },
        {
          title: "Tax, GST & Compliance",
          description:
            "Guidance on GST, income tax, business filings, and ongoing compliance to keep your company protected and up-to-date.",
        },
      ],
      image: "/images/image6.jpeg",
    },
  ];

  const practiceAreas = [
    {
      icon: Users,
      title: "Startup, Business Law & Accounting",
      description:
        "Expert legal and accounting support for startups and businesses, including company formation, contracts, GST, tax, and regulatory compliance.",
    },
    {
      icon: Scale,
      title: "Criminal Law",
      description:
        "Comprehensive assistance in criminal matters, from legal advice to representation in criminal proceedings and bail matters.",
    },
    {
      icon: Currency,
      title: "Tax, GST & Compliance",
      description:
        "Guidance on GST, income tax, business filings, and ongoing compliance to keep your company protected and up-to-date.",
    },
  ];

  return (
    <section className="py-16 bg-[#F8F3EE]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className={`text-3xl md:text-4xl lg:text-5xl font-light text-[#2A2A2A] mb-8 tracking-wide ${baskervville.className}`}
          >
            LEGAL & ACCOUNTING SERVICES WE OFFER
          </h2>
          <p
            className={`text-base md:text-lg text-[#8B7355] max-w-2xl mx-auto leading-relaxed ${montserrat.className}`}
          >
            Legalease provides a complete suite of legal and accounting (CA)
            services for businesses and individuals, including GST filings, tax
            returns, compliance, and legal assistance for any situation.
          </p>
        </div>

        {/* Practice Areas Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {practiceAreas.map((area, index) => {
            const IconComponent = area.icon;
            return (
              <div key={index} className="text-center group cursor-pointer">
                {/* Icon Circle */}
                <div className="w-20 h-20 bg-[#D4B59E] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#C4A584] transition-colors duration-300">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3
                  className={`text-xl font-extrabold text-[#2A2A2A] mb-4 ${baskervville.className}`}
                >
                  {area.title}
                </h3>

                {/* Description */}
                <p
                  className={`text-[#8B7355] leading-relaxed text-sm md:text-base ${montserrat.className}`}
                >
                  {area.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
