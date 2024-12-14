import { TableCell, TableRow } from "@/components/ui/table";
import { MissionActions } from "./MissionActions";
import type { Mission } from "./types";

interface MissionItemProps {
  mission: Mission;
  onDelete: (missionId: string) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  onEdit: (data: any) => void;
}

export const MissionItem = ({
  mission,
  onDelete,
  isEditDialogOpen,
  setIsEditDialogOpen,
  onEdit,
}: MissionItemProps) => {
  return (
    <TableRow key={mission.id}>
      <TableCell className="font-medium">{mission.title}</TableCell>
      <TableCell>{mission.studyLevel}</TableCell>
      <TableCell>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            mission.status === "open"
              ? "text-green-600 bg-green-100"
              : mission.status === "in-progress"
              ? "text-yellow-600 bg-yellow-100"
              : "text-red-600 bg-red-100"
          }`}
        >
          {mission.status === "open"
            ? "Ouverte"
            : mission.status === "in-progress"
            ? "En cours"
            : "Fermée"}
        </span>
      </TableCell>
      <TableCell>{mission.applicants.length}</TableCell>
      <TableCell>{mission.postedDate}</TableCell>
      <TableCell>{mission.compensation}€</TableCell>
      <TableCell>
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