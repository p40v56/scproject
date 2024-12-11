import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ClientSpace from "./pages/private/ClientSpace";
import StudentSpace from "./pages/private/StudentSpace";
import AlumniSpace from "./pages/private/AlumniSpace";
import MemberSpace from "./pages/private/MemberSpace";
import PrivateRoute from "./components/auth/PrivateRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
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

export default App;