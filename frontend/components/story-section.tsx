"use client"

import { Button } from "@/components/ui/button"
import { Scale, Shield, Award, Star } from "lucide-react"
import Image from "next/image"

export default function StorySection() {
  const successStories = [
    {
      title: "Complex Business Litigation",
      outcome: "Successfully Resolved",
      description: "Multi-million dollar settlement in corporate dispute",
      icon: Scale,
    },
    {
      title: "Family Law Resolution",
      outcome: "Amicable Settlement",
      description: "Peaceful resolution of complex family matters",
      icon: Shield,
    },
    {
      title: "Criminal Defense Victory",
      outcome: "Case Dismissed",
      description: "All charges dropped through expert defense",
      icon: Award,
    },
    {
      title: "Property Rights Protected",
      outcome: "Client Interests Secured",
      description: "Successfully defended property ownership rights",
      icon: Star,
    },
  ]

  return (
    <section className="py-20 legal-section-alternate transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl legal-heading mb-6">
              Meet Our Distinguished Legal Team
            </h2>

            <div className="space-y-6">
              {successStories.map((story, index) => {
                const IconComponent = story.icon
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 legal-icon-bg rounded-xl flex items-center justify-center text-white">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="legal-subheading text-lg">{story.title}</h3>
                      <div className="text-sm text-amber-700 font-semibold mb-1">{story.outcome}</div>
                      <p className="legal-text-muted">{story.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-500 fill-current" />
                  ))}
                </div>
                <span className="legal-text font-semibold">4.9/5 Client Rating</span>
              </div>
              
              <Button className="btn-legal-primary">
                Meet Our Attorneys
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="legal-feature-card">
              <div className="relative w-full h-[600px] rounded-xl overflow-hidden">
                <Image
                  src="/images/img1.jpeg"
                  alt="Our Legal Team"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                  }}
                />
              </div>

              {/* Floating Achievement Cards */}
              <div className="absolute -top-4 -left-4 bg-white legal-shadow rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-amber-700" />
                  <span className="text-sm font-semibold text-amber-800">Top Rated Law Firm</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white legal-shadow rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <Scale className="w-5 h-5 text-amber-700" />
                  <span className="text-sm font-semibold text-amber-800">25+ Years Experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Credentials Section */}
        <div className="mt-20 grid md:grid-cols-4 gap-8">
          <div className="legal-professional-card text-center">
            <Scale className="w-12 h-12 text-amber-700 mx-auto mb-4" />
            <div className="text-3xl font-bold text-amber-800 mb-2">500+</div>
            <div className="legal-text-muted">Cases Won</div>
          </div>
          
          <div className="legal-professional-card text-center">
            <Shield className="w-12 h-12 text-amber-700 mx-auto mb-4" />
            <div className="text-3xl font-bold text-amber-800 mb-2">98%</div>
            <div className="legal-text-muted">Success Rate</div>
          </div>
          
          <div className="legal-professional-card text-center">
            <Award className="w-12 h-12 text-amber-700 mx-auto mb-4" />
            <div className="text-3xl font-bold text-amber-800 mb-2">50+</div>
            <div className="legal-text-muted">Legal Awards</div>
          </div>
          
          <div className="legal-professional-card text-center">
            <Star className="w-12 h-12 text-amber-700 mx-auto mb-4" />
            <div className="text-3xl font-bold text-amber-800 mb-2">1000+</div>
            <div className="legal-text-muted">Happy Clients</div>
          </div>
        </div>

        {/* Client Testimonial */}
        <div className="mt-20">
          <div className="legal-feature-card text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-amber-500 fill-current" />
              ))}
            </div>
            <p className="text-xl legal-text italic mb-6">
              "The legal expertise and professional service provided by this firm has been exceptional. They handled our case with utmost care and achieved the best possible outcome."
            </p>
            <div className="legal-subheading">John Anderson</div>
            <div className="legal-text-muted">CEO, Anderson Enterprises</div>
          </div>
        </div>
      </div>
    </section>
  )
}
