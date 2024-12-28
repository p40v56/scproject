import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

export const useMissionsList = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: missions = [], isLoading } = useQuery({
    queryKey: ['missions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('missions')
        .select(`
          *,
          applicants:mission_applications(*),
          study:studies(
            id,
            title
          ),
          study_phase:study_phases!study_phase_id(
            id,
            name
          )
        `);
      
      if (error) {
        toast.error("Erreur lors du chargement des missions");
        throw error;
      }
      
      return data.map(mission => ({
        ...mission,
        postedDate: new Date(mission.created_at).toLocaleDateString(),
        applicants: mission.applicants || [],
        study: mission.study || null,
        study_phase: mission.study_phase || null,
        study_phase_id: mission.study_phase_id,
      }));
    }
  });

  const handleCreateMission = async (data: any) => {
    try {
      const { error } = await supabase
        .from('missions')
        .insert([{
          title: data.title,
          study_level: data.studyLevel,
          compensation: parseFloat(data.compensation),
          description: data.description,
          status: data.status,
          study_id: data.study_id === 'none' ? null : data.study_id,
          study_phase_id: data.study_phase_id === 'none' ? null : data.study_phase_id
        }]);

      if (error) throw error;

      toast.success("Mission créée avec succès");
      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['missions'] });
    } catch (error) {
      console.error('Error creating mission:', error);
      toast.error("Erreur lors de la création de la mission");
    }
  };

  const handleEditMission = async (data: any) => {
    if (!data.id) {
      toast.error("ID de mission manquant");
      return;
    }

    try {
      const { error } = await supabase
        .from('missions')
        .update({
          title: data.title,
          study_level: data.studyLevel,
          compensation: parseFloat(data.compensation),
          description: data.description,
          status: data.status,
          study_id: data.study_id === 'none' ? null : data.study_id,
          study_phase_id: data.study_phase_id === 'none' ? null : data.study_phase_id
        })
        .eq('id', data.id);

      if (error) throw error;

      toast.success("Mission modifiée avec succès");
      setIsEditDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['missions'] });
    } catch (error) {
      console.error('Error updating mission:', error);
      toast.error("Erreur lors de la modification de la mission");
    }
  };

  const handleDeleteMission = async (missionId: string) => {
    if (!missionId) {
      toast.error("ID de mission manquant");
      return;
    }

    try {
      const { error } = await supabase
        .from('missions')
        .delete()
        .eq('id', missionId);

      if (error) throw error;

      toast.success("Mission supprimée avec succès");
      queryClient.invalidateQueries({ queryKey: ['missions'] });
    } catch (error) {
      console.error('Error deleting mission:', error);
      toast.error("Erreur lors de la suppression de la mission");
    }
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