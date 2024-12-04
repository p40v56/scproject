import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StudentDashboard = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Tableau de bord étudiant</h1>

      <Tabs defaultValue="missions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="missions">Missions</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="studies">Études en cours</TabsTrigger>
        </TabsList>

        <TabsContent value="missions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Offres de missions disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Aucune mission disponible pour le moment.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mes documents</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-blue-600 hover:underline">
                    Justificatif de paiement
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline">
                    Convention étudiante
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline">
                    Bulletins de versement
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent>
              {/* TODO: Add profile edit form */}
              <p className="text-muted-foreground">
                Formulaire de modification du profil à venir.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="studies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Études en cours</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Aucune étude en cours.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;