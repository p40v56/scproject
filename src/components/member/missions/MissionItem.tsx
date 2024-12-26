import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MissionActions } from "./MissionActions";
import type { Mission } from "./types";

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
  return (
    <TableRow>
      <TableCell>{mission.title}</TableCell>
      <TableCell>{mission.study?.title || "-"}</TableCell>
      <TableCell>{mission.study_phase?.name || "-"}</TableCell>
      <TableCell>{mission.study_level}</TableCell>
      <TableCell>
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