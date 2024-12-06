import { Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import MemberSidebar from "@/components/member/MemberSidebar";

const MemberSpace = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <MemberSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto p-6">
            <Routes>
              <Route
                path="/"
                element={
                  <div className="space-y-4">
                    <h1 className="text-2xl font-bold">Bienvenue dans l'espace membre</h1>
                    <p className="text-muted-foreground">
                      Sélectionnez une option dans le menu pour commencer.
                    </p>
                  </div>
                }
              />
              {/* Les routes pour les différentes sections seront ajoutées ici */}
            </Routes>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MemberSpace;