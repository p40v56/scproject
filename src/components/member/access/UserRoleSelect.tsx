import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserRoleSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const UserRoleSelect = ({ value, onChange }: UserRoleSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="member">Membre</SelectItem>
        <SelectItem value="project-manager">Chargé de projet</SelectItem>
        <SelectItem value="moderator">Modérateur</SelectItem>
        <SelectItem value="treasurer">Trésorier</SelectItem>
        <SelectItem value="commercial">Responsable Commercial</SelectItem>
        <SelectItem value="hr">Responsable RH</SelectItem>
        <SelectItem value="quality">Responsable Qualité</SelectItem>
        <SelectItem value="secretary">Secrétaire Général</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="super-admin">Super Admin</SelectItem>
      </SelectContent>
    </Select>
  );
};