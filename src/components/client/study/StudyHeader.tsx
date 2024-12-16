import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StudyHeaderProps {
  currentPhase: string;
  progress: number;
  consultant: {
    name: string;
    phone: string;
    email: string;
  };
  budget: string;
}

const StudyHeader = ({ currentPhase, progress, consultant, budget }: StudyHeaderProps) => {
  const formatBudget = (budget: string) => {
    return budget.replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €"
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">État de l'étude</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentPhase}</div>
          <p className="text-xs text-muted-foreground">{progress}% complété</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Chargé de projet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{consultant.name}</div>
          <div className="space-y-1 mt-2">
            <p className="text-sm text-muted-foreground">{consultant.phone}</p>
            <p className="text-sm text-muted-foreground">{consultant.email}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatBudget(budget)}</div>
          <p className="text-xs text-muted-foreground">Budget total</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default StudyHeader