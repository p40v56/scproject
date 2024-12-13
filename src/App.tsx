import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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

const App = () => {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_type, roles')
        .eq('id', userId)
        .single();

      if (error) throw error;
      console.log("User profile:", profile); // Debug log
      setUserProfile(profile);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Function to determine where to redirect based on user type
  const getRedirectPath = () => {
    if (!userProfile) return '/';
    
    // Si l'utilisateur a le rôle admin, on le redirige vers l'espace membre
    if (userProfile.roles?.includes('admin')) {
      return '/member';
    }
    
    // Sinon, on redirige selon le user_type
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
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={session ? <Navigate to={getRedirectPath()} /> : <Index />} 
            />
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
            {/* Catch any other routes and redirect to appropriate space */}
            <Route
              path="*"
              element={<Navigate to={getRedirectPath()} replace />}
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;