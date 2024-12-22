import { Meeting } from "./types"
import { MeetingReportDownload } from "./MeetingReportDownload"

interface PastMeetingItemProps {
  meeting: Meeting
}

export const PastMeetingItem = ({ meeting }: PastMeetingItemProps) => {
  return (
    <div className="flex flex-col space-y-2 p-4 border rounded-lg">
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
        <MeetingReportDownload 
          meetingReports={meeting.meeting_reports}
          meetingTitle={meeting.title}
        />
      ) : (
        <p className="text-sm text-muted-foreground">
          Compte rendu non disponible
        </p>
      )}
    </div>
  )
}