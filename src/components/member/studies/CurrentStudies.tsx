import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";

const studies = [
  {
    id: 1,
    title: "Étude de marché secteur luxe",
    progress: 75,
    consultant: "Marie Martin",
    deadline: "15/04/2024",
    status: "En cours",
  },
  {
    id: 2,
    title: "Analyse financière startup",
    progress: 30,
    consultant: "Lucas Dubois",
    deadline: "20/04/2024",
    status: "En cours",
  },
];

export default function CurrentStudies() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Études en cours</h2>
        <Button>
          <ClipboardList className="mr-2 h-4 w-4" />
          Nouvelle étude
        </Button>
      </div>

      <div className="grid gap-4">
        {studies.map((study) => (
          <Card key={study.id}>
            <CardHeader>
              <CardTitle>{study.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Progression</span>
                    <span className="text-sm font-medium">{study.progress}%</span>
                  </div>
                  <Progress value={study.progress} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Consultant</p>
                    <p className="text-sm text-muted-foreground">
                      {study.consultant}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Date limite</p>
                    <p className="text-sm text-muted-foreground">
                      {study.deadline}
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Voir les détails
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}