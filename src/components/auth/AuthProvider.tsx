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

  // Fonction pour récupérer le profil utilisateur
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type, roles')
        .eq('id', userId)
        .single();

      console.log("Profile fetched:", profile);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setUserProfile(null);
    }
  };

  useEffect(() => {
    // Nettoyer l'état au montage
    setSession(null);
    setUserProfile(null);
    setIsLoading(true);

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("Initial session check:", initialSession);
        
        setSession(initialSession);
        
        if (initialSession?.user?.id) {
          await fetchUserProfile(initialSession.user.id);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Auth state change event:", event);
      console.log("New session:", newSession);
      
      setSession(newSession);
      
      if (newSession?.user?.id) {
        await fetchUserProfile(newSession.user.id);
      } else {
        setUserProfile(null);
      }
      
      setIsLoading(false);
    });

    // Cleanup function
    return () => {
      subscription.unsubscribe();
      setSession(null);
      setUserProfile(null);
      setIsLoading(true);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, userProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};