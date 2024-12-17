import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

interface Meeting {
  id: string
  title: string
  date: string
  description: string | null
  location: string | null
  status: string
  meeting_reschedule_requests?: {
    id: string
    requested_date: string
    reason: string
    status: string
  }[]
}

export const UpcomingAppointments = () => {
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>()
  const [rescheduleTime, setRescheduleTime] = useState("09:00")
  const [reason, setReason] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
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

  const handleRescheduleRequest = async (meetingId: string) => {
    if (!rescheduleDate) {
      toast.error("Veuillez sélectionner une nouvelle date")
      return
    }
    
    const dateTime = new Date(rescheduleDate)
    const [hours, minutes] = rescheduleTime.split(":")
    dateTime.setHours(parseInt(hours), parseInt(minutes))
    
    const { error } = await supabase
      .from('meeting_reschedule_requests')
      .insert({
        meeting_id: meetingId,
        requested_date: dateTime.toISOString(),
        reason: reason,
        status: 'pending'
      })

    if (error) {
      console.error('Error requesting reschedule:', error)
      toast.error("Erreur lors de la demande de report")
      return
    }

    // Invalider le cache pour forcer un rafraîchissement
    await queryClient.invalidateQueries({ queryKey: ['upcoming-meetings'] })

    toast.success("Demande de report envoyée")
    setReason("")
    setRescheduleDate(undefined)
    setRescheduleTime("09:00")
    setIsDialogOpen(false)
  }

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <div className="space-y-4">
      {upcomingMeetings?.map((meeting) => (
        <div
          key={meeting.id}
          className="flex flex-col space-y-2 p-4 border rounded-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{meeting.title}</h4>
              {meeting.description && (
                <p className="text-sm text-muted-foreground">
                  {meeting.description}
                </p>
              )}
              <p className="text-sm mt-1">
                Statut: {meeting.status === 'pending' ? 'En attente de confirmation' : 'Confirmé'}
              </p>
              
              {meeting.meeting_reschedule_requests?.some(req => req.status === 'pending') && (
                <div className="mt-2 p-2 bg-muted rounded-md">
                  <p className="text-sm font-medium">Demande de report en cours</p>
                  <p className="text-sm line-through">
                    Date actuelle: {new Date(meeting.date).toLocaleDateString()} à {new Date(meeting.date).toLocaleTimeString()}
                  </p>
                  {meeting.meeting_reschedule_requests.map((request, index) => (
                    request.status === 'pending' && (
                      <div key={index}>
                        <p className="text-sm">
                          Nouvelle date souhaitée: {new Date(request.requested_date).toLocaleDateString()} à {new Date(request.requested_date).toLocaleTimeString()}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Motif: {request.reason}
                        </p>
                        <p className="text-sm font-medium mt-1">
                          Statut: En attente de confirmation
                        </p>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="font-medium">
                {new Date(meeting.date).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(meeting.date).toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          {!meeting.meeting_reschedule_requests?.some(req => req.status === 'pending') && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Demander un report
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reporter le rendez-vous</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Nouvelle date souhaitée
                    </label>
                    <Calendar
                      mode="single"
                      selected={rescheduleDate}
                      onSelect={setRescheduleDate}
                      className="rounded-md border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Nouvelle heure souhaitée
                    </label>
                    <Input
                      type="time"
                      value={rescheduleTime}
                      onChange={(e) => setRescheduleTime(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Motif du report
                    </label>
                    <Textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Veuillez indiquer la raison du report..."
                    />
                  </div>
                  <Button
                    onClick={() => handleRescheduleRequest(meeting.id)}
                    className="w-full"
                  >
                    Envoyer la demande
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          
          {meeting.meeting_reschedule_requests?.some(req => req.status === 'pending') && (
            <Button variant="outline" size="sm" disabled>
              Report demandé - En attente de confirmation
            </Button>
          )}
        </div>
      ))}
      {(!upcomingMeetings || upcomingMeetings.length === 0) && (
        <p className="text-center text-muted-foreground py-4">
          Aucun rendez-vous à venir
        </p>
      )}
    </div>
  )
}