import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import { Button } from "@/components/ui/button";
import { AlertCircle, Download } from "lucide-react";

const StudyProgress = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Progression de l'étude</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Phase actuelle: Quantitative</h3>
                <p className="text-sm text-muted-foreground">
                  En cours - 75% complété
                </p>
              </div>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Résultats bruts
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div>
                  <p className="font-medium">Phase préparatoire</p>
                  <p className="text-sm text-muted-foreground">Terminée</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <div>
                  <p className="font-medium">Phase quantitative</p>
                  <p className="text-sm text-muted-foreground">En cours</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-gray-300 rounded-full" />
                <div>
                  <p className="font-medium">Phase qualitative</p>
                  <p className="text-sm text-muted-foreground">À venir</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contacts de l'étude</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="font-medium">Chargé d'études principal</p>
              <p className="text-sm">Jean Dupont</p>
              <p className="text-sm text-muted-foreground">
                jean.dupont@junior-entreprise.com
              </p>
            </div>
            <div>
              <p className="font-medium">Responsable qualité</p>
              <p className="text-sm">Marie Martin</p>
              <p className="text-sm text-muted-foreground">
                marie.martin@junior-entreprise.com
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full gap-2">
        <AlertCircle className="w-4 h-4" />
        Signaler un problème
      </Button>
    </div>
  );
};

export default StudyProgress;