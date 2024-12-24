import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import type { Meeting } from "./types"
import { UpcomingMeetingItem } from "./UpcomingMeetingItem"

export const UpcomingAppointments = () => {
  const queryClient = useQueryClient()

  const { data: upcomingMeetings, isLoading } = useQuery({
    queryKey: ['upcoming-meetings'],
    queryFn: async () => {
      console.log("Fetching upcoming meetings...")
      const { data, error } = await supabase
        .from('study_meetings')
        .select(`
          id,
          title,
          date,
          description,
          location,
          status,
          meeting_reschedule_requests!left (
            id,
            requested_date,
            reason,
            status
          )
        `)
        .gt('date', new Date().toISOString())
        .order('date', { ascending: true })

      if (error) {
        console.error('Error fetching meetings:', error)
        throw error
      }
      
      console.log('Upcoming meetings with requests:', data)
      return data.map((meeting: any) => ({
        ...meeting,
        meeting_reschedule_requests: meeting.meeting_reschedule_requests || []
      })) as Meeting[]
    }
  })

  const handleRescheduleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['upcoming-meetings'] })
  }

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <div className="space-y-4">
      {upcomingMeetings?.map((meeting) => (
        <UpcomingMeetingItem
          key={meeting.id}
          meeting={meeting}
          onRescheduleSuccess={handleRescheduleSuccess}
        />
      ))}
      {(!upcomingMeetings || upcomingMeetings.length === 0) && (
        <p className="text-center text-muted-foreground py-4">
          Aucun rendez-vous à venir
        </p>
      )}
    </div>
  )
}