import { Calendar, Clock, MapPin, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

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
}

interface MeetingsListProps {
  meetings: Meeting[]
  onUploadReport?: (meetingId: string) => void
  showUploadButton?: boolean
}

const MeetingsList = ({ meetings, onUploadReport, showUploadButton }: MeetingsListProps) => {
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