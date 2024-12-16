import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, Clock, MapPin } from "lucide-react"
import { toast } from "sonner"

interface StudyMeetingsSectionProps {
  studyId: string
}

const StudyMeetingsSection = ({ studyId }: StudyMeetingsSectionProps) => {
  const [isAddMeetingDialogOpen, setIsAddMeetingDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: meetings, isLoading } = useQuery({
    queryKey: ['study-meetings', studyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_meetings')
        .select('*')
        .eq('study_id', studyId)
        .order('date', { ascending: true })

      if (error) throw error
      return data
    },
  })

  const createMeetingMutation = useMutation({
    mutationFn: async (formData: any) => {
      const { data, error } = await supabase
        .from('study_meetings')
        .insert([{ ...formData, study_id: studyId }])
        .select()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-meetings', studyId] })
      setIsAddMeetingDialogOpen(false)
      toast.success('Rendez-vous ajouté avec succès')
    },
    onError: (error) => {
      console.error('Error creating meeting:', error)
      toast.error('Erreur lors de la création du rendez-vous')
    },
  })

  const handleAddMeeting = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      date: new Date(formData.get('date') as string).toISOString(),
      location: formData.get('location'),
      meeting_type: formData.get('meeting_type'),
    }
    createMeetingMutation.mutate(data)
  }

  if (isLoading) {
    return <div>Chargement des rendez-vous...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Rendez-vous</CardTitle>
          <Dialog open={isAddMeetingDialogOpen} onOpenChange={setIsAddMeetingDialogOpen}>
            <DialogTrigger asChild>
              <Button>Nouveau rendez-vous</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouveau rendez-vous</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddMeeting} className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre</Label>
                  <Input id="title" name="title" required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" name="date" type="datetime-local" required />
                  </div>
                  <div>
                    <Label htmlFor="location">Lieu</Label>
                    <Input id="location" name="location" required />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Ajouter
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {meetings?.map((meeting) => (
              <div
                key={meeting.id}
                className="p-4 border rounded-lg space-y-2"
              >
                <h4 className="font-medium">{meeting.title}</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(meeting.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(meeting.date).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{meeting.location}</span>
                  </div>
                </div>
                {meeting.description && (
                  <p className="text-sm mt-2">{meeting.description}</p>
                )}
              </div>
            ))}
            {(!meetings || meetings.length === 0) && (
              <p className="text-center text-muted-foreground py-8">
                Aucun rendez-vous planifié
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StudyMeetingsSection