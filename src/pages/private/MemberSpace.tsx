import { Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import MemberSidebar from "@/components/member/MemberSidebar";
import AccessManagement from "@/components/member/access/AccessManagement";
import MissionsList from "@/components/member/missions/MissionsList";
import CommonIntranet from "@/components/member/intranet/CommonIntranet";
import JuniorIntranet from "@/components/member/intranet/JuniorIntranet";
import GroupSpace from "@/components/member/group/GroupSpace";
import CurrentStudies from "@/components/member/studies/CurrentStudies";
import MemberCalendar from "@/components/member/calendar/MemberCalendar";
import Objectives from "@/components/member/objectives/Objectives";
import Handover from "@/components/member/handover/Handover";

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
                    <h1 className="text-2xl font-bold">
                      Bienvenue dans l'espace membre
                    </h1>
                    <p className="text-muted-foreground">
                      Sélectionnez une option dans le menu pour commencer.
                    </p>
                  </div>
                }
              />
              <Route path="/access-management" element={<AccessManagement />} />
              <Route path="/missions" element={<MissionsList />} />
              <Route path="/common-intranet" element={<CommonIntranet />} />
              <Route path="/junior-intranet" element={<JuniorIntranet />} />
              <Route path="/group-space" element={<GroupSpace />} />
              <Route path="/current-studies" element={<CurrentStudies />} />
              <Route path="/calendar" element={<MemberCalendar />} />
              <Route path="/objectives" element={<Objectives />} />
              <Route path="/handover" element={<Handover />} />
            </Routes>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default MemberSpace;