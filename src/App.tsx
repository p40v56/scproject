import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ClientSpace from "./pages/private/ClientSpace";
import StudentSpace from "./pages/private/StudentSpace";
import AlumniSpace from "./pages/private/AlumniSpace";
import MemberSpace from "./pages/private/MemberSpace";
import PrivateRoute from "./components/auth/PrivateRoute";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={session ? <Navigate to="/dashboard" /> : <Index />} 
            />
            <Route
              path="/dashboard"
              element={
                session ? (
                  <Dashboard />
                ) : (
                  <Navigate to="/" replace />
                )
              }
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
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;