import { Button } from "@/components/ui/button"
import { Scale, Shield, Award, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HeroSection() {
  return (
    <section className="legal-hero-bg relative py-20 lg:py-32 overflow-hidden">
      {/* Professional Legal Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 transform rotate-12">
          <Scale className="w-32 h-32 text-amber-800" />
        </div>
        <div className="absolute bottom-10 right-10 transform -rotate-12">
          <Scale className="w-24 h-24 text-amber-700" />
        </div>
        <div className="absolute top-1/2 left-1/4 transform -rotate-6">
          <Scale className="w-20 h-20 text-amber-600" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left max-w-2xl">
            {/* Professional Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-amber-200 rounded-full px-4 py-2 mb-6 legal-shadow">
              <Scale className="w-5 h-5 text-amber-700" />
              <span className="text-sm font-semibold text-amber-800">HIGH QUALITY LEGAL CONSULTANCY</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl legal-heading mb-6 leading-tight">
              Specialist Family Lawyers
              <br />
              <span className="text-amber-700">and Divorce Solicitors.</span>
            </h1>

            {/* Subtext */}
            <p className="text-xl md:text-2xl legal-text mb-8 leading-relaxed max-w-lg">
              Family law is all we do, so whatever your situation, it will be familiar to us. We strive to expand time.
            </p>

            {/* CTA Button */}
            <div className="mb-12">
              <Button className="btn-legal-primary text-lg px-12 py-6 rounded-full">
                <Link href="/contact" className="flex items-center space-x-2">
                  <span>GET STARTED</span>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </Link>
              </Button>
            </div>

            {/* Professional Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-800">500+</div>
                <div className="text-sm legal-text-muted">Trusted Clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-800">25+</div>
                <div className="text-sm legal-text-muted">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-800">98%</div>
                <div className="text-sm legal-text-muted">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Side - Lady Justice Statue */}
          <div className="relative">
            <div className="relative legal-shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 p-8">
              <div className="relative w-full h-96 lg:h-[500px] flex items-center justify-center">
                {/* Justice statue placeholder - replace with actual image */}
                <div className="justice-scale relative">
                  <Scale className="w-64 h-64 lg:w-80 lg:h-80 text-amber-800" />
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Scale className="w-6 h-6 text-amber-700" />
                </div>
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center opacity-60">
                  <Shield className="w-8 h-8 text-amber-800" />
                </div>
              </div>
            </div>

            {/* Floating Professional Indicators */}
            <div className="absolute -top-4 -left-4 bg-white legal-shadow rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-semibold text-amber-800">Legal Solutions</span>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-white legal-shadow rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-700" />
                <span className="text-sm font-semibold text-amber-800">Award Winning</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Professional Navigation */}
        <div className="mt-16 pt-8 border-t border-amber-200">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="legal-professional-card">
              <Users className="w-8 h-8 text-amber-700 mx-auto mb-2" />
              <h3 className="legal-subheading text-sm mb-1">Business Law</h3>
              <p className="text-xs legal-text-muted">These are various forms of legal business services ranging from the sole trader</p>
            </div>
            <div className="legal-professional-card">
              <Scale className="w-8 h-8 text-amber-700 mx-auto mb-2" />
              <h3 className="legal-subheading text-sm mb-1">Criminal Law</h3>
              <p className="text-xs legal-text-muted">Criminal law is the body of law that relates to crime. Concerns perceived as threatening lawful</p>
            </div>
            <div className="legal-professional-card">
              <Shield className="w-8 h-8 text-amber-700 mx-auto mb-2" />
              <h3 className="legal-subheading text-sm mb-1">Family Law</h3>
              <p className="text-xs legal-text-muted">Family law is a legal practice area that focuses on issues involving family relationships</p>
            </div>
            <div className="legal-professional-card">
              <Award className="w-8 h-8 text-amber-700 mx-auto mb-2" />
              <h3 className="legal-subheading text-sm mb-1">Property Law</h3>
              <p className="text-xs legal-text-muted">Property law is the area of law that governs the various forms of ownership and tenancy</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
