import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Meeting } from "./types"
import { PastMeetingItem } from "./PastMeetingItem"

export const PastAppointments = () => {
  const { data: pastMeetings, isLoading } = useQuery({
    queryKey: ['past-meetings'],
    queryFn: async () => {
      console.log("Fetching past meetings...")
      const { data: meetings, error } = await supabase
        .from('study_meetings')
        .select(`
          id,
          title,
          date,
          description,
          meeting_reports (
            id,
            file_path
          )
        `)
        .lt('date', new Date().toISOString())
        .order('date', { ascending: false })

      if (error) {
        console.error('Error fetching meetings:', error)
        throw error
      }
      
      console.log('Raw meetings data:', meetings)
      meetings?.forEach(meeting => {
        console.log(`Meeting ${meeting.id}:`, meeting)
        console.log(`Meeting ${meeting.id} reports:`, meeting.meeting_reports)
      })
      
      return meetings as Meeting[]
    }
  })

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <div className="space-y-4">
      {pastMeetings?.map((meeting) => (
        <PastMeetingItem key={meeting.id} meeting={meeting} />
      ))}
      {(!pastMeetings || pastMeetings.length === 0) && (
        <p className="text-center text-muted-foreground py-4">
          Aucun rendez-vous passé
        </p>
      )}
    </div>
  )
}