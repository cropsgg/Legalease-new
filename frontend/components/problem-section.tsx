import { Scale, Shield, Award, Users } from "lucide-react"

export default function ProblemSection() {
  const legalExpertise = [
    {
      icon: Scale,
      title: "Legal Expertise",
      description: "Our attorneys have decades of experience in complex legal matters",
    },
    {
      icon: Shield,
      title: "Client Protection",
      description: "We ensure your rights and interests are fully protected",
    },
    {
      icon: Award,
      title: "Recognition",
      description: "Award-winning legal services with proven track record",
    },
    {
      icon: Users,
      title: "Personal Attention",
      description: "Dedicated legal team for your specific case needs",
    },
  ]

  return (
    <section className="py-20 legal-section-alternate transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl legal-heading mb-4">
            THE AREA WHERE WE PRACTISE LAW
          </h2>
          <div className="legal-divider mb-6"></div>
          <p className="text-xl legal-text max-w-3xl mx-auto">
            We offer a wide range of services to our customers and we go the extra length to make sure justice is served.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {legalExpertise.map((expertise, index) => {
            const IconComponent = expertise.icon
            return (
              <div
                key={index}
                className="legal-professional-card hover:border-amber-300 transition-all duration-300"
              >
                <div className="w-16 h-16 legal-icon-bg rounded-xl flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl legal-subheading mb-3">{expertise.title}</h3>
                <p className="legal-text-muted">{expertise.description}</p>
              </div>
            )
          })}
        </div>

        {/* Legal Practice Areas */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="legal-feature-card">
            <div className="w-16 h-16 legal-icon-bg rounded-xl flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="legal-subheading text-xl mb-3">Business Law</h3>
            <p className="legal-text-muted">
              These are various forms of legal business services ranging from the sole trader to the largest international companies.
            </p>
          </div>

          <div className="legal-feature-card">
            <div className="w-16 h-16 legal-icon-bg rounded-xl flex items-center justify-center mb-4">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <h3 className="legal-subheading text-xl mb-3">Criminal Law</h3>
            <p className="legal-text-muted">
              Criminal law is the body of law that relates to crime. Concerns perceived as threatening harmful.
            </p>
          </div>

          <div className="legal-feature-card">
            <div className="w-16 h-16 legal-icon-bg rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="legal-subheading text-xl mb-3">Family Law</h3>
            <p className="legal-text-muted">
              Family law is a legal practice area that focuses on issues involving family relationships.
            </p>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-20 text-center">
          <div className="legal-professional-card max-w-3xl mx-auto">
            <h3 className="text-3xl legal-heading mb-4">Need Legal Consultation?</h3>
            <p className="legal-text mb-8">
              Contact our experienced attorneys for a comprehensive legal solution tailored to your needs.
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
