import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"
import StudyProgress from "./StudyProgress"
import StudyHeader from "./study/StudyHeader"
import StudyMilestones from "./study/StudyMilestones"
import CallbackRequest from "./study/CallbackRequest"

interface Phase {
  name: string;
  status: string;
  progress: number;
}

const StudyDetails = () => {
  const studyPhases: Phase[] = [
    { name: "Phase préparatoire", status: "completed", progress: 100 },
    { name: "Phase quantitative", status: "in-progress", progress: 60 },
    { name: "Phase qualitative", status: "pending", progress: 0 },
    { name: "Présentation finale", status: "pending", progress: 0 },
  ]

  const studyDetails = {
    title: "Étude de marché - Secteur IT",
    startDate: "01/03/2024",
    endDate: "30/06/2024",
    consultant: {
      name: "Marie Dupont",
      phone: "+33 6 12 34 56 78",
      email: "marie.dupont@example.com"
    },
    budget: "15000000",
    currentPhase: "Phase quantitative",
  }

  const nextMilestones = [
    {
      date: "15/04/2024",
      title: "Présentation intermédiaire",
      description: "Résultats de la phase quantitative",
    },
    {
      date: "30/04/2024",
      title: "Début phase qualitative",
      description: "Lancement des entretiens",
    },
  ]

  return (
    <div className="space-y-6">
      <StudyHeader
        currentPhase={studyDetails.currentPhase}
        progress={60}
        consultant={studyDetails.consultant}
        budget={studyDetails.budget}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Progression de l'étude</CardTitle>
          </CardHeader>
          <CardContent>
            <StudyProgress phases={studyPhases} />
          </CardContent>
        </Card>

        <StudyMilestones milestones={nextMilestones} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détails de l'étude</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Date de début
                </h4>
                <p>{studyDetails.startDate}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Date de fin prévue
                </h4>
                <p>{studyDetails.endDate}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Documents associés
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Proposition commerciale</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Planning détaillé</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <CallbackRequest />
    </div>
  )
}

export default StudyDetails