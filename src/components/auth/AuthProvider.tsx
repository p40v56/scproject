import { createContext, useContext, useState, useEffect } from "react";
import { Session, AuthError } from "@supabase/supabase-js";
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Profile = Tables<"profiles">;

interface AuthContextType {
  session: Session | null;
  userProfile: Profile | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider mounted");
    
    const fetchProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error("Erreur lors du chargement du profil");
        return null;
      }
    };

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        console.log("Initial session check:", currentSession);
        
        if (error) throw error;

        setSession(currentSession);
        
        if (currentSession?.user) {
          const profile = await fetchProfile(currentSession.user.id);
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        toast.error("Erreur lors de l'initialisation de l'authentification");
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Auth state change:", event, newSession?.user?.id);
      
      if (event === 'SIGNED_OUT') {
        setSession(null);
        setUserProfile(null);
        setIsLoading(false);
        return;
      }

      if (newSession?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        setSession(newSession);
        const profile = await fetchProfile(newSession.user.id);
        setUserProfile(profile);
        setIsLoading(false);
      }
    });

    // Initialize
    initializeAuth();

    // Cleanup
    return () => {
      console.log("AuthProvider cleanup");
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array as we only want this to run once

  console.log("AuthProvider render:", { session, userProfile, isLoading });

  return (
    <AuthContext.Provider value={{ session, userProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};