export interface Meeting {
  id: string
  title: string
  date: string
  description: string | null
  meeting_reports: {
    id: string
    file_path: string
  }[] | null
}