import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentRegistration from "@/components/student/StudentRegistration";
import StudentFirstLogin from "@/components/student/StudentFirstLogin";
import StudentDashboard from "@/components/student/StudentDashboard";

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
    <DashboardLayout>
      {!isRegistered ? (
        <StudentRegistration onComplete={handleRegistrationComplete} />
      ) : isFirstLogin && !hasCompletedFirstLogin ? (
        <StudentFirstLogin onComplete={handleFirstLoginComplete} />
      ) : (
        <StudentDashboard />
      )}
    </DashboardLayout>
  );
};

export default StudentSpace;