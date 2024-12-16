import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Briefcase } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MissionFilters } from "./MissionFilters";
import { MissionItem } from "./MissionItem";
import MissionForm from "./MissionForm";
import type { Mission } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function MissionsList() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
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
        study_phase: mission.study_phase || null
      })) as Mission[];
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
          status: 'open',
          study_id: data.study_id || null,
          study_phase_id: data.study_phase_id || null
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
          study_id: data.study_id || null,
          study_phase_id: data.study_phase_id || null
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

  const filteredMissions = missions.filter((mission) => {
    const matchesSearch = mission.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || mission.status === statusFilter;
    const matchesLevel =
      levelFilter === "all" ||
      mission.study_level.toLowerCase().includes(levelFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesLevel;
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
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

      <MissionFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        levelFilter={levelFilter}
        onLevelChange={setLevelFilter}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Étude</TableHead>
            <TableHead>Phase</TableHead>
            <TableHead>Niveau d'étude</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Candidatures</TableHead>
            <TableHead>Date de publication</TableHead>
            <TableHead>Rémunération</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMissions.map((mission) => (
            <MissionItem
              key={mission.id}
              mission={mission}
              onDelete={handleDeleteMission}
              isEditDialogOpen={isEditDialogOpen}
              setIsEditDialogOpen={setIsEditDialogOpen}
              onEdit={handleEditMission}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}