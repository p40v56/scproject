import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, MessageSquare, Phone } from "lucide-react"
import StudyProgress from "./StudyProgress"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

const StudyDetails = () => {
  const [showCallbackForm, setShowCallbackForm] = useState(false)
  const [callbackReason, setCallbackReason] = useState("")
  const { toast } = useToast()

  const studyPhases: {
    name: string;
    status: "completed" | "in-progress" | "pending";
    progress: number;
  }[] = [
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
    budget: "15 000 000",
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

  const handleCallbackRequest = () => {
    if (callbackReason.trim().length < 10) {
      toast({
        title: "Erreur",
        description: "Veuillez décrire la raison de votre demande (minimum 10 caractères)",
        variant: "destructive",
      })
      return
    }

    // TODO: Implement actual callback request logic here
    toast({
      title: "Demande envoyée",
      description: "Nous vous recontacterons dans les plus brefs délais",
    })
    setShowCallbackForm(false)
    setCallbackReason("")
  }

  const formatBudget = (budget: string) => {
    return budget.replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €"
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">État de l'étude</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studyDetails.currentPhase}</div>
            <p className="text-xs text-muted-foreground">60% complété</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Chargé de projet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studyDetails.consultant.name}</div>
            <div className="space-y-1 mt-2">
              <p className="text-sm text-muted-foreground">{studyDetails.consultant.phone}</p>
              <p className="text-sm text-muted-foreground">{studyDetails.consultant.email}</p>
              <Button variant="link" className="p-0 h-auto text-xs">
                <MessageSquare className="h-3 w-3 mr-1" />
                Contacter
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBudget(studyDetails.budget)}</div>
            <p className="text-xs text-muted-foreground">Budget total</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Progression de l'étude</CardTitle>
          </CardHeader>
          <CardContent>
            <StudyProgress phases={studyPhases} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prochaines étapes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nextMilestones.map((milestone, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{milestone.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {milestone.description}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {milestone.date}
                    </span>
                  </div>
                  {index < nextMilestones.length - 1 && (
                    <Separator className="my-2" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Besoin d'être rappelé ?
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showCallbackForm ? (
            <Button onClick={() => setShowCallbackForm(true)}>
              Demander à être rappelé
            </Button>
          ) : (
            <div className="space-y-4">
              <Textarea
                placeholder="Décrivez brièvement la raison de votre demande..."
                value={callbackReason}
                onChange={(e) => setCallbackReason(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex gap-2">
                <Button onClick={handleCallbackRequest}>
                  Envoyer la demande
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowCallbackForm(false)
                    setCallbackReason("")
                  }}
                >
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default StudyDetails