import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MeetingsList from "./meetings/MeetingsList"
import ReportUploadDialog from "./meetings/ReportUploadDialog"

interface StudyMeetingsSectionProps {
  studyId: string
}

const StudyMeetingsSection = ({ studyId }: StudyMeetingsSectionProps) => {
  const [isUploadReportDialogOpen, setIsUploadReportDialogOpen] = useState(false)
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null)

  const { data: meetings, isLoading } = useQuery({
    queryKey: ['study-meetings', studyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_meetings')
        .select(`
          *,
          meeting_reports (
            id,
            file_path,
            created_at
          )
        `)
        .eq('study_id', studyId)
        .order('date', { ascending: true })

      if (error) throw error
      return data
    },
  })

  const now = new Date()
  const upcomingMeetings = meetings?.filter(m => new Date(m.date) > now) || []
  const pastMeetings = meetings?.filter(m => new Date(m.date) <= now) || []

  const handleUploadReport = (meetingId: string) => {
    setSelectedMeetingId(meetingId)
    setIsUploadReportDialogOpen(true)
  }

  if (isLoading) {
    return <div>Chargement des rendez-vous...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rendez-vous</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">À venir ({upcomingMeetings.length})</TabsTrigger>
            <TabsTrigger value="past">Historique ({pastMeetings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <MeetingsList meetings={upcomingMeetings} />
          </TabsContent>

          <TabsContent value="past">
            <MeetingsList
              meetings={pastMeetings}
              onUploadReport={handleUploadReport}
              showUploadButton
            />
          </TabsContent>
        </Tabs>
      </CardContent>

      <ReportUploadDialog
        meetingId={selectedMeetingId || ''}
        isOpen={isUploadReportDialogOpen}
        onClose={() => {
          setIsUploadReportDialogOpen(false)
          setSelectedMeetingId(null)
        }}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['study-meetings', studyId] })
        }}
      />
    </Card>
  )
}

export default StudyMeetingsSection