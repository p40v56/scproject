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
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("Initial session check:", initialSession);
        setSession(initialSession);
        
        if (initialSession) {
          await fetchUserProfile(initialSession.user.id);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error during auth initialization:", error);
        setIsLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      console.log("Auth state change:", newSession);
      setSession(newSession);
      
      if (newSession) {
        await fetchUserProfile(newSession.user.id);
      } else {
        setUserProfile(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_type, roles')
        .eq('id', userId)
        .single();

      if (error) throw error;
      console.log("User profile:", profile);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ session, userProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};