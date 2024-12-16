import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import MeetingsList from "./meetings/MeetingsList"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import ReportUploadDialog from "./meetings/ReportUploadDialog"

interface StudyMeetingsSectionProps {
  studyId: string
}

const StudyMeetingsSection = ({ studyId }: StudyMeetingsSectionProps) => {
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)

  const { data: meetings, isLoading } = useQuery({
    queryKey: ['study-meetings', studyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_meetings')
        .select(`
          *,
          meeting_reports(*),
          meeting_reschedule_requests(*)
        `)
        .eq('study_id', studyId)
        .order('date', { ascending: true })

      if (error) throw error
      return data
    }
  })

  const handleUploadReport = (meetingId: string) => {
    setSelectedMeetingId(meetingId)
    setIsUploadDialogOpen(true)
  }

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Rendez-vous</h3>
        <Button variant="outline">Planifier un rendez-vous</Button>
      </div>

      <MeetingsList 
        meetings={meetings || []}
        onUploadReport={handleUploadReport}
        showUploadButton
      />

      <ReportUploadDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        meetingId={selectedMeetingId}
      />
    </div>
  )
}

export default StudyMeetingsSection