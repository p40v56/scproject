import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const UserTypeSelect = ({ value, onChange }: UserTypeSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="client">Client</SelectItem>
        <SelectItem value="student">Étudiant</SelectItem>
        <SelectItem value="alumni">Alumni</SelectItem>
        <SelectItem value="member">Membre</SelectItem>
      </SelectContent>
    </Select>
  );
};