import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";

const objectives = [
  {
    id: 1,
    title: "Chiffre d'affaires Q2 2024",
    target: "50000€",
    current: "35000€",
    progress: 70,
    deadline: "30/06/2024",
  },
  {
    id: 2,
    title: "Nombre d'études",
    target: "15",
    current: "8",
    progress: 53,
    deadline: "30/06/2024",
  },
  {
    id: 3,
    title: "Satisfaction client",
    target: "4.5/5",
    current: "4.2/5",
    progress: 93,
    deadline: "30/06/2024",
  },
];

export default function Objectives() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Objectifs</h2>
        <Button>
          <Target className="mr-2 h-4 w-4" />
          Nouvel objectif
        </Button>
      </div>

      <div className="grid gap-4">
        {objectives.map((objective) => (
          <Card key={objective.id}>
            <CardHeader>
              <CardTitle>{objective.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">
                      {objective.current} / {objective.target}
                    </span>
                    <span className="text-sm font-medium">
                      {objective.progress}%
                    </span>
                  </div>
                  <Progress value={objective.progress} className="h-2" />
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Date limite : {objective.deadline}
                  </p>
                  <Button variant="outline" size="sm">
                    Détails
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}