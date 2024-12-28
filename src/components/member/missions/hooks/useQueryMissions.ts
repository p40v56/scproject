import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Mission, MissionStatus } from "../types";

export const useQueryMissions = () => {
  return useQuery({
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
        status: mission.status as MissionStatus
      })) as Mission[];
    }
  });
};