import { createContext, useContext, useEffect, useState, useRef } from "react";
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
  const [session, setSession] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);
  const initializationComplete = useRef(false);

  useEffect(() => {
    const fetchUserProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
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

    const updateAuthState = async (newSession: any) => {
      if (!isMounted.current) return;

      try {
        if (!newSession) {
          setSession(null);
          setUserProfile(null);
        } else {
          setSession(newSession);
          const profile = await fetchUserProfile(newSession.user.id);
          if (isMounted.current) {
            setUserProfile(profile);
          }
        }
      } finally {
        if (isMounted.current && !initializationComplete.current) {
          setIsLoading(false);
          initializationComplete.current = true;
        }
      }
    };

    // Initialize auth state
    const initialize = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        // If we have a session, try to refresh it
        if (initialSession?.refresh_token) {
          const { data: { session: refreshedSession }, error: refreshError } = 
            await supabase.auth.refreshSession();
            
          if (refreshError) {
            console.error('Error refreshing session:', refreshError);
            // Clear invalid session
            await supabase.auth.signOut();
            setSession(null);
            setUserProfile(null);
          } else {
            await updateAuthState(refreshedSession);
          }
        } else {
          await updateAuthState(initialSession);
        }
      } catch (error) {
        console.error('Error during initialization:', error);
        if (isMounted.current) {
          setIsLoading(false);
          initializationComplete.current = true;
        }
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change event:", event);
        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUserProfile(null);
          initializationComplete.current = true;
          setIsLoading(false);
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await updateAuthState(session);
        }
      }
    );

    initialize();

    return () => {
      isMounted.current = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, userProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};