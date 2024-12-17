import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AlumniSidebar from "@/components/alumni/AlumniSidebar";
import AlumniFirstLogin from "@/components/alumni/AlumniFirstLogin";
import AlumniDashboard from "@/components/alumni/AlumniDashboard";
import AlumniBlog from "@/components/alumni/AlumniBlog";
import AlumniDirectory from "@/components/alumni/AlumniDirectory";
import AlumniArchives from "@/components/alumni/AlumniArchives";
import AlumniEvents from "@/components/alumni/AlumniEvents";
import AlumniSeniorCommittee from "@/components/alumni/AlumniSeniorCommittee";
import AlumniDonate from "@/components/alumni/AlumniDonate";
import AlumniContact from "@/components/alumni/AlumniContact";

const AlumniSpace = () => {
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  if (isFirstLogin) {
    return (
      <AlumniFirstLogin
        onComplete={(data) => {
          setIsFirstLogin(false);
        }}
      />
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AlumniSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto p-6">
            <Routes>
              <Route path="/" element={<Navigate to="dashboard" replace />} />
              <Route path="/dashboard" element={<AlumniDashboard />} />
              <Route path="/blog" element={<AlumniBlog />} />
              <Route path="/directory" element={<AlumniDirectory />} />
              <Route path="/archives" element={<AlumniArchives />} />
              <Route path="/events" element={<AlumniEvents />} />
              <Route path="/senior-committee" element={<AlumniSeniorCommittee />} />
              <Route path="/donate" element={<AlumniDonate />} />
              <Route path="/contact" element={<AlumniContact />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AlumniSpace;