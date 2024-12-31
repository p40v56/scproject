import React from "react"
import { StatsGrid } from "./stats/StatsGrid"
import { CallbackRequestsList } from "./callback-requests/CallbackRequestsList"

const Overview = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Vue d'ensemble</h1>
      <StatsGrid />
      <div className="grid gap-4 md:grid-cols-2">
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
        <CallbackRequestsList />
      </div>
    </div>
  )
}

export default Overview