import { Button } from "@/components/ui/button"
import { Pencil, Trash } from "lucide-react"
import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd"
import PhaseItem from "./PhaseItem"

interface PhaseListItemProps {
  phase: any
  studyId: string
  isDragging: boolean
  dragHandleProps?: DraggableProvidedDragHandleProps
  onEdit: (phase: any) => void
  onDelete: (phase: any) => void
}

const PhaseListItem = ({
  phase,
  studyId,
  isDragging,
  dragHandleProps,
  onEdit,
  onDelete
}: PhaseListItemProps) => {
  return (
    <div className={`relative transition-colors ${isDragging ? "bg-muted" : ""}`}>
      <div className="absolute right-2 top-2 z-10 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(phase)}
          className="h-8 w-8"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(phase)}
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <PhaseItem
        phase={phase}
        studyId={studyId}
        isDragging={isDragging}
        dragHandleProps={dragHandleProps}
      />
    </div>
  )
}

export default PhaseListItem