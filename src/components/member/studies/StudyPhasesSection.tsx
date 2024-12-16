import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import AddPhaseDialog from "./phases/AddPhaseDialog"
import PhaseItem from "./phases/PhaseItem"
import { toast } from "sonner"

interface StudyPhasesSectionProps {
  studyId: string
}

const StudyPhasesSection = ({ studyId }: StudyPhasesSectionProps) => {
  const [isAddPhaseDialogOpen, setIsAddPhaseDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: phases = [], isLoading } = useQuery({
    queryKey: ['study-phases', studyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_phases')
        .select('*')
        .eq('study_id', studyId)
        .order('order', { ascending: true })

      if (error) throw error
      return data
    },
  })

  const updatePhaseOrderMutation = useMutation({
    mutationFn: async (updates: { id: string, order: number }[]) => {
      const { error } = await supabase
        .from('study_phases')
        .upsert(
          updates.map(({ id, order }) => ({
            id,
            order,
            study_id: studyId, // Include required fields
            name: phases.find(p => p.id === id)?.name || '', // Include required fields
            updated_at: new Date().toISOString()
          }))
        )

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-phases', studyId] })
    },
    onError: (error) => {
      console.error('Error updating phase order:', error)
      toast.error("Erreur lors de la mise à jour de l'ordre des phases")
    }
  })

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !phases) return

    const items = Array.from(phases)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update the local state immediately for a smoother UX
    queryClient.setQueryData(['study-phases', studyId], items)

    // Update the order in the database
    try {
      await updatePhaseOrderMutation.mutateAsync(
        items.map((item, index) => ({
          id: item.id,
          order: index
        }))
      )
    } catch (error) {
      console.error('Error updating phases order:', error)
      // Revert the optimistic update on error
      queryClient.invalidateQueries({ queryKey: ['study-phases', studyId] })
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
                {phases.map((phase, index) => (
                  <Draggable
                    key={phase.id}
                    draggableId={phase.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`transition-colors ${
                          snapshot.isDragging ? "bg-muted" : ""
                        }`}
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
        />
      </CardContent>
    </Card>
  )
}

export default StudyPhasesSection