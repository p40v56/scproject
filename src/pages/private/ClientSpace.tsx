import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import ClientSidebar from "@/components/client/ClientSidebar";
import FirstLogin from "@/components/client/FirstLogin";
import ClientDashboard from "@/components/client/ClientDashboard";
import Documents from "@/components/client/Documents";
import Appointments from "@/components/client/Appointments";
import { SidebarProvider } from "@/components/ui/sidebar";

const ClientSpace = () => {
  const [isFirstLogin, setIsFirstLogin] = useState(true);

  if (isFirstLogin) {
    return <FirstLogin onComplete={() => setIsFirstLogin(false)} />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <ClientSidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<ClientDashboard />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route
              path="/study"
              element={
                <div className="text-center p-8 text-muted-foreground">
                  Suivi de l'étude en cours de développement
                </div>
              }
            />
            <Route
              path="/messages"
              element={
                <div className="text-center p-8 text-muted-foreground">
                  Messagerie en cours de développement
                </div>
              }
            />
            <Route
              path="/alerts"
              element={
                <div className="text-center p-8 text-muted-foreground">
                  Système d'alertes en cours de développement
                </div>
              }
            />
            <Route
              path="/settings"
              element={
                <div className="text-center p-8 text-muted-foreground">
                  Paramètres en cours de développement
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ClientSpace;