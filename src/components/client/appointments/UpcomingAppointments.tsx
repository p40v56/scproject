import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { toast } from "sonner"

interface Meeting {
  id: string
  title: string
  date: string
  description: string | null
  location: string | null
}

export const UpcomingAppointments = () => {
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>()

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
          studies!inner(client_id)
        `)
        .gt('date', new Date().toISOString())
        .order('date', { ascending: true })

      if (error) throw error
      return data as Meeting[]
    }
  })

  const handleReschedule = async (meetingId: string) => {
    if (!rescheduleDate) {
      toast.error("Veuillez sélectionner une nouvelle date")
      return
    }
    
    const { error } = await supabase
      .from('study_meetings')
      .update({ date: rescheduleDate.toISOString() })
      .eq('id', meetingId)

    if (error) {
      toast.error("Erreur lors de la demande de report")
      return
    }

    toast.success("Demande de report envoyée")
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
                <Button
                  onClick={() => handleReschedule(meeting.id)}
                  className="w-full"
                >
                  Confirmer le report
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