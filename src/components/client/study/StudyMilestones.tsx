import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface Milestone {
  date: string;
  title: string;
  description: string;
}

interface StudyMilestonesProps {
  milestones: Milestone[];
}

const StudyMilestones = ({ milestones }: StudyMilestonesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prochaines étapes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{milestone.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {milestone.description}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  {milestone.date}
                </span>
              </div>
              {index < milestones.length - 1 && (
                <Separator className="my-2" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default StudyMilestones