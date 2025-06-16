import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import ProblemSection from "@/components/problem-section"
import HowItWorksSection from "@/components/how-it-works-section"
import StorySection from "@/components/story-section"
import PricingSection from "@/components/pricing-section"
import TrustSection from "@/components/trust-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117] transition-colors duration-300">
      <HeroSection />
      <FeaturesSection />
      <ProblemSection />
      <HowItWorksSection />
      <StorySection />
      <PricingSection />
      <TrustSection />
      <Footer />
    </div>
  )
}
