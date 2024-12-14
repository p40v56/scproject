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
  return (
    <Select defaultValue="more">
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