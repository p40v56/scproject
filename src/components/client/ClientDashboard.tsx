import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, AlertCircle, MessageSquare, ChartBar } from "lucide-react";
import StudyProgress from "./StudyProgress";
import { toast } from "sonner";

const ClientDashboard = () => {
  const studyPhases: {
    name: string;
    status: "completed" | "in-progress" | "pending";
    progress: number;
  }[] = [
    { name: "Phase préparatoire", status: "completed", progress: 100 },
    { name: "Phase quantitative", status: "in-progress", progress: 60 },
    { name: "Phase qualitative", status: "pending", progress: 0 },
    { name: "Présentation finale", status: "pending", progress: 0 },
  ];

  const handleAlert = () => {
    toast.success("Alerte envoyée à l'équipe");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">État de l'étude</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Phase quantitative</div>
            <p className="text-xs text-muted-foreground">60% complété</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Prochain rendez-vous</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15 Avril 2024</div>
            <p className="text-xs text-muted-foreground">Présentation intermédiaire</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Documents disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Nouveaux documents</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Progression de l'étude</CardTitle>
          </CardHeader>
          <CardContent>
            <StudyProgress phases={studyPhases} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Planifier un rendez-vous
            </Button>
            <Button className="w-full" variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              Contacter l'équipe
            </Button>
            <Button className="w-full" variant="outline" onClick={handleAlert}>
              <AlertCircle className="mr-2 h-4 w-4" />
              Signaler un problème
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;