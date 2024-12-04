import { useState } from "react";
import StudentRegistration from "@/components/student/StudentRegistration";
import StudentFirstLogin from "@/components/student/StudentFirstLogin";
import StudentDashboard from "@/components/student/StudentDashboard";
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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {(isRegistered && !isFirstLogin) && <StudentSidebar />}
        <main className="flex-1">
          {!isRegistered ? (
            <StudentRegistration onComplete={handleRegistrationComplete} />
          ) : isFirstLogin && !hasCompletedFirstLogin ? (
            <StudentFirstLogin onComplete={handleFirstLoginComplete} />
          ) : (
            <StudentDashboard />
          )}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default StudentSpace;