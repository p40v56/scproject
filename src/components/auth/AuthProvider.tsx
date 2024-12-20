import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextType {
  session: any;
  userProfile: any;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  userProfile: null,
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    const fetchUserProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('user_type, roles')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          return null;
        }

        return data;
      } catch (error) {
        console.error('Error in fetchUserProfile:', error);
        return null;
      }
    };

    const handleAuthChange = async (event: string, currentSession: any) => {
      if (!isMounted.current) return;

      if (event === 'SIGNED_IN') {
        setSession(currentSession);
        const profile = await fetchUserProfile(currentSession.user.id);
        if (isMounted.current) {
          setUserProfile(profile);
        }
      } else if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        setSession(null);
        setUserProfile(null);
        navigate('/');
      } else if (event === 'USER_UPDATED') {
        setSession(currentSession);
      }

      if (isMounted.current) {
        setIsLoading(false);
      }
    };

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession) {
          await handleAuthChange('SIGNED_IN', initialSession);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        toast.error("Erreur d'authentification");
        setIsLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    initializeAuth();

    return () => {
      isMounted.current = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ session, userProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;