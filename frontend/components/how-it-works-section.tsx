import { Scale, FileText, Phone, Users, MessageSquare } from "lucide-react"
import Image from "next/image"

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
    <section className="py-16 bg-[#F8F3EE]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#2A2A2A] mb-8 tracking-wide leading-tight">
            MEET OUR MOST TALENTED AND
            <br />
            QUALIFIED ATTORNEYS
          </h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left Side - Attorney Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-[#2A2A2A] mb-4">
                LEAD COUNSEL
                <br />
                VERIFIED ATTORNEYS
              </h3>
              <p className="text-[#8B7355] leading-relaxed mb-6">
                When looking for an attorney, you want a professional who has experience dealing with 
                cases like your case and maintains the highest ethical and customer service.
              </p>
              <button className="bg-[#8B7355] hover:bg-[#7A6449] text-white px-6 py-2 rounded text-sm font-medium transition-colors duration-300">
                Learn More
              </button>
            </div>

            {/* Attorney Image */}
            <div className="bg-[#E8DDD1] rounded-2xl p-6">
              <div className="relative w-full h-80 rounded-xl overflow-hidden">
                <Image
                  src="/images/img1.jpeg"
                  alt="Professional Attorney"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Center - Stats */}
          <div className="lg:col-span-1 flex flex-col justify-center items-center">
            <div className="text-center space-y-8">
              <div>
                <div className="text-5xl font-light text-[#2A2A2A] mb-2">90%</div>
                <div className="text-[#8B7355] text-sm">
                  Legal
                  <br />
                  Execution
                </div>
              </div>
              <div>
                <div className="text-5xl font-light text-[#2A2A2A] mb-2">98%</div>
                <div className="text-[#8B7355] text-sm">
                  Project
                  <br />
                  Success
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Benefits Card */}
          <div className="lg:col-span-1">
            <div className="bg-[#8B4513] text-white p-8 rounded-2xl h-full">
              <h3 className="text-2xl font-bold mb-6">
                WHAT BENEFITS
                <br />
                WILL YOU GET
                <br />
                FROM US?
              </h3>
              
              <p className="text-white/90 mb-8 leading-relaxed">
                We provide high quality law service for you with professional experience.
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Legal representation</h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    We provide efficient client service and we ensure that we are available.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Allegations</h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    We are going to to please clients and we ensure all the allegations.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Support</h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Our team is available 24/7 to provide and support.
                  </p>
                </div>
              </div>

              {/* Bottom Button and Image */}
              <div className="mt-8 flex justify-between items-end">
                <button className="bg-white text-[#8B4513] px-6 py-2 rounded font-medium text-sm hover:bg-gray-100 transition-colors duration-300">
                  Contact Us
                </button>
                
                <div className="w-16 h-20 relative">
                  <Image
                    src="/images/img1.jpeg"
                    alt="Attorney"
                    fill
                    className="object-cover rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
