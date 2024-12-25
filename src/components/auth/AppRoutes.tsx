import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Index from "@/pages/Index";
import ClientSpace from "@/pages/private/ClientSpace";
import StudentSpace from "@/pages/private/StudentSpace";
import AlumniSpace from "@/pages/private/AlumniSpace";
import MemberSpace from "@/pages/private/MemberSpace";
import PrivateRoute from "./PrivateRoute";

const AppRoutes = () => {
  const { session, userProfile, isLoading } = useAuth();
  console.log("Auth state:", { session, userProfile, isLoading });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  if (!userProfile) {
    console.error("No user profile found for authenticated user");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Erreur de chargement du profil</div>
      </div>
    );
  }

  const getRedirectPath = () => {
    if (userProfile.roles?.includes('admin')) {
      return '/member';
    }
    
    switch (userProfile.user_type) {
      case 'client':
        return '/client';
      case 'student':
        return '/student';
      case 'alumni':
        return '/alumni';
      case 'member':
        return '/member';
      default:
        return '/';
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={getRedirectPath()} replace />} />
      
      <Route
        path="/client/*"
        element={
          <PrivateRoute allowedUserType="client">
            <ClientSpace />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/student/*"
        element={
          <PrivateRoute allowedUserType="student">
            <StudentSpace />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/alumni/*"
        element={
          <PrivateRoute allowedUserType="alumni">
            <AlumniSpace />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/member/*"
        element={
          <PrivateRoute allowedUserType="member">
            <MemberSpace />
          </PrivateRoute>
        }
      />
      
      <Route path="*" element={<Navigate to={getRedirectPath()} replace />} />
    </Routes>
  );
};

export default AppRoutes;