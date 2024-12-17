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
        console.log("Initial session:", initialSession);
        setSession(initialSession);
        
        if (initialSession?.user?.id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('user_type, roles')
            .eq('id', initialSession.user.id)
            .single();

          console.log("Initial profile loaded:", profile);
          setUserProfile(profile);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      console.log("Auth state change:", newSession);
      setSession(newSession);
      
      if (newSession?.user?.id) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('user_type, roles')
            .eq('id', newSession.user.id)
            .single();

          console.log("Profile updated:", profile);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error updating profile:', error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, userProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};