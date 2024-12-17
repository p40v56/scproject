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
        // Récupérer la session initiale
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("Initial session:", initialSession);
        setSession(initialSession);
        
        if (initialSession) {
          // Si on a une session, récupérer le profil
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('user_type, roles')
            .eq('id', initialSession.user.id)
            .single();

          if (error) {
            console.error('Error fetching profile:', error);
            setIsLoading(false);
            return;
          }

          console.log("User profile loaded:", profile);
          setUserProfile(profile);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Auth initialization error:", error);
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      console.log("Auth state change:", newSession);
      setSession(newSession);
      
      if (newSession) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('user_type, roles')
            .eq('id', newSession.user.id)
            .single();

          if (error) throw error;
          
          console.log("Profile updated:", profile);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error updating profile:', error);
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