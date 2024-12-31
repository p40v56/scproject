import { BarChart3, Users, FileText, TrendingUp } from "lucide-react"
import { StatCard } from "./StatCard"

const stats = [
  {
    title: "Études en cours",
    value: "12",
    icon: FileText,
    trend: "+2 ce mois",
    color: "text-blue-600",
  },
  {
    title: "Chargés d'études",
    value: "24",
    icon: Users,
    trend: "+4 ce mois",
    color: "text-green-600",
  },
  {
    title: "Chiffre d'affaires",
    value: "45K€",
    icon: TrendingUp,
    trend: "+12% vs n-1",
    color: "text-purple-600",
  },
  {
    title: "Taux de satisfaction",
    value: "98%",
    icon: BarChart3,
    trend: "+2pts vs n-1",
    color: "text-orange-600",
  },
]

export const StatsGrid = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}