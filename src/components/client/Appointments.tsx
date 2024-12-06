import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const Appointments = () => {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>()

  const upcomingAppointments = [
    {
      id: 1,
      date: "15 Avril 2024",
      time: "14:00",
      subject: "Présentation intermédiaire",
      with: "Marie Dupont",
    },
    {
      id: 2,
      date: "22 Avril 2024",
      time: "10:00",
      subject: "Point d'avancement",
      with: "Jean Martin",
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !subject) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }
    toast.success("Demande de rendez-vous envoyée")
  }

  const handleReschedule = (appointmentId: number) => {
    if (!rescheduleDate) {
      toast.error("Veuillez sélectionner une nouvelle date")
      return
    }
    toast.success("Demande de report envoyée")
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Planifier un rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date souhaitée</label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sujet</label>
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
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rendez-vous à venir</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex flex-col space-y-2 p-4 border rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{appointment.subject}</h4>
                    <p className="text-sm text-muted-foreground">
                      avec {appointment.with}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{appointment.date}</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.time}
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
                        onClick={() => handleReschedule(appointment.id)}
                        className="w-full"
                      >
                        Confirmer le report
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Appointments