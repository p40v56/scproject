import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedUserType: "client" | "student" | "alumni" | "member";
}

const PrivateRoute = ({ children, allowedUserType }: PrivateRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      setIsAuthenticated(true);

      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', session.user.id)
        .single();

      setIsAllowed(profile?.user_type === allowedUserType);
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setIsAllowed(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [allowedUserType]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!isAllowed) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;