import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import MeetingsList from "./meetings/MeetingsList"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import ReportUploadDialog from "./meetings/ReportUploadDialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
      console.log('Fetched meetings:', data)
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

  const now = new Date()
  const upcomingMeetings = meetings?.filter(meeting => new Date(meeting.date) >= now) || []
  const pastMeetings = meetings?.filter(meeting => new Date(meeting.date) < now) || []

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Rendez-vous</h3>
        <Button variant="outline">Planifier un rendez-vous</Button>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming">À venir ({upcomingMeetings.length})</TabsTrigger>
          <TabsTrigger value="past">Historique ({pastMeetings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <MeetingsList 
            meetings={upcomingMeetings}
            onUploadReport={handleUploadReport}
            showUploadButton
          />
        </TabsContent>

        <TabsContent value="past">
          <MeetingsList 
            meetings={pastMeetings}
            onUploadReport={handleUploadReport}
            showUploadButton
          />
        </TabsContent>
      </Tabs>

      {selectedMeetingId && (
        <ReportUploadDialog
          isOpen={isUploadDialogOpen}
          setIsOpen={setIsUploadDialogOpen}
          meetingId={selectedMeetingId}
        />
      )}
    </div>
  )
}

export default StudyMeetingsSection