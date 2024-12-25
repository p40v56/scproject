import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MissionActions } from "./MissionActions";
import type { Mission } from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface MissionItemProps {
  mission: Mission;
  onDelete: (missionId: string) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  onEdit: (data: any) => void;
}

const statusLabels = {
  open: "Ouverte",
  closed: "Fermée",
  "in-progress": "En cours",
};

export const MissionItem = ({
  mission,
  onDelete,
  isEditDialogOpen,
  setIsEditDialogOpen,
  onEdit,
}: MissionItemProps) => {
  const queryClient = useQueryClient();

  const handleStatusChange = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('missions')
        .update({ status: newStatus })
        .eq('id', mission.id);

      if (error) throw error;

      toast.success("Statut de la mission mis à jour");
      queryClient.invalidateQueries({ queryKey: ['missions'] });
    } catch (error) {
      console.error('Error updating mission status:', error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  return (
    <TableRow>
      <TableCell>{mission.title}</TableCell>
      <TableCell>{mission.study?.title || "-"}</TableCell>
      <TableCell>{mission.study_phase?.name || "-"}</TableCell>
      <TableCell>{mission.study_level}</TableCell>
      <TableCell>
        <Select defaultValue={mission.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue>
              <Badge
                variant={
                  mission.status === "open"
                    ? "default"
                    : mission.status === "in-progress"
                    ? "secondary"
                    : "destructive"
                }
              >
                {statusLabels[mission.status]}
              </Badge>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">
              <Badge variant="default">Ouverte</Badge>
            </SelectItem>
            <SelectItem value="in-progress">
              <Badge variant="secondary">En cours</Badge>
            </SelectItem>
            <SelectItem value="closed">
              <Badge variant="destructive">Fermée</Badge>
            </SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>{mission.applicants.length}</TableCell>
      <TableCell>{mission.postedDate}</TableCell>
      <TableCell>{mission.compensation}€</TableCell>
      <TableCell className="text-right">
        <MissionActions
          mission={mission}
          onDelete={onDelete}
          isEditDialogOpen={isEditDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen}
          onEdit={onEdit}
        />
      </TableCell>
    </TableRow>
  );
};