import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MissionFilters } from "./MissionFilters";
import { MissionItem } from "./MissionItem";
import { MissionListHeader } from "./list/MissionListHeader";
import { useMissionsList } from "./list/useMissionsList";
import { useState } from "react";

export default function MissionsList() {
  const {
    missions,
    isLoading,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    handleCreateMission,
    handleEditMission,
    handleDeleteMission,
  } = useMissionsList();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

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
      <MissionListHeader
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        handleCreateMission={handleCreateMission}
      />

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