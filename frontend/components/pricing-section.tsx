import { Button } from "@/components/ui/button"
import { Check, Star } from "lucide-react"
import Link from "next/link"

export default function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "",
      description: "Perfect for early-stage startups",
      features: [
        "3 AI document workflows per month",
        "Basic compliance tracking",
        "Email support",
        "Standard templates",
        "Basic deadline alerts",
      ],
      cta: "Get Started Free",
      popular: false,
    },
    {
      name: "Pro",
      price: "₹699",
      period: "/month",
      description: "Best for growing startups",
      features: [
        "Unlimited AI document generation",
        "Advanced compliance tracking",
        "Priority support + WhatsApp",
        "Custom templates",
        "Smart deadline management",
        "10 government filings included",
        "Multi-language support",
        "Payment workflow integration",
      ],
      cta: "Start Pro Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For established businesses",
      features: [
        "Everything in Pro",
        "API access",
        "Team collaboration tools",
        "Custom integrations",
        "Dedicated account manager",
        "SLA guarantee",
        "Advanced analytics",
        "White-label options",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ]

  return (
    <section className="py-20 bg-white dark:bg-[#0d1117] transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose the plan that fits your startup's needs. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white dark:bg-gray-800/50 rounded-2xl p-8 border shadow-lg hover:shadow-xl transition-all duration-300 ${
                plan.popular
                  ? "border-blue-500 dark:border-blue-400 scale-105 shadow-blue-500/20 dark:shadow-blue-400/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center shadow-lg">
                    <Star className="w-4 h-4 mr-1" />
                    Best for Startups
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                  <span className="text-gray-500 dark:text-gray-400">{plan.period}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className={`w-full ${plan.popular ? "btn-primary" : "btn-secondary"}`} size="lg">
                <Link href={plan.name === "Enterprise" ? "/contact" : "/signup"}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            All plans include 14-day free trial • No setup fees • Cancel anytime
          </p>
          <Button className="btn-outline" size="lg">
            <Link href="/pricing">View Detailed Pricing →</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
