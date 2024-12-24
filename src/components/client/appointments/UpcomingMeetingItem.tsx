import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RescheduleDialog } from "./RescheduleDialog"
import type { Meeting } from "./types"

interface UpcomingMeetingItemProps {
  meeting: Meeting
  onRescheduleSuccess: () => void
}

export const UpcomingMeetingItem = ({ 
  meeting,
  onRescheduleSuccess
}: UpcomingMeetingItemProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const hasPendingRequest = meeting.meeting_reschedule_requests?.some(
    req => req.status === 'pending'
  )

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
          <p className="text-sm mt-1">
            Statut: {meeting.status === 'pending' ? 'En attente de confirmation' : 'Confirmé'}
          </p>
          
          {hasPendingRequest && (
            <div className="mt-2 p-2 bg-muted rounded-md">
              <p className="text-sm font-medium">Demande de report en cours</p>
              <p className="text-sm line-through">
                Date actuelle: {new Date(meeting.date).toLocaleDateString()} à{" "}
                {new Date(meeting.date).toLocaleTimeString()}
              </p>
              {meeting.meeting_reschedule_requests?.map((request, index) => (
                request.status === 'pending' && (
                  <div key={index}>
                    <p className="text-sm">
                      Nouvelle date souhaitée: {new Date(request.requested_date).toLocaleDateString()} à{" "}
                      {new Date(request.requested_date).toLocaleTimeString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Motif: {request.reason}
                    </p>
                    <p className="text-sm font-medium mt-1">
                      Statut: En attente de confirmation
                    </p>
                  </div>
                )
              ))}
            </div>
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
      
      {!hasPendingRequest ? (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsDialogOpen(true)}
        >
          Demander un report
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          Report demandé - En attente de confirmation
        </Button>
      )}

      <RescheduleDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        meetingId={meeting.id}
        onRescheduleSuccess={onRescheduleSuccess}
      />
    </div>
  )
}