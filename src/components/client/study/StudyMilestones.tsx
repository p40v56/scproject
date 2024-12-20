import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock } from "lucide-react"

interface Milestone {
  date: string;
  title: string;
  description: string;
  type?: 'meeting' | 'deadline';
  time?: string;
}

interface StudyMilestonesProps {
  milestones: Milestone[];
}

const StudyMilestones = ({ milestones }: StudyMilestonesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prochains rendez-vous</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {milestones.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucun rendez-vous à venir
            </p>
          ) : (
            milestones.map((milestone, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="font-medium flex items-center gap-2">
                      {milestone.type === 'meeting' && (
                        <Calendar className="h-4 w-4 text-blue-500" />
                      )}
                      {milestone.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {milestone.description}
                    </p>
                    {milestone.time && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {milestone.time}
                      </p>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {milestone.date}
                  </span>
                </div>
                {index < milestones.length - 1 && (
                  <Separator className="my-2" />
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default StudyMilestones