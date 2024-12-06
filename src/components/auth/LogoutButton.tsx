import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
    toast.success("Déconnexion réussie");
  };

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      className="gap-2 text-gray-600 hover:text-gray-900"
    >
      <LogOut className="h-4 w-4" />
      Se déconnecter
    </Button>
  );
};

export default LogoutButton;