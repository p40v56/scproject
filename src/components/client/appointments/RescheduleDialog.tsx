import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"

interface RescheduleDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  meetingId: string
  onRescheduleSuccess: () => void
}

export const RescheduleDialog = ({
  isOpen,
  onOpenChange,
  meetingId,
  onRescheduleSuccess,
}: RescheduleDialogProps) => {
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>()
  const [rescheduleTime, setRescheduleTime] = useState("09:00")
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRescheduleRequest = async () => {
    if (!rescheduleDate) {
      toast.error("Veuillez sélectionner une nouvelle date")
      return
    }

    setIsSubmitting(true)
    
    try {
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

      toast.success("Demande de report envoyée")
      onRescheduleSuccess()
      onOpenChange(false)
      setReason("")
      setRescheduleDate(undefined)
      setRescheduleTime("09:00")
    } catch (error) {
      console.error('Error in reschedule request:', error)
      toast.error("Une erreur est survenue")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
            onClick={handleRescheduleRequest}
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer la demande"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}