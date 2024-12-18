import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import StudyProgress from "./StudyProgress"
import StudyHeader from "./study/StudyHeader"
import StudyMilestones from "./study/StudyMilestones"
import CallbackRequest from "./study/CallbackRequest"
import { useAuth } from "@/components/auth/AuthProvider"
import Documents from "./Documents"

type Phase = {
  name: string;
  status: "completed" | "in-progress" | "pending";
  progress: number;
}

type Consultant = {
  name: string;
  email: string;
}

const StudyDetails = () => {
  const { session } = useAuth()

  const { data: study, isLoading, error } = useQuery({
    queryKey: ['client-study'],
    queryFn: async () => {
      console.log("Fetching study for client:", session?.user?.id)

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
            progress,
            order
          ),
          study_meetings(
            id,
            title,
            date,
            status
          )
        `)
        .eq('client_id', session?.user?.id)
        .maybeSingle()

      if (error) {
        console.error("Error fetching study:", error)
        throw error
      }
      
      console.log("Fetched study data:", data)
      return data
    },
    enabled: !!session?.user?.id,
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep data in cache for 5 minutes (renamed from cacheTime)
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">Chargement de votre étude...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-red-500">Une erreur est survenue lors du chargement de votre étude.</p>
      </div>
    )
  }

  if (!study) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">Aucune étude trouvée</p>
      </div>
    )
  }

  // Transform study phases into expected format
  const studyPhases = study.study_phases
    ?.sort((a, b) => (a.order || 0) - (b.order || 0))
    ?.map(phase => ({
      name: phase.name,
      status: phase.status === 'completed' ? 'completed' as const : 
             phase.status === 'in_progress' ? 'in-progress' as const : 
             'pending' as const,
      progress: phase.progress || 0
    })) || []

  // Calculate current phase
  const currentPhase = studyPhases.find(p => p.status === 'in-progress')?.name || 'En attente'

  // Calculate overall progress
  const overallProgress = studyPhases.length > 0
    ? Math.round(studyPhases.reduce((acc, phase) => acc + phase.progress, 0) / studyPhases.length)
    : 0

  // Filter confirmed upcoming meetings
  const upcomingMeetings = study.study_meetings
    ?.filter(meeting => 
      meeting.status === 'confirmed' && 
      new Date(meeting.date) > new Date()
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    || []

  // Prepare next milestones
  const nextMilestones = [
    ...upcomingMeetings.map(meeting => ({
      date: new Date(meeting.date).toLocaleDateString('fr-FR'),
      title: meeting.title,
      description: "Rendez-vous confirmé",
    })),
    {
      date: study.end_date ? new Date(study.end_date).toLocaleDateString('fr-FR') : 'Non définie',
      title: "Fin prévue de l'étude",
      description: "Date de livraison finale",
    }
  ]

  // Prepare consultant information
  const consultant: Consultant = {
    name: study.assigned_member ? 
      `${study.assigned_member.first_name || ''} ${study.assigned_member.last_name || ''}`.trim() 
      : 'Non assigné',
    email: study.assigned_member?.email || 'Non renseigné'
  }

  return (
    <div className="space-y-6">
      <StudyHeader
        currentPhase={currentPhase}
        progress={overallProgress}
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