import { Button } from "@/components/ui/button"
import { formatDate } from "../utils/date"

interface CallbackRequestCardProps {
  request: {
    id: string
    created_at: string
    reason: string
    profiles?: {
      first_name: string | null
      last_name: string | null
    }
    studies?: {
      title: string
    }
  }
  onComplete: (id: string) => void
}

export const CallbackRequestCard = ({ request, onComplete }: CallbackRequestCardProps) => {
  return (
    <div className="flex items-start justify-between gap-4 p-4 bg-muted rounded-lg">
      <div className="space-y-1">
        <p className="font-medium">
          {request.profiles?.first_name} {request.profiles?.last_name}
        </p>
        <p className="text-sm text-muted-foreground">
          Demande du {formatDate(request.created_at)}
        </p>
        <p className="text-sm mt-2">{request.reason}</p>
        {request.studies && (
          <p className="text-sm text-muted-foreground">
            Pour l'étude : {request.studies.title}
          </p>
        )}
      </div>
      <Button 
        size="sm"
        onClick={() => onComplete(request.id)}
      >
        Marquer comme effectué
      </Button>
    </div>
  )
}