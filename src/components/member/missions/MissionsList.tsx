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

// Données de test pour le développement
const mockMissions: Mission[] = [
  {
    id: "1",
    title: "Distribution de questionnaires",
    studyLevel: "Tous",
    status: "open",
    applicants: [],
    postedDate: "2024-03-01",
    compensation: 400,
    description: "Analyse du marché du luxe en France",
  },
  {
    id: "2",
    title: "Sondages téléphoniques",
    studyLevel: "M1",
    status: "in-progress",
    applicants: [],
    postedDate: "2024-03-02",
    compensation: 300,
    description: "Étude de satisfaction client",
  },
];

export default function MissionsList() {
  const [missions] = useState<Mission[]>(mockMissions);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  const handleCreateMission = (data: any) => {
    console.log("Nouvelle mission:", data);
    toast.success("Mission créée avec succès");
    setIsCreateDialogOpen(false);
  };

  const handleEditMission = (data: any) => {
    console.log("Mission modifiée:", data);
    toast.success("Mission modifiée avec succès");
    setIsEditDialogOpen(false);
  };

  const handleDeleteMission = (missionId: string) => {
    console.log("Suppression de la mission:", missionId);
    toast.success("Mission supprimée avec succès");
  };

  const filteredMissions = missions.filter((mission) => {
    const matchesSearch = mission.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || mission.status === statusFilter;
    const matchesLevel =
      levelFilter === "all" ||
      mission.studyLevel.toLowerCase().includes(levelFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesLevel;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Offres de missions</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Briefcase className="mr-2" />
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