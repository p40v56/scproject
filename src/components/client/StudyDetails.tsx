import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import StudyProgress from "./StudyProgress"
import StudyHeader from "./study/StudyHeader"
import StudyMilestones from "./study/StudyMilestones"
import CallbackRequest from "./study/CallbackRequest"
import { useAuth } from "@/components/auth/AuthProvider"
import Documents from "./Documents"

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
  } as const)) || []

  const nextMilestones = [
    {
      date: study.end_date ? new Date(study.end_date).toLocaleDateString('fr-FR') : 'Non définie',
      title: "Fin prévue de l'étude",
      description: "Date de livraison finale",
    }
  ]

  const consultant = study.assigned_member ? {
    name: `${study.assigned_member.first_name || ''} ${study.assigned_member.last_name || ''}`.trim() || 'Non assigné',
    email: study.assigned_member.email || 'Non renseigné'
  } : {
    name: 'Non assigné',
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

      <Documents />

      <CallbackRequest />
    </div>
  )
}

export default StudyDetails