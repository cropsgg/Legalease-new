"use client"

import { Scale, Shield, Award, Star, Users } from "lucide-react"
import Image from "next/image"

export default function TrustSection() {
  const credentials = [
    {
      icon: Scale,
      title: "Bar Association",
      description: "Members of State and National Bar Associations",
    },
    {
      icon: Shield,
      title: "Legal Excellence",
      description: "Recognized for outstanding legal service",
    },
    {
      icon: Award,
      title: "Top Rated",
      description: "Highest peer review ratings in legal practice",
    },
    {
      icon: Users,
      title: "Client Trust",
      description: "Trusted by thousands of satisfied clients",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      position: "CFO, Johnson Enterprises",
      image: "/placeholder-user.jpg",
      content: "The legal expertise and dedication shown by the team has been exceptional. They helped us navigate complex corporate matters with ease.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      position: "CEO, Tech Innovations",
      image: "/placeholder-user.jpg",
      content: "Their attention to detail and professional approach made all the difference in our legal proceedings. Highly recommended.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      position: "Director, Global Solutions",
      image: "/placeholder-user.jpg",
      content: "Outstanding legal service. The team's expertise and commitment to excellence is truly remarkable.",
      rating: 5,
    },
  ]

  return (
    <section className="py-20 legal-section-alternate">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl legal-heading mb-4">
            Trust & Credibility
          </h2>
          <div className="legal-divider mb-6"></div>
          <p className="text-xl legal-text max-w-2xl mx-auto">
            Our reputation is built on years of excellence in legal practice and client satisfaction
          </p>
        </div>

        {/* Credentials */}
        <div className="grid md:grid-cols-4 gap-8 mb-20">
          {credentials.map((credential, index) => {
            const IconComponent = credential.icon
            return (
              <div key={index} className="legal-professional-card text-center">
                <div className="w-16 h-16 legal-icon-bg rounded-xl flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl legal-subheading mb-2">{credential.title}</h3>
                <p className="legal-text-muted">{credential.description}</p>
              </div>
            )
          })}
        </div>

        {/* Client Testimonials */}
        <div className="mb-20">
          <h3 className="text-2xl legal-heading text-center mb-12">Client Testimonials</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="legal-professional-card">
                <div className="flex items-center mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="legal-subheading">{testimonial.name}</h4>
                    <p className="legal-text-muted text-sm">{testimonial.position}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-500 fill-current" />
                  ))}
                </div>
                <p className="legal-text">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Legal Associations */}
        <div className="legal-professional-card text-center">
          <h3 className="text-2xl legal-heading mb-8">Professional Memberships & Associations</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Replace with actual association logos */}
            <div className="legal-association-logo">
              <div className="w-24 h-24 legal-icon-bg rounded-xl flex items-center justify-center mx-auto">
                <Scale className="w-12 h-12 text-white" />
              </div>
              <p className="legal-text-muted mt-2">Bar Association</p>
            </div>
            <div className="legal-association-logo">
              <div className="w-24 h-24 legal-icon-bg rounded-xl flex items-center justify-center mx-auto">
                <Shield className="w-12 h-12 text-white" />
              </div>
              <p className="legal-text-muted mt-2">Legal Society</p>
            </div>
            <div className="legal-association-logo">
              <div className="w-24 h-24 legal-icon-bg rounded-xl flex items-center justify-center mx-auto">
                <Award className="w-12 h-12 text-white" />
              </div>
              <p className="legal-text-muted mt-2">Law Institute</p>
            </div>
            <div className="legal-association-logo">
              <div className="w-24 h-24 legal-icon-bg rounded-xl flex items-center justify-center mx-auto">
                <Users className="w-12 h-12 text-white" />
              </div>
              <p className="legal-text-muted mt-2">Legal Council</p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-20 text-center">
          <div className="legal-professional-card max-w-3xl mx-auto">
            <h3 className="text-3xl legal-heading mb-4">Ready to Get Started?</h3>
            <p className="legal-text mb-8">
              Contact our experienced legal team for a consultation tailored to your needs.
            </p>
            <button className="btn-legal-primary">
              Schedule Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
