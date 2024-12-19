import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"
import { toast } from "sonner"
import ReportUploadDialog from "./ReportUploadDialog"

interface Meeting {
  id: string
  title: string
  date: string
  description: string | null
  meeting_reports: {
    id: string
    file_path: string
    created_at: string
  }[] | null
}

const MeetingsList = ({ studyId }: { studyId: string }) => {
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null)

  const { data: meetings, isLoading } = useQuery({
    queryKey: ['study-meetings', studyId],
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
            file_path,
            created_at
          )
        `)
        .eq('study_id', studyId)
        .order('date', { ascending: false })

      if (error) {
        console.error('Error fetching meetings:', error)
        throw error
      }

      return data as Meeting[]
    }
  })

  const handleDownload = async (filePath: string, meetingTitle: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(filePath)

      if (error) throw error

      const url = URL.createObjectURL(data)
      const link = document.createElement('a')
      link.href = url
      link.download = `compte-rendu-${meetingTitle}.${filePath.split('.').pop()}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success('Document téléchargé avec succès')
    } catch (error) {
      console.error('Error downloading document:', error)
      toast.error('Erreur lors du téléchargement du document')
    }
  }

  if (isLoading) {
    return <div>Chargement des rendez-vous...</div>
  }

  return (
    <div className="space-y-4">
      {meetings?.map((meeting) => (
        <div key={meeting.id} className="p-4 border rounded-lg space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{meeting.title}</h4>
              {meeting.description && (
                <p className="text-sm text-muted-foreground">
                  {meeting.description}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                {new Date(meeting.date).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedMeetingId(meeting.id)}
            >
              <FileText className="w-4 h-4 mr-2" />
              Ajouter un compte rendu
            </Button>
          </div>

          {meeting.meeting_reports && meeting.meeting_reports.length > 0 && (
            <div className="mt-4 space-y-2">
              <h5 className="text-sm font-medium">Comptes rendus</h5>
              {meeting.meeting_reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-2 bg-muted rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">
                      Compte rendu du {new Date(report.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(report.file_path, meeting.title)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <ReportUploadDialog
        meetingId={selectedMeetingId || ''}
        isOpen={!!selectedMeetingId}
        onClose={() => setSelectedMeetingId(null)}
      />
    </div>
  )
}

export default MeetingsList