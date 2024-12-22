import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface StudyHeaderProps {
  currentPhase: string
  progress: number
  consultant: {
    name: string
    email: string
  }
  budget: string
}

const StudyHeader = ({ currentPhase, progress, consultant, budget }: StudyHeaderProps) => {
  const formatBudget = (budget: string) => {
    const num = parseInt(budget);
    if (isNaN(num)) return '0 €';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Phase actuelle</p>
          <p className="text-lg font-semibold">{currentPhase}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Progression globale</p>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">{Math.round(progress)}%</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Chargé de projet</p>
          <p className="text-lg font-semibold">{consultant.name}</p>
          <p className="text-sm text-muted-foreground">{consultant.email}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Budget</p>
          <p className="text-lg font-semibold">{formatBudget(budget)}</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default StudyHeader