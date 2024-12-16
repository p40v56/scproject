import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate("/");
      toast.success("Déconnexion réussie");
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error("Erreur lors de la déconnexion");
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