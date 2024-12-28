import { useState } from "react";
import { useQueryMissions } from "../hooks/useQueryMissions";
import { useMissionMutations } from "../hooks/useMissionMutations";

export const useMissionsList = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const { data: missions = [], isLoading } = useQueryMissions();
  const { createMission, editMission, deleteMission } = useMissionMutations();

  const handleCreateMission = async (data: any) => {
    createMission.mutate(data, {
      onSuccess: () => setIsCreateDialogOpen(false)
    });
  };

  const handleEditMission = async (data: any) => {
    editMission.mutate(data, {
      onSuccess: () => setIsEditDialogOpen(false)
    });
  };

  const handleDeleteMission = async (missionId: string) => {
    deleteMission.mutate(missionId);
  };

  return {
    missions,
    isLoading,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    handleCreateMission,
    handleEditMission,
    handleDeleteMission,
  };
};