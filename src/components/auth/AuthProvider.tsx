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

    const initialize = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        await updateAuthState(initialSession);
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
      async (_event, session) => {
        if (initializationComplete.current) {
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