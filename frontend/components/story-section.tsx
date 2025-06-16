"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

export default function StorySection() {
  return (
    <section className="py-20 bg-white dark:bg-[#0d1117] transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">
              Meet Rahul – An Entrepreneur Tangled in Legal Tape
            </h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-red-600 dark:text-red-300">Missed GST Filing</h3>
                  <p className="text-slate-600 dark:text-gray-400">Late penalty of ₹25,000 due to missed deadline</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-red-600 dark:text-red-300">Lawyer Delay</h3>
                  <p className="text-slate-600 dark:text-gray-400">Contract review took 3 weeks, client walked away</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-red-600 dark:text-red-300">MCA Compliance Issue</h3>
                  <p className="text-slate-600 dark:text-gray-400">Annual filing error led to company status issues</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-red-600 dark:text-red-300">Lost Investor</h3>
                  <p className="text-slate-600 dark:text-gray-400">
                    Due diligence failed because of incomplete documentation
                  </p>
                </div>
              </div>
            </div>

            <Button className="mt-8 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              See How LegalEase Helped Rahul <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-500/20 dark:to-purple-500/20 rounded-2xl p-8 shadow-lg">
              <div className="relative w-full h-96 rounded-xl overflow-hidden">
                <Image
                  src="/images/img1.jpeg"
                  alt="Rahul - Entrepreneur facing legal challenges"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                    const fallbackDiv = target.nextElementSibling as HTMLElement
                    if (fallbackDiv) fallbackDiv.style.display = "flex"
                  }}
                />
                {/* <div className="image-fallback absolute inset-0 hidden">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 bg-slate-300 dark:bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl">👨‍💼</span>
                    </div>
                    <p className="text-slate-500 dark:text-gray-400">Entrepreneur Story Illustration</p>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
