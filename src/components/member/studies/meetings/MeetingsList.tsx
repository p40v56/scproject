import { Calendar, Clock, MapPin, Upload, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { useQueryClient } from "@tanstack/react-query"

interface Meeting {
  id: string
  title: string
  description?: string
  date: string
  location?: string
  meeting_reports?: {
    id: string
    file_path: string
    created_at: string
  }[]
  meeting_reschedule_requests?: {
    id: string
    requested_date: string
    reason: string
    status: string
  }[]
}

interface MeetingsListProps {
  meetings: Meeting[]
  onUploadReport?: (meetingId: string) => void
  showUploadButton?: boolean
}

const MeetingsList = ({ meetings, onUploadReport, showUploadButton }: MeetingsListProps) => {
  const queryClient = useQueryClient()

  const handleRescheduleResponse = async (meetingId: string, requestId: string, approved: boolean) => {
    // First update the reschedule request status
    const { error: requestError } = await supabase
      .from('meeting_reschedule_requests')
      .update({
        status: approved ? 'approved' : 'rejected'
      })
      .eq('id', requestId)

    if (requestError) {
      console.error('Error updating reschedule request:', requestError)
      toast.error("Erreur lors de la mise à jour de la demande")
      return
    }

    if (approved) {
      // If approved, update the meeting date
      const request = meetings
        .find(m => m.id === meetingId)
        ?.meeting_reschedule_requests?.[0]

      if (!request) {
        toast.error("Demande introuvable")
        return
      }

      const { error: meetingError } = await supabase
        .from('study_meetings')
        .update({
          date: request.requested_date
        })
        .eq('id', meetingId)

      if (meetingError) {
        console.error('Error updating meeting date:', meetingError)
        toast.error("Erreur lors de la mise à jour du rendez-vous")
        return
      }
    }

    // Refresh the meetings data
    await queryClient.invalidateQueries({ queryKey: ['study-meetings'] })
    
    toast.success(approved ? "Demande de report approuvée" : "Demande de report refusée")
  }

  return (
    <div className="space-y-4">
      {meetings.map((meeting) => (
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
                {meeting.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{meeting.location}</span>
                  </div>
                )}
              </div>
              {meeting.description && (
                <p className="text-sm mt-2">{meeting.description}</p>
              )}

              {meeting.meeting_reschedule_requests?.[0] && (
                <div className="mt-4 p-3 bg-muted rounded-lg border border-muted-foreground/20">
                  <div className="flex items-center gap-2 text-orange-500 mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Demande de report en attente</span>
                  </div>
                  <p className="text-sm line-through">
                    Date actuelle: {new Date(meeting.date).toLocaleDateString()} à {new Date(meeting.date).toLocaleTimeString()}
                  </p>
                  <p className="text-sm">
                    Nouvelle date souhaitée: {new Date(meeting.meeting_reschedule_requests[0].requested_date).toLocaleDateString()} à {new Date(meeting.meeting_reschedule_requests[0].requested_date).toLocaleTimeString()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Motif: {meeting.meeting_reschedule_requests[0].reason}
                  </p>
                  
                  {meeting.meeting_reschedule_requests[0].status === 'pending' && (
                    <div className="flex gap-2 mt-3">
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => handleRescheduleResponse(meeting.id, meeting.meeting_reschedule_requests![0].id, true)}
                      >
                        Accepter
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRescheduleResponse(meeting.id, meeting.meeting_reschedule_requests![0].id, false)}
                      >
                        Refuser
                      </Button>
                    </div>
                  )}

                  {meeting.meeting_reschedule_requests[0].status === 'approved' && (
                    <p className="text-sm text-green-500 font-medium mt-2">
                      Report approuvé
                    </p>
                  )}

                  {meeting.meeting_reschedule_requests[0].status === 'rejected' && (
                    <p className="text-sm text-red-500 font-medium mt-2">
                      Report refusé
                    </p>
                  )}
                </div>
              )}
            </div>
            {showUploadButton && onUploadReport && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUploadReport(meeting.id)}
              >
                <Upload className="h-4 w-4 mr-2" />
                {meeting.meeting_reports?.length > 0 ? 'Modifier CR' : 'Ajouter CR'}
              </Button>
            )}
          </div>
          {meeting.meeting_reports?.map((report) => (
            <div key={report.id} className="mt-2 text-sm text-muted-foreground">
              Compte-rendu ajouté le {new Date(report.created_at).toLocaleDateString()}
            </div>
          ))}
        </div>
      ))}
      {meetings.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          Aucun rendez-vous
        </p>
      )}
    </div>
  )
}

export default MeetingsList