import { Progress } from "@/components/ui/progress"

interface Consultant {
  name: string;
  email: string;
}

interface StudyHeaderProps {
  currentPhase: string;
  progress: number;
  consultant: Consultant;
  budget: string;
}

const StudyHeader = ({ currentPhase, progress, consultant, budget }: StudyHeaderProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="p-4 border rounded-lg space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Phase actuelle</p>
        <p className="text-2xl font-bold">{currentPhase}</p>
      </div>
      <div className="p-4 border rounded-lg space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Progression globale</p>
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground">{Math.round(progress)}%</p>
      </div>
      <div className="p-4 border rounded-lg space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Consultant assigné</p>
        <p className="text-lg font-semibold">{consultant.name}</p>
        <p className="text-sm text-muted-foreground">{consultant.email}</p>
      </div>
      <div className="p-4 border rounded-lg space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Budget</p>
        <p className="text-2xl font-bold">{budget}€</p>
      </div>
    </div>
  )
}

export default StudyHeader