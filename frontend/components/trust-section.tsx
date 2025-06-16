import { Star, Shield, Award, Users } from "lucide-react"

export default function TrustSection() {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Founder, TechStart",
      content:
        "LegalEase saved us 3 weeks on our Series A documentation. The AI contract review is incredibly accurate.",
      rating: 5,
    },
    {
      name: "Rajesh Kumar",
      role: "CA, Kumar & Associates",
      content: "We use LegalEase for all our startup clients. The compliance tracking has eliminated missed deadlines.",
      rating: 5,
    },
    {
      name: "Anita Patel",
      role: "CEO, HealthTech Solutions",
      content: "The vernacular support helped us communicate complex legal terms to our regional team members.",
      rating: 5,
    },
  ]

  return (
    <section className="py-20 bg-white dark:bg-gray-900/50 transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Enhanced Trust Indicators */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">500+</div>
            <div className="text-slate-600 dark:text-gray-400 font-medium">Trusted Founders</div>
          </div>
          <div className="text-center">
            <Shield className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">100%</div>
            <div className="text-slate-600 dark:text-gray-400 font-medium">Legal Compliance</div>
          </div>
          <div className="text-center">
            <Award className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">Featured</div>
            <div className="text-slate-600 dark:text-gray-400 font-medium">Inc42, YourStory, ET</div>
          </div>
          <div className="text-center">
            <Star className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">4.9/5</div>
            <div className="text-slate-600 dark:text-gray-400 font-medium">User Rating</div>
          </div>
        </div>

        {/* Enhanced Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
            What Our Users Say
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="trust-card rounded-xl p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</div>
                  <div className="text-sm text-slate-500 dark:text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Security Highlight */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 rounded-2xl p-8 text-center border border-slate-200 dark:border-gray-700 shadow-lg">
          <Shield className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Enterprise-Grade Security</h3>
          <p className="text-slate-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your data is encrypted end-to-end, with complete audit trails and role-based access controls. We're SOC 2
            compliant and follow all Indian data protection regulations.
          </p>
        </div>
      </div>
    </section>
  )
}
