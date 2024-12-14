import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log("PrivateRoute - Session check:", session); // Debug log
        
        if (!session) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        setIsAuthenticated(true);

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('user_type, roles')
          .eq('id', session.user.id)
          .single();

        if (error) {
          throw error;
        }

        // Allow access if user has the correct user_type OR if they are an admin AND trying to access member space
        const isAdmin = profile?.roles?.includes('admin');
        const hasAccess = profile?.user_type === allowedUserType || 
                         (isAdmin && allowedUserType === 'member');
        
        console.log("PrivateRoute - Access check:", { 
          profile, 
          allowedUserType, 
          hasAccess 
        }); // Debug log
        
        setIsAllowed(hasAccess);
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking authentication:', error);
        toast.error("Erreur lors de la vérification des droits d'accès");
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("PrivateRoute - Auth state change:", { event, session }); // Debug log
      
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setIsAllowed(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [allowedUserType]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!isAllowed) {
    toast.error("Vous n'avez pas accès à cette page");
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;