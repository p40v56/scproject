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
import { Calendar, Clock, MapPin, Upload } from "lucide-react"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface StudyMeetingsSectionProps {
  studyId: string
}

interface MeetingReport {
  id: string
  file_path: string
  created_at: string
}

const StudyMeetingsSection = ({ studyId }: StudyMeetingsSectionProps) => {
  const [isAddMeetingDialogOpen, setIsAddMeetingDialogOpen] = useState(false)
  const [isUploadReportDialogOpen, setIsUploadReportDialogOpen] = useState(false)
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: meetings, isLoading } = useQuery({
    queryKey: ['study-meetings', studyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_meetings')
        .select(`
          *,
          meeting_reports (
            id,
            file_path,
            created_at
          )
        `)
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

  const uploadReportMutation = useMutation({
    mutationFn: async ({ meetingId, file }: { meetingId: string, file: File }) => {
      const fileExt = file.name.split('.').pop()
      const filePath = `meeting-reports/${meetingId}/${crypto.randomUUID()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { error: dbError } = await supabase
        .from('meeting_reports')
        .insert({
          meeting_id: meetingId,
          file_path: filePath,
        })

      if (dbError) throw dbError
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-meetings', studyId] })
      setIsUploadReportDialogOpen(false)
      setSelectedMeetingId(null)
      toast.success('Compte-rendu uploadé avec succès')
    },
    onError: (error) => {
      console.error('Error uploading report:', error)
      toast.error('Erreur lors de l\'upload du compte-rendu')
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
    }
    createMeetingMutation.mutate(data)
  }

  const handleUploadReport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMeetingId) return

    const formData = new FormData(e.target as HTMLFormElement)
    const file = formData.get('file') as File

    if (!file) {
      toast.error('Veuillez sélectionner un fichier')
      return
    }

    uploadReportMutation.mutate({ meetingId: selectedMeetingId, file })
  }

  const now = new Date()
  const upcomingMeetings = meetings?.filter(m => new Date(m.date) > now) || []
  const pastMeetings = meetings?.filter(m => new Date(m.date) <= now) || []

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
          <Tabs defaultValue="upcoming" className="space-y-4">
            <TabsList>
              <TabsTrigger value="upcoming">À venir ({upcomingMeetings.length})</TabsTrigger>
              <TabsTrigger value="past">Historique ({pastMeetings.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              <div className="space-y-4">
                {upcomingMeetings.map((meeting) => (
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
                {upcomingMeetings.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Aucun rendez-vous à venir
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="past">
              <div className="space-y-4">
                {pastMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="p-4 border rounded-lg space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedMeetingId(meeting.id)
                          setIsUploadReportDialogOpen(true)
                        }}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {meeting.meeting_reports?.length > 0 ? 'Modifier CR' : 'Ajouter CR'}
                      </Button>
                    </div>
                    {meeting.meeting_reports?.map((report: MeetingReport) => (
                      <div key={report.id} className="mt-2 text-sm text-muted-foreground">
                        Compte-rendu ajouté le {new Date(report.created_at).toLocaleDateString()}
                      </div>
                    ))}
                  </div>
                ))}
                {pastMeetings.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Aucun rendez-vous passé
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isUploadReportDialogOpen} onOpenChange={setIsUploadReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload du compte-rendu</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUploadReport} className="space-y-4">
            <div>
              <Label htmlFor="file">Fichier</Label>
              <Input
                id="file"
                name="file"
                type="file"
                accept=".pdf,.doc,.docx"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsUploadReportDialogOpen(false)
                  setSelectedMeetingId(null)
                }}
              >
                Annuler
              </Button>
              <Button type="submit">
                Upload
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default StudyMeetingsSection