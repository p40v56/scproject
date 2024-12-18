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

        if (error) {
          console.error('Error fetching user profile:', error);
          return null;
        }
        
        return profile;
      } catch (error) {
        console.error('Error in fetchUserProfile:', error);
        return null;
      }
    };

    // Initialize auth state
    const initialize = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (!initialSession) {
          setSession(null);
          setUserProfile(null);
          setIsLoading(false);
          return;
        }

        setSession(initialSession);
        const profile = await fetchUserProfile(initialSession.user.id);
        
        if (!mounted) return;
        
        setUserProfile(profile);
        setIsLoading(false);
      } catch (error) {
        console.error('Error during initialization:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state change subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state change:', event);
        
        if (!mounted) return;

        if (event === 'SIGNED_OUT' || !newSession) {
          setSession(null);
          setUserProfile(null);
          setIsLoading(false);
          return;
        }

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSession(newSession);
          const profile = await fetchUserProfile(newSession.user.id);
          if (mounted) {
            setUserProfile(profile);
            setIsLoading(false);
          }
        }
      }
    );

    // Initialize
    initialize();

    // Cleanup
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