import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchUserProfile = async (userId: string) => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('user_type, roles')
          .eq('id', userId)
          .single();

        if (error) throw error;
        
        console.log("Profile fetched:", profile);
        return profile;
      } catch (error) {
        console.error('Error in fetchUserProfile:', error);
        return null;
      }
    };

    const handleAuthChange = async (event: string, newSession: any) => {
      console.log("Auth state change event:", event);
      
      if (!mounted) return;

      if (event === 'SIGNED_OUT' || !newSession) {
        setSession(null);
        setUserProfile(null);
        setIsLoading(false);
        return;
      }

      setSession(newSession);
      const profile = await fetchUserProfile(newSession.user.id);
      if (mounted) {
        setUserProfile(profile);
        setIsLoading(false);
      }
    };

    // Initial session check
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("Initial session check:", initialSession);

        if (mounted) {
          if (initialSession) {
            await handleAuthChange('SIGNED_IN', initialSession);
          } else {
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Initialize auth
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, userProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};