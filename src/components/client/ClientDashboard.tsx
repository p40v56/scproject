import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, AlertCircle } from "lucide-react";
import StudyProgress from "./StudyProgress";
import Documents from "./Documents";
import Profile from "./Profile";
import Appointments from "./Appointments";

const ClientDashboard = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">État de l'étude</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">En cours</div>
            <p className="text-xs text-muted-foreground">Phase: Quantitative</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Convention, factures, rapports
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Prochain RDV</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15 Avril 2024</div>
            <p className="text-xs text-muted-foreground">
              Présentation des résultats
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="study" className="space-y-4">
        <TabsList>
          <TabsTrigger value="study">Mon étude</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="appointments">Rendez-vous</TabsTrigger>
          <TabsTrigger value="profile">Profil</TabsTrigger>
        </TabsList>

        <TabsContent value="study">
          <StudyProgress />
        </TabsContent>

        <TabsContent value="documents">
          <Documents />
        </TabsContent>

        <TabsContent value="appointments">
          <Appointments />
        </TabsContent>

        <TabsContent value="profile">
          <Profile />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDashboard;