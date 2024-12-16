import { useQuery } from "@tanstack/react-query"
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
}

export const UpcomingAppointments = () => {
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>()
  const [rescheduleTime, setRescheduleTime] = useState("09:00")
  const [reason, setReason] = useState("")

  const { data: upcomingMeetings, isLoading } = useQuery({
    queryKey: ['upcoming-meetings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_meetings')
        .select(`
          id,
          title,
          date,
          description,
          location,
          status
        `)
        .gt('date', new Date().toISOString())
        .order('date', { ascending: true })

      if (error) throw error
      return data as Meeting[]
    }
  })

  const handleRescheduleRequest = async (meetingId: string) => {
    if (!rescheduleDate) {
      toast.error("Veuillez sélectionner une nouvelle date")
      return
    }
    
    // Combine date and time
    const dateTime = new Date(rescheduleDate)
    const [hours, minutes] = rescheduleTime.split(":")
    dateTime.setHours(parseInt(hours), parseInt(minutes))
    
    const { error } = await supabase
      .from('meeting_reschedule_requests')
      .insert({
        meeting_id: meetingId,
        requested_date: dateTime.toISOString(),
        reason: reason
      })

    if (error) {
      console.error('Error requesting reschedule:', error)
      toast.error("Erreur lors de la demande de report")
      return
    }

    toast.success("Demande de report envoyée")
    setReason("")
    setRescheduleDate(undefined)
    setRescheduleTime("09:00")
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
          <Dialog>
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