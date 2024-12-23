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
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Error during logout:', error);
          // Even if there's an error, we'll clear the local state
          await supabase.auth.signOut({ scope: 'local' });
        }
      } else {
        // If no session exists, just clear local state
        await supabase.auth.signOut({ scope: 'local' });
      }
      
      // Always navigate away and show success message
      navigate("/");
      toast.success("Déconnexion réussie");
      
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, clear local state and redirect
      await supabase.auth.signOut({ scope: 'local' });
      navigate("/");
      toast.success("Déconnexion réussie");
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