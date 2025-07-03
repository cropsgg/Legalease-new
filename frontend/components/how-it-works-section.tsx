import { Scale, FileText, Phone, Users, MessageSquare } from "lucide-react"

export default function HowItWorksSection() {
  const consultationSteps = [
    {
      icon: Phone,
      title: "Initial Consultation",
      description: "Schedule a confidential consultation with our experienced legal team",
    },
    {
      icon: FileText,
      title: "Case Evaluation",
      description: "Our attorneys thoroughly analyze your case and legal requirements",
    },
    {
      icon: Scale,
      title: "Legal Strategy",
      description: "We develop a comprehensive legal strategy tailored to your needs",
    },
    {
      icon: Users,
      title: "Expert Representation",
      description: "Our skilled attorneys represent your interests with dedication",
    },
    {
      icon: MessageSquare,
      title: "Regular Updates",
      description: "Stay informed with regular case progress updates and communication",
    },
  ]

  return (
    <section className="py-20 legal-section-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl legal-heading mb-4">Our Legal Consultation Process</h2>
          <div className="legal-divider mb-6"></div>
          <p className="text-xl legal-text max-w-2xl mx-auto">
            A systematic approach to handling your legal matters with expertise and professionalism
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-600 to-amber-800 -translate-y-1/2" />

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
            {consultationSteps.map((step, index) => {
              const IconComponent = step.icon
              return (
                <div key={index} className="relative text-center">
                  {/* Step Circle */}
                  <div className="w-20 h-20 legal-icon-bg rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>

                  {/* Step Number */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center text-white font-bold text-sm z-20">
                    {index + 1}
                  </div>

                  <h3 className="text-lg legal-subheading mb-2">{step.title}</h3>
                  <p className="legal-text-muted text-sm">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-20 grid md:grid-cols-2 gap-12">
          <div className="legal-professional-card">
            <h3 className="text-2xl legal-heading mb-4">Why Choose Our Process?</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 legal-icon-bg rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Scale className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h4 className="legal-subheading mb-1">Professional Excellence</h4>
                  <p className="legal-text-muted text-sm">Our team maintains the highest standards of legal practice</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 legal-icon-bg rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Users className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h4 className="legal-subheading mb-1">Client-Focused Approach</h4>
                  <p className="legal-text-muted text-sm">Your needs and objectives are our top priority</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 legal-icon-bg rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <MessageSquare className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h4 className="legal-subheading mb-1">Clear Communication</h4>
                  <p className="legal-text-muted text-sm">Regular updates and transparent communication throughout</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="legal-professional-card">
            <h3 className="text-2xl legal-heading mb-4">What to Expect</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 legal-icon-bg rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <FileText className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h4 className="legal-subheading mb-1">Thorough Documentation</h4>
                  <p className="legal-text-muted text-sm">Comprehensive handling of all legal documentation</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 legal-icon-bg rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Scale className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h4 className="legal-subheading mb-1">Strategic Advocacy</h4>
                  <p className="legal-text-muted text-sm">Strong representation of your legal interests</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 legal-icon-bg rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Phone className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h4 className="legal-subheading mb-1">Ongoing Support</h4>
                  <p className="legal-text-muted text-sm">Continuous legal guidance and assistance</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <button className="btn-legal-primary">
            Schedule Your Consultation
          </button>
        </div>
      </div>
    </section>
  )
}
