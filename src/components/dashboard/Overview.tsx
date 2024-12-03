import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, FileText, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

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

const Overview = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Vue d'ensemble</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={cn("w-4 h-4", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Études récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <div>
                    <p className="font-medium">Étude {i}</p>
                    <p className="text-sm text-muted-foreground">Client {i}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                  <div>
                    <p className="font-medium">Action {i}</p>
                    <p className="text-sm text-muted-foreground">Il y a {i}h</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Overview