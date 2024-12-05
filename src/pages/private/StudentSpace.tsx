import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import StudentRegistration from "@/components/student/StudentRegistration";
import StudentFirstLogin from "@/components/student/StudentFirstLogin";
import StudentDashboard from "@/components/student/StudentDashboard";
import StudentProfile from "@/components/student/StudentProfile";
import StudentDocuments from "@/components/student/StudentDocuments";
import StudentMissions from "@/components/student/StudentMissions";
import CurrentStudies from "@/components/student/CurrentStudies";
import CompletedStudies from "@/components/student/CompletedStudies";
import StudentSidebar from "@/components/student/StudentSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const StudentSpace = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(true);
  const [hasCompletedFirstLogin, setHasCompletedFirstLogin] = useState(false);

  const handleRegistrationComplete = () => {
    setIsRegistered(true);
  };

  const handleFirstLoginComplete = () => {
    setHasCompletedFirstLogin(true);
    setIsFirstLogin(false);
  };

  if (!isRegistered) {
    return <StudentRegistration onComplete={handleRegistrationComplete} />;
  }

  if (isFirstLogin && !hasCompletedFirstLogin) {
    return <StudentFirstLogin onComplete={handleFirstLoginComplete} />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <StudentSidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<StudentDashboard />} />
            <Route path="/profile" element={<StudentProfile />} />
            <Route path="/documents" element={<StudentDocuments />} />
            <Route path="/missions" element={<StudentMissions />} />
            <Route path="/current-studies" element={<CurrentStudies />} />
            <Route path="/completed-studies" element={<CompletedStudies />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default StudentSpace;