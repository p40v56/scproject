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
          <Route path="/client" element={<ClientSpace />} />
          <Route path="/student" element={<StudentSpace />} />
          <Route path="/alumni" element={<AlumniSpace />} />
          <Route path="/member" element={<MemberSpace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;