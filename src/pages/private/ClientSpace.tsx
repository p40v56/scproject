import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AuthForm } from "@/components/auth/AuthForm";
import ClientSidebar from "@/components/client/ClientSidebar";
import FirstLogin from "@/components/client/FirstLogin";
import ClientDashboard from "@/components/client/ClientDashboard";
import Documents from "@/components/client/Documents";
import Appointments from "@/components/client/Appointments";
import StudyDetails from "@/components/client/StudyDetails";
import Messages from "@/components/client/Messages";
import Alerts from "@/components/client/Alerts";
import Settings from "@/components/client/Settings";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";

const ClientSpaceContent = () => {
  const [isFirstLogin, setIsFirstLogin] = useState(true);
  const { user } = useAuth();

  if (!user) {
    return <AuthForm />;
  }

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
            <Route path="/study" element={<StudyDetails />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
};

const ClientSpace = () => {
  return (
    <AuthProvider>
      <ClientSpaceContent />
    </AuthProvider>
  );
};

export default ClientSpace;