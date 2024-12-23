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
        try {
          // Try global sign out first
          await supabase.auth.signOut({ scope: 'global' });
        } catch (error) {
          console.error('Error during global logout:', error);
          try {
            // If global fails, try local
            await supabase.auth.signOut({ scope: 'local' });
          } catch (error) {
            console.error('Error during local logout:', error);
          }
        }
      }
      
      // Always clear local state
      await supabase.auth.signOut({ scope: 'local' });
      
      // Always navigate and show success message
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