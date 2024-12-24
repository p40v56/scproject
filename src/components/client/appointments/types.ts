export interface Meeting {
  id: string
  title: string
  date: string
  description: string | null
  study_id: string
  meeting_reports: {
    id: string
    file_path: string
    created_at: string
  } | null
  meeting_reschedule_requests?: {
    id: string
    requested_date: string
    reason: string | null
    status: string
  }[] | null
}