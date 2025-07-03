"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function PricingSection() {
  const plans = [
    {
      name: "Initial Consultation",
      price: "Free",
      description: "Understand your legal needs",
      features: [
        "30-minute consultation",
        "Case evaluation",
        "Legal strategy overview",
        "Cost estimate",
        "Next steps guidance",
      ],
      buttonText: "Schedule Consultation",
      popular: false,
    },
    {
      name: "Professional Package",
      price: "$299",
      description: "Comprehensive legal support",
      features: [
        "Full case review",
        "Document preparation",
        "Legal representation",
        "Court filing assistance",
        "Regular case updates",
        "Priority support",
      ],
      buttonText: "Get Started",
      popular: true,
    },
    {
      name: "Enterprise Solution",
      price: "Custom",
      description: "Tailored legal services",
      features: [
        "Dedicated legal team",
        "24/7 priority access",
        "Custom legal strategy",
        "Compliance monitoring",
        "Regular legal audits",
        "Board meeting attendance",
      ],
      buttonText: "Contact Us",
      popular: false,
    },
  ]

  return (
    <section className="py-20 legal-section-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl legal-heading mb-4">
            Legal Service Packages
          </h2>
          <div className="legal-divider mb-6"></div>
          <p className="text-xl legal-text max-w-2xl mx-auto">
            Choose the right legal service package for your needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`legal-professional-card relative ${
                plan.popular ? "border-amber-500 shadow-amber-100" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 right-4">
                  <div className="bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl legal-subheading mb-2">{plan.name}</h3>
                <div className="text-4xl legal-heading mb-2">{plan.price}</div>
                <p className="legal-text-muted">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <div className="w-5 h-5 legal-icon-bg rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="legal-text">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="text-center">
                <Button
                  className={`btn-legal-${plan.popular ? "primary" : "secondary"} w-full`}
                >
                  {plan.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-20 grid md:grid-cols-2 gap-12">
          <div className="legal-professional-card">
            <h3 className="text-2xl legal-heading mb-4">Custom Legal Solutions</h3>
            <p className="legal-text mb-6">
              Need a customized legal service package? Our team can create a tailored solution that meets your specific requirements.
            </p>
            <Button className="btn-legal-primary">Request Custom Quote</Button>
          </div>

          <div className="legal-professional-card">
            <h3 className="text-2xl legal-heading mb-4">Legal Service Guarantee</h3>
            <p className="legal-text mb-6">
              We are committed to providing the highest quality legal services. Our work is backed by our satisfaction guarantee.
            </p>
            <Button className="btn-legal-secondary">Learn More</Button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl legal-heading mb-4">Frequently Asked Questions</h3>
            <p className="legal-text-muted">
              Find answers to common questions about our legal service packages
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="legal-professional-card">
              <h4 className="legal-subheading mb-2">What's included in the initial consultation?</h4>
              <p className="legal-text-muted">
                The initial consultation includes a thorough discussion of your legal needs, preliminary case evaluation, and a proposed strategy for moving forward.
              </p>
            </div>

            <div className="legal-professional-card">
              <h4 className="legal-subheading mb-2">How long are the service contracts?</h4>
              <p className="legal-text-muted">
                Service contracts are flexible and can be tailored to your needs. We offer month-to-month, annual, and custom-term agreements.
              </p>
            </div>

            <div className="legal-professional-card">
              <h4 className="legal-subheading mb-2">Can I upgrade my package?</h4>
              <p className="legal-text-muted">
                Yes, you can upgrade your legal service package at any time to access additional services and support.
              </p>
            </div>

            <div className="legal-professional-card">
              <h4 className="legal-subheading mb-2">What if I need additional services?</h4>
              <p className="legal-text-muted">
                Additional legal services can be added à la carte to any package based on your specific needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
