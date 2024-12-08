import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Briefcase, Eye, FileEdit, Trash2, UserCheck, User } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { toast } from "sonner"
import MissionForm from "./MissionForm"
import StudentProfile from "./StudentProfile"

type Applicant = {
  id: string
  name: string
  level: string
  appliedDate: string
  email?: string
  phone?: string
  documents?: Array<{
    id: string
    name: string
    type: string
  }>
}

type Mission = {
  id: string
  title: string
  studyLevel: string
  status: "open" | "closed" | "in-progress"
  applicants: Applicant[]
  postedDate: string
  compensation: number
  description?: string
}

const missions: Mission[] = [
  {
    id: "1",
    title: "Distribution de questionnaires",
    studyLevel: "Tous",
    status: "open",
    applicants: [
      { id: "1", name: "Jean Dupont", level: "M1", appliedDate: "2024-03-15" },
      { id: "2", name: "Marie Martin", level: "M2", appliedDate: "2024-03-16" },
    ],
    postedDate: "2024-03-15",
    compensation: 150,
  },
  {
    id: "2",
    title: "Sondages téléphoniques",
    studyLevel: "Tous",
    status: "in-progress",
    applicants: [
      { id: "3", name: "Pierre Durant", level: "M1", appliedDate: "2024-03-14" },
    ],
    postedDate: "2024-03-14",
    compensation: 200,
  },
  {
    id: "3",
    title: "Analyse qualitative",
    studyLevel: "M2 - Luxe",
    status: "closed",
    applicants: [],
    postedDate: "2024-03-10",
    compensation: 300,
  },
]

const getStatusColor = (status: Mission["status"]) => {
  switch (status) {
    case "open":
      return "text-green-600 bg-green-100"
    case "in-progress":
      return "text-yellow-600 bg-yellow-100"
    case "closed":
      return "text-red-600 bg-red-100"
  }
}

const getStatusText = (status: Mission["status"]) => {
  switch (status) {
    case "open":
      return "Ouverte"
    case "in-progress":
      return "En cours"
    case "closed":
      return "Fermée"
  }
}

const ApplicantsList = ({ applicants, missionId }: { applicants: Applicant[], missionId: string }) => {
  const [selectedStudent, setSelectedStudent] = useState<Applicant | null>(null)

  const handleSelectApplicant = (applicantId: string) => {
    toast.success("Le candidat a été sélectionné pour la mission")
  }

  return (
    <div className="space-y-4">
      {applicants.length === 0 ? (
        <p className="text-muted-foreground">Aucune candidature pour le moment</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Niveau</TableHead>
              <TableHead>Date de candidature</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applicants.map((applicant) => (
              <TableRow key={applicant.id}>
                <TableCell>{applicant.name}</TableCell>
                <TableCell>{applicant.level}</TableCell>
                <TableCell>{applicant.appliedDate}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectApplicant(applicant.id)}
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Sélectionner
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedStudent(applicant)}
                    >
                      <User className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {selectedStudent && (
        <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
          <StudentProfile student={selectedStudent} onClose={() => setSelectedStudent(null)} />
        </Dialog>
      )}
    </div>
  )
}

export default function MissionsList() {
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleCreateMission = (data: any) => {
    console.log("Nouvelle mission:", data)
    toast.success("Mission créée avec succès")
    setIsCreateDialogOpen(false)
  }

  const handleEditMission = (data: any) => {
    console.log("Mission modifiée:", data)
    toast.success("Mission modifiée avec succès")
    setIsEditDialogOpen(false)
  }

  const handleDeleteMission = (missionId: string) => {
    console.log("Suppression de la mission:", missionId)
    toast.success("Mission supprimée avec succès")
  }

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
              <TableCell>{mission.applicants.length}</TableCell>
              <TableCell>{mission.postedDate}</TableCell>
              <TableCell>{mission.compensation}€</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setSelectedMission(mission)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Candidatures - {mission.title}</DialogTitle>
                      </DialogHeader>
                      <ApplicantsList 
                        applicants={mission.applicants} 
                        missionId={mission.id} 
                      />
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setSelectedMission(mission)}
                      >
                        <FileEdit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Modifier la mission</DialogTitle>
                      </DialogHeader>
                      <MissionForm 
                        onSubmit={handleEditMission}
                        mode="edit"
                        initialData={{
                          title: mission.title,
                          studyLevel: mission.studyLevel,
                          compensation: mission.compensation.toString(),
                          description: mission.description || "",
                        }}
                      />
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action ne peut pas être annulée. La mission sera définitivement supprimée.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteMission(mission.id)}>
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
