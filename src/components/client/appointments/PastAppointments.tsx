import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FileText } from "lucide-react"
import { toast } from "sonner"

interface Meeting {
  id: string
  title: string
  date: string
  description: string | null
  meeting_reports: {
    id: string
    file_path: string
  }[] | null
}

export const PastAppointments = () => {
  const { data: pastMeetings, isLoading } = useQuery({
    queryKey: ['past-meetings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_meetings')
        .select(`
          id,
          title,
          date,
          description,
          meeting_reports (
            id,
            file_path
          )
        `)
        .lt('date', new Date().toISOString())
        .order('date', { ascending: false })

      if (error) throw error
      console.log('Past meetings data:', data)
      return data as Meeting[]
    }
  })

  if (isLoading) {
    return <div>Chargement...</div>
  }

  const handleDownloadReport = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(filePath)
      
      if (error) {
        console.error('Download error:', error)
        toast.error("Erreur lors du téléchargement du compte rendu")
        return
      }

      // Créer un URL pour le fichier téléchargé
      const url = URL.createObjectURL(data)
      
      // Créer un lien temporaire pour le téléchargement
      const link = document.createElement('a')
      link.href = url
      link.download = filePath.split('/').pop() || 'compte-rendu.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Nettoyer l'URL
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
      toast.error("Erreur lors du téléchargement du compte rendu")
    }
  }

  return (
    <div className="space-y-4">
      {pastMeetings?.map((meeting) => (
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
          {meeting.meeting_reports && meeting.meeting_reports.length > 0 ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Voir le compte rendu
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Compte rendu - {meeting.title}</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  {meeting.meeting_reports.map((report) => (
                    <Button
                      key={report.id}
                      variant="outline"
                      className="w-full"
                      onClick={() => handleDownloadReport(report.file_path)}
                    >
                      Télécharger le compte rendu
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <p className="text-sm text-muted-foreground">
              Compte rendu non disponible
            </p>
          )}
        </div>
      ))}
      {(!pastMeetings || pastMeetings.length === 0) && (
        <p className="text-center text-muted-foreground py-4">
          Aucun rendez-vous passé
        </p>
      )}
    </div>
  )
}