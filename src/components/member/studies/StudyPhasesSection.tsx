import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import AddPhaseDialog from "./phases/AddPhaseDialog"
import PhaseItem from "./phases/PhaseItem"

interface StudyPhasesSectionProps {
  studyId: string
}

const StudyPhasesSection = ({ studyId }: StudyPhasesSectionProps) => {
  const [isAddPhaseDialogOpen, setIsAddPhaseDialogOpen] = useState(false)

  const { data: phases, isLoading } = useQuery({
    queryKey: ['study-phases', studyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_phases')
        .select('*')
        .eq('study_id', studyId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data
    },
  })

  const { data: missions } = useQuery({
    queryKey: ['study-missions', studyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('missions')
        .select('id, title')
        .eq('study_id', studyId)

      if (error) throw error
      return data
    },
  })

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !phases) return

    const items = Array.from(phases)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update the order in the database
    // Note: In a real application, you might want to store and update an explicit order field
    for (let i = 0; i < items.length; i++) {
      await supabase
        .from('study_phases')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', items[i].id)
    }
  }

  if (isLoading) {
    return <div>Chargement des phases...</div>
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Phases de l'étude</CardTitle>
        <Button onClick={() => setIsAddPhaseDialogOpen(true)}>
          Ajouter une phase
        </Button>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="phases">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {phases?.map((phase, index) => (
                  <Draggable
                    key={phase.id}
                    draggableId={phase.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <PhaseItem
                          phase={phase}
                          studyId={studyId}
                          isDragging={snapshot.isDragging}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <AddPhaseDialog
          studyId={studyId}
          isOpen={isAddPhaseDialogOpen}
          onClose={() => setIsAddPhaseDialogOpen(false)}
          missions={missions}
        />
      </CardContent>
    </Card>
  )
}

export default StudyPhasesSection