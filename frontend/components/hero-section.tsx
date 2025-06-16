import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-blue-950/20 dark:to-purple-950/20">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-purple-100/40 dark:from-blue-500/10 dark:via-transparent dark:to-purple-500/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 dark:from-blue-500/20 dark:to-purple-500/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-slate-900 dark:text-white">
            Focus on your startup's growth –{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 bg-clip-text text-transparent">
              let AI handle the legal work
            </span>
          </h1>

          {/* Enhanced Subtext */}
          <p className="text-xl md:text-2xl text-slate-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            LegalEase automates your paperwork and compliance: draft proposals & contracts in minutes, analyze
            agreements with AI, track all regulatory deadlines, even handle secure payments – all in one platform. Built
            for the Indian startup ecosystem, with trust and accuracy at its core.
          </p>

          {/* Enhanced Feature Highlights */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="enhanced-card p-6">
              <CheckCircle className="w-8 h-8 text-emerald-500 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-white">
                Draft proposals, agreements, and emails 10× faster with AI
              </h3>
            </div>
            <div className="enhanced-card p-6">
              <CheckCircle className="w-8 h-8 text-emerald-500 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-white">
                Stay 100% compliant with automatic tracking of GST, MCA, labor laws
              </h3>
            </div>
            <div className="enhanced-card p-6">
              <CheckCircle className="w-8 h-8 text-emerald-500 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-white">
                Get paid on time with integrated, secure payment workflows
              </h3>
            </div>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button size="lg" className="btn-primary text-lg px-8 py-4">
              <Link href="/demo">Get Demo Access →</Link>
            </Button>
            <Button size="lg" className="btn-secondary text-lg px-8 py-4">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>

          {/* Trust Statement */}
          <p className="text-slate-500 dark:text-gray-400 text-sm">No credit card needed, no lawyers required.</p>
        </div>
      </div>
    </section>
  )
}
