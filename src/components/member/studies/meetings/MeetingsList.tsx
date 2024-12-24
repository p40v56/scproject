import MeetingItem from "./MeetingItem"

interface Meeting {
  id: string
  title: string
  date: string
  description: string | null
  meeting_reports: {
    id: string
    file_path: string
    created_at: string
  } | null
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
  const isPastMeeting = (date: string) => new Date(date) < new Date()

  return (
    <div className="space-y-4">
      {meetings?.map((meeting) => (
        <MeetingItem
          key={meeting.id}
          meeting={meeting}
          isPast={isPastMeeting(meeting.date)}
          onUploadReport={onUploadReport}
          showUploadButton={showUploadButton}
        />
      ))}
    </div>
  )
}

export default MeetingsList