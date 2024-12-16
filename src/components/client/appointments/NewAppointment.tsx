import { useState } from "react"
import { useParams } from "react-router-dom"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { format } from "date-fns"

export const NewAppointment = () => {
  const { studyId } = useParams()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState("09:00")
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!date || !subject || !time || !studyId) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    // Combine date and time
    const dateTime = new Date(date)
    const [hours, minutes] = time.split(":")
    dateTime.setHours(parseInt(hours), parseInt(minutes))

    const { error } = await supabase
      .from('study_meetings')
      .insert({
        study_id: studyId,
        title: subject,
        description,
        date: dateTime.toISOString(),
        status: 'pending'
      })

    if (error) {
      console.error('Error creating appointment:', error)
      toast.error("Erreur lors de la création du rendez-vous")
      return
    }

    toast.success("Demande de rendez-vous envoyée")
    setSubject("")
    setDescription("")
    setDate(new Date())
    setTime("09:00")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Date souhaitée*</label>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Heure souhaitée*</label>
        <Input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Sujet*</label>
        <Input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Ex: Point d'avancement"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Détails supplémentaires..."
        />
      </div>

      <Button type="submit" className="w-full">
        Demander un rendez-vous
      </Button>

      <p className="text-sm text-muted-foreground">* Champs obligatoires</p>
    </form>
  )
}