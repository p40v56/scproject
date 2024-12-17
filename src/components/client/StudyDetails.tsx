import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"
import StudyProgress from "./StudyProgress"
import StudyHeader from "./study/StudyHeader"
import StudyMilestones from "./study/StudyMilestones"
import CallbackRequest from "./study/CallbackRequest"
import { useAuth } from "@/components/auth/AuthProvider"

const StudyDetails = () => {
  const { studyId } = useParams()
  const { session } = useAuth()

  const { data: study, isLoading } = useQuery({
    queryKey: ['client-study', studyId],
    queryFn: async () => {
      if (!studyId) throw new Error("Study ID is required")
      console.log("Fetching study with ID:", studyId)
      console.log("Current user ID:", session?.user?.id)

      const { data, error } = await supabase
        .from('studies')
        .select(`
          *,
          assigned_member:profiles!studies_assigned_member_id_fkey(
            id,
            first_name,
            last_name,
            email
          ),
          study_phases(
            id,
            name,
            status,
            progress
          )
        `)
        .eq('id', studyId)
        .eq('client_id', session?.user?.id)
        .single()

      if (error) {
        console.error("Error fetching study:", error)
        throw error
      }
      
      console.log("Fetched study data:", data)
      return data
    },
    enabled: !!studyId && !!session?.user?.id,
  })

  const { data: documents } = useQuery({
    queryKey: ['study-documents', studyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('study_id', studyId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!studyId,
  })

  if (isLoading) {
    return <div>Chargement...</div>
  }

  if (!study) {
    return <div>Étude non trouvée</div>
  }

  const studyPhases = study.study_phases?.map(phase => ({
    name: phase.name,
    status: phase.status === 'completed' ? 'completed' : 
           phase.status === 'in_progress' ? 'in-progress' : 'pending',
    progress: phase.progress || 0
  })) || []

  const nextMilestones = [
    {
      date: study.end_date ? new Date(study.end_date).toLocaleDateString('fr-FR') : 'Non définie',
      title: "Fin prévue de l'étude",
      description: "Date de livraison finale",
    }
  ]

  const consultant = study.assigned_member ? {
    name: `${study.assigned_member.first_name || ''} ${study.assigned_member.last_name || ''}`.trim() || 'Non assigné',
    phone: 'Non renseigné',
    email: study.assigned_member.email || 'Non renseigné'
  } : {
    name: 'Non assigné',
    phone: 'Non renseigné',
    email: 'Non renseigné'
  }

  return (
    <div className="space-y-6">
      <StudyHeader
        currentPhase={studyPhases.find(p => p.status === 'in-progress')?.name || 'En attente'}
        progress={studyPhases.reduce((acc, phase) => acc + phase.progress, 0) / studyPhases.length}
        consultant={consultant}
        budget={study.budget?.toString() || '0'}
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
                <p>{study.start_date ? new Date(study.start_date).toLocaleDateString('fr-FR') : 'Non définie'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Date de fin prévue
                </h4>
                <p>{study.end_date ? new Date(study.end_date).toLocaleDateString('fr-FR') : 'Non définie'}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Documents associés
              </h4>
              <div className="space-y-2">
                {documents?.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{doc.name}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {(!documents || documents.length === 0) && (
                  <p className="text-sm text-muted-foreground">Aucun document disponible</p>
                )}
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