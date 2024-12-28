import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { MissionStatus } from "../types";

export const useMissionMutations = () => {
  const queryClient = useQueryClient();

  const createMission = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('missions')
        .insert([{
          title: data.title,
          study_level: data.studyLevel,
          compensation: parseFloat(data.compensation),
          description: data.description,
          status: data.status as MissionStatus,
          study_id: data.study_id === 'none' ? null : data.study_id,
          study_phase_id: data.study_phase_id === 'none' ? null : data.study_phase_id
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Mission créée avec succès");
      queryClient.invalidateQueries({ queryKey: ['missions'] });
    },
    onError: (error) => {
      console.error('Error creating mission:', error);
      toast.error("Erreur lors de la création de la mission");
    }
  });

  const editMission = useMutation({
    mutationFn: async (data: any) => {
      if (!data.id) {
        throw new Error("ID de mission manquant");
      }

      const { error } = await supabase
        .from('missions')
        .update({
          title: data.title,
          study_level: data.studyLevel,
          compensation: parseFloat(data.compensation),
          description: data.description,
          status: data.status as MissionStatus,
          study_id: data.study_id === 'none' ? null : data.study_id,
          study_phase_id: data.study_phase_id === 'none' ? null : data.study_phase_id
        })
        .eq('id', data.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Mission modifiée avec succès");
      queryClient.invalidateQueries({ queryKey: ['missions'] });
    },
    onError: (error) => {
      console.error('Error updating mission:', error);
      toast.error("Erreur lors de la modification de la mission");
    }
  });

  const deleteMission = useMutation({
    mutationFn: async (missionId: string) => {
      if (!missionId) {
        throw new Error("ID de mission manquant");
      }

      const { error } = await supabase
        .from('missions')
        .delete()
        .eq('id', missionId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Mission supprimée avec succès");
      queryClient.invalidateQueries({ queryKey: ['missions'] });
    },
    onError: (error) => {
      console.error('Error deleting mission:', error);
      toast.error("Erreur lors de la suppression de la mission");
    }
  });

  return {
    createMission,
    editMission,
    deleteMission
  };
};