import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserActionsProps {
  userId: string;
}

export const UserActions = ({ userId }: UserActionsProps) => {
  const queryClient = useQueryClient();

  const handleAction = async (action: string) => {
    switch (action) {
      case "view":
        toast.info("Fonctionnalité à venir");
        break;
      case "disable":
        try {
          const { error } = await supabase.auth.admin.updateUserById(
            userId,
            { user_metadata: { disabled: true } }
          );
          if (error) throw error;
          toast.success("Utilisateur désactivé");
          queryClient.invalidateQueries({ queryKey: ['users'] });
        } catch (error) {
          console.error('Error disabling user:', error);
          toast.error("Erreur lors de la désactivation de l'utilisateur");
        }
        break;
      case "delete":
        try {
          const { error } = await supabase.auth.admin.deleteUser(userId);
          if (error) throw error;
          toast.success("Utilisateur supprimé");
          queryClient.invalidateQueries({ queryKey: ['users'] });
        } catch (error) {
          console.error('Error deleting user:', error);
          toast.error("Erreur lors de la suppression de l'utilisateur");
        }
        break;
    }
  };

  return (
    <Select defaultValue="more" onValueChange={handleAction}>
      <SelectTrigger className="w-[130px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="more">Plus d'actions</SelectItem>
        <SelectItem value="view">Voir le profil</SelectItem>
        <SelectItem value="disable">Désactiver</SelectItem>
        <SelectItem value="delete">Supprimer</SelectItem>
      </SelectContent>
    </Select>
  );
};