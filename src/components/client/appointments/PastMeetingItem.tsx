import { useState } from "react"
import { Meeting } from "./types"
import { MeetingReportDownload } from "./MeetingReportDownload"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { MeetingDocumentUploadDialog } from "./MeetingDocumentUploadDialog"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface PastMeetingItemProps {
  meeting: Meeting
}

export const PastMeetingItem = ({ meeting }: PastMeetingItemProps) => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)

  // Check if the current user is a member
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single()

      return data
    }
  })

  const isMember = userProfile?.user_type === 'member'

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
      <div className="flex justify-between items-center">
        <div className="flex-1">
          {meeting.meeting_reports ? (
            <MeetingReportDownload 
              meetingReport={meeting.meeting_reports}
              meetingTitle={meeting.title}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Compte rendu non disponible
            </p>
          )}
        </div>
        {isMember && (
          <Button
            variant="outline"
            size="sm"
            className="ml-4"
            onClick={() => setIsUploadDialogOpen(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        )}
      </div>

      <MeetingDocumentUploadDialog
        isOpen={isUploadDialogOpen}
        setIsOpen={setIsUploadDialogOpen}
        meetingId={meeting.id}
        meetingTitle={meeting.title}
      />
    </div>
  )
}