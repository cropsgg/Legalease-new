import { Clock, AlertTriangle, DollarSign, TrendingDown } from "lucide-react"

export default function ProblemSection() {
  const problems = [
    {
      icon: Clock,
      title: "Time Waste",
      description: "Founders waste time on contracts, compliance, and government filings",
    },
    {
      icon: AlertTriangle,
      title: "Legal Mistakes",
      description: "Legal mistakes delay funding or invite penalties",
    },
    {
      icon: DollarSign,
      title: "High Costs",
      description: "Startups spend 5-10% of funds on legal buywork",
    },
    {
      icon: TrendingDown,
      title: "Growth Impact",
      description: "Compliance issues can slow growth by up to 30%",
    },
  ]

  return (
    <section className="py-20 bg-slate-100 dark:bg-gray-900/50 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
            The Startup Legal Gauntlet
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((problem, index) => {
            const IconComponent = problem.icon
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800/50 rounded-xl p-6 border border-slate-200 dark:border-gray-700 text-center hover:border-red-300 dark:hover:border-red-500/50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="w-16 h-16 bg-red-50 dark:bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200 dark:border-red-500/30">
                  <IconComponent className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-red-700 dark:text-red-300">{problem.title}</h3>
                <p className="text-slate-600 dark:text-gray-400">{problem.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
