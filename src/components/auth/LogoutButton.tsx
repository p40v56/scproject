import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // First check if we have a session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Only attempt to sign out if we have a valid session
        await supabase.auth.signOut();
      }
      
      // Always clear local state and redirect, regardless of session status
      navigate("/");
      toast.success("Déconnexion réussie");
    } catch (error) {
      console.error('Error logging out:', error);
      // Even if there's an error, we'll clear the local state and redirect
      navigate("/");
      toast.error("Une erreur est survenue lors de la déconnexion");
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      className="gap-2 text-gray-600 hover:text-gray-900 w-full justify-start"
    >
      <LogOut className="h-4 w-4" />
      Se déconnecter
    </Button>
  );
};

export default LogoutButton;