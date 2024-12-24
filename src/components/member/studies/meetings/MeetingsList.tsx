import { Button } from "@/components/ui/button"
import { FileText, Download, Clock } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { Badge } from "@/components/ui/badge"
import { useQueryClient } from "@tanstack/react-query"

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
  meeting_reschedule_requests: {
    id: string
    requested_date: string
    reason: string | null
    status: string
  }[] | null
}

interface MeetingsListProps {
  meetings: Meeting[]
  onUploadReport: (meetingId: string) => void
  showUploadButton?: boolean
}

const MeetingsList = ({ meetings, onUploadReport, showUploadButton = true }: MeetingsListProps) => {
  const queryClient = useQueryClient()

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

  const handleRescheduleResponse = async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('meeting_reschedule_requests')
        .update({ status })
        .eq('id', requestId)

      if (error) throw error

      // Refresh the meetings data
      await queryClient.invalidateQueries({ queryKey: ['study-meetings'] })

      toast.success(`Demande de report ${status === 'accepted' ? 'acceptée' : 'refusée'}`)
    } catch (error) {
      console.error('Error updating reschedule request:', error)
      toast.error('Erreur lors de la mise à jour de la demande')
    }
  }

  const isPastMeeting = (date: string) => new Date(date) < new Date()

  return (
    <div className="space-y-4">
      {meetings?.map((meeting) => {
        const pendingRequest = meeting.meeting_reschedule_requests?.find(
          request => request.status === 'pending'
        )
        const meetingDate = new Date(meeting.date)
        const isPast = isPastMeeting(meeting.date)

        return (
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
                  {meetingDate.toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>

                {pendingRequest && (
                  <div className="mt-2 space-y-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Demande de report en attente
                    </Badge>
                    <div className="text-sm">
                      <p>Nouvelle date souhaitée: {new Date(pendingRequest.requested_date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                      {pendingRequest.reason && (
                        <p className="text-muted-foreground">Motif: {pendingRequest.reason}</p>
                      )}
                      <div className="mt-2 flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleRescheduleResponse(pendingRequest.id, 'accepted')}
                        >
                          Accepter
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRescheduleResponse(pendingRequest.id, 'rejected')}
                        >
                          Refuser
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {showUploadButton && isPast && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUploadReport(meeting.id)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Ajouter un compte rendu
                </Button>
              )}
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
        )
      })}
    </div>
  )
}

export default MeetingsList