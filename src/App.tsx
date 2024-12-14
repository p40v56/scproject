import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
import Index from "./pages/Index";
import ClientSpace from "./pages/private/ClientSpace";
import StudentSpace from "./pages/private/StudentSpace";
import AlumniSpace from "./pages/private/AlumniSpace";
import MemberSpace from "./pages/private/MemberSpace";
import PrivateRoute from "./components/auth/PrivateRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppRoutes = () => {
  const { session, userProfile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getRedirectPath = () => {
    if (!userProfile) return '/';
    
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
      <Route 
        path="/" 
        element={
          session ? (
            <Navigate to={getRedirectPath()} replace />
          ) : (
            <Index />
          )
        } 
      />

      <Route
        path="/client/*"
        element={
          !session ? (
            <Navigate to="/" replace />
          ) : (
            <PrivateRoute allowedUserType="client">
              <ClientSpace />
            </PrivateRoute>
          )
        }
      />
      <Route
        path="/student/*"
        element={
          !session ? (
            <Navigate to="/" replace />
          ) : (
            <PrivateRoute allowedUserType="student">
              <StudentSpace />
            </PrivateRoute>
          )
        }
      />
      <Route
        path="/alumni/*"
        element={
          !session ? (
            <Navigate to="/" replace />
          ) : (
            <PrivateRoute allowedUserType="alumni">
              <AlumniSpace />
            </PrivateRoute>
          )
        }
      />
      <Route
        path="/member/*"
        element={
          !session ? (
            <Navigate to="/" replace />
          ) : (
            <PrivateRoute allowedUserType="member">
              <MemberSpace />
            </PrivateRoute>
          )
        }
      />
      <Route
        path="*"
        element={
          !session ? (
            <Navigate to="/" replace />
          ) : (
            <Navigate to={getRedirectPath()} replace />
          )
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;