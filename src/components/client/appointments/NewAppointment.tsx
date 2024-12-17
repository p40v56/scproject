import { useState } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "@/components/auth/AuthProvider"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

const NewAppointment = () => {
  const { studyId } = useParams()
  const { session } = useAuth()
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !time || !location) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    setIsSubmitting(true)
    try {
      const [hours, minutes] = time.split(":")
      const meetingDate = new Date(date)
      meetingDate.setHours(parseInt(hours), parseInt(minutes))

      const { data, error } = await supabase
        .from('study_meetings')
        .insert({
          study_id: studyId,
          title: `Rendez-vous du ${format(meetingDate, 'dd MMMM yyyy à HH:mm', { locale: fr })}`,
          date: meetingDate.toISOString(),
          location,
          description,
          status: 'pending'
        })
        .select()
        .single()

      if (error) throw error

      toast.success("Demande de rendez-vous envoyée avec succès")
      setDate(undefined)
      setTime("")
      setLocation("")
      setDescription("")
    } catch (error) {
      console.error('Error creating meeting:', error)
      toast.error("Erreur lors de la création du rendez-vous")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Date
          </label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            disabled={(date) => date < new Date()}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Heure
          </label>
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Lieu
          </label>
          <Input
            placeholder="Ex: Visioconférence, Bureau..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Description (optionnel)
          </label>
          <Textarea
            placeholder="Précisions sur le rendez-vous..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Envoi en cours..." : "Demander le rendez-vous"}
      </Button>
    </form>
  )
}

export default NewAppointment