import { Card, CardContent } from "@/components/ui/card"
import StudyProgress from "./StudyProgress"
import StudyHeader from "./study/StudyHeader"
import StudyMilestones from "./study/StudyMilestones"
import CallbackRequest from "./study/CallbackRequest"
import Documents from "./Documents"
import { useClientStudy } from "@/hooks/useClientStudy"
import { 
  transformStudyPhases, 
  calculateOverallProgress, 
  getUpcomingMilestones,
  getCurrentPhase 
} from "@/utils/studyTransformations"

const StudyDetails = () => {
  const { data: study, isLoading, error } = useClientStudy()

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

  // Transform study data
  const studyPhases = transformStudyPhases(study.study_phases || [])
  const currentPhase = getCurrentPhase(studyPhases)
  const overallProgress = calculateOverallProgress(studyPhases)
  const nextMilestones = getUpcomingMilestones(study.study_meetings || [], study.end_date)

  // Prepare consultant information
  const consultant = {
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
          <CardContent className="p-6">
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