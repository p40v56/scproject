import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AlumniSidebar from "@/components/alumni/AlumniSidebar";
import AlumniFirstLogin from "@/components/alumni/AlumniFirstLogin";

const AlumniSpace = () => {
  const [isFirstLogin, setIsFirstLogin] = useState(true);

  if (isFirstLogin) {
    return <AlumniFirstLogin onComplete={() => setIsFirstLogin(false)} />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AlumniSidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route
              path="/dashboard"
              element={
                <div>
                  <h1 className="text-2xl font-bold">Tableau de bord Alumni</h1>
                </div>
              }
            />
            <Route
              path="/blog"
              element={
                <div>
                  <h1 className="text-2xl font-bold">Blog & Actualités</h1>
                </div>
              }
            />
            {/* Autres routes à implémenter */}
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AlumniSpace;