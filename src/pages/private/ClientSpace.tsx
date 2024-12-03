import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FirstLogin from "@/components/client/FirstLogin";
import ClientDashboard from "@/components/client/ClientDashboard";

const ClientSpace = () => {
  const [isFirstLogin, setIsFirstLogin] = useState(true);

  return (
    <DashboardLayout>
      {isFirstLogin ? (
        <FirstLogin onComplete={() => setIsFirstLogin(false)} />
      ) : (
        <div className="container mx-auto p-6 space-y-6">
          <h1 className="text-2xl font-bold">Espace Client</h1>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="study">Mon étude</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="profile">Profil</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <ClientDashboard />
            </TabsContent>
            <TabsContent value="study">
              <div className="text-center p-8 text-muted-foreground">
                Suivi de l'étude en cours de développement
              </div>
            </TabsContent>
            <TabsContent value="documents">
              <div className="text-center p-8 text-muted-foreground">
                Documents en cours de développement
              </div>
            </TabsContent>
            <TabsContent value="profile">
              <div className="text-center p-8 text-muted-foreground">
                Profil en cours de développement
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ClientSpace;