import { createContext, useContext, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { Profile } from "@/integrations/supabase/types";
import { useAuthStateChange } from "@/hooks/useAuthStateChange";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { toast } from "sonner";

interface AuthContextType {
  session: Session | null;
  userProfile: Profile | null;
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

  const { initializationComplete } = useAuthStateChange({
    setSession,
    setUserProfile,
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useAuthRedirect(userProfile, initializationComplete);

  return (
    <AuthContext.Provider value={{ session, userProfile }}>
      {children}
    </AuthContext.Provider>
  );
};