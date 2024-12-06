import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Briefcase, Eye, FileEdit, Trash2 } from "lucide-react";

type Mission = {
  id: string;
  title: string;
  studyLevel: string;
  status: "open" | "closed" | "in-progress";
  applicants: number;
  postedDate: string;
  compensation: number;
};

const missions: Mission[] = [
  {
    id: "1",
    title: "Distribution de questionnaires",
    studyLevel: "Tous",
    status: "open",
    applicants: 5,
    postedDate: "2024-03-15",
    compensation: 150,
  },
  {
    id: "2",
    title: "Sondages téléphoniques",
    studyLevel: "Tous",
    status: "in-progress",
    applicants: 3,
    postedDate: "2024-03-14",
    compensation: 200,
  },
  {
    id: "3",
    title: "Analyse qualitative",
    studyLevel: "M2 - Luxe",
    status: "closed",
    applicants: 8,
    postedDate: "2024-03-10",
    compensation: 300,
  },
];

const getStatusColor = (status: Mission["status"]) => {
  switch (status) {
    case "open":
      return "text-green-600 bg-green-100";
    case "in-progress":
      return "text-yellow-600 bg-yellow-100";
    case "closed":
      return "text-red-600 bg-red-100";
  }
};

const getStatusText = (status: Mission["status"]) => {
  switch (status) {
    case "open":
      return "Ouverte";
    case "in-progress":
      return "En cours";
    case "closed":
      return "Fermée";
  }
};

export default function MissionsList() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Offres de missions</h2>
        <Button>
          <Briefcase className="mr-2" />
          Nouvelle mission
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Niveau d'étude</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Candidats</TableHead>
            <TableHead>Date de publication</TableHead>
            <TableHead>Rémunération</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {missions.map((mission) => (
            <TableRow key={mission.id}>
              <TableCell className="font-medium">{mission.title}</TableCell>
              <TableCell>{mission.studyLevel}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    mission.status
                  )}`}
                >
                  {getStatusText(mission.status)}
                </span>
              </TableCell>
              <TableCell>{mission.applicants}</TableCell>
              <TableCell>{mission.postedDate}</TableCell>
              <TableCell>{mission.compensation} €</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <FileEdit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}