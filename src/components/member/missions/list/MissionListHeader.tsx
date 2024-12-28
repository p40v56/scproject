import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Briefcase } from "lucide-react";
import MissionForm from "../MissionForm";

type MissionListHeaderProps = {
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (isOpen: boolean) => void;
  handleCreateMission: (data: any) => void;
};

export const MissionListHeader = ({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  handleCreateMission,
}: MissionListHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Offres de missions</h2>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Briefcase className="mr-2 h-4 w-4" />
            Nouvelle mission
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer une nouvelle mission</DialogTitle>
          </DialogHeader>
          <MissionForm onSubmit={handleCreateMission} mode="create" />
        </DialogContent>
      </Dialog>
    </div>
  );
};