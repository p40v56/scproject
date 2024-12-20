import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import AddPhaseDialog from "./phases/AddPhaseDialog"
import { toast } from "sonner"
import PhaseListItem from "./phases/PhaseListItem"
import EditPhaseDialog from "./phases/EditPhaseDialog"

interface StudyPhasesSectionProps {
  studyId: string
}

const StudyPhasesSection = ({ studyId }: StudyPhasesSectionProps) => {
  const [isAddPhaseDialogOpen, setIsAddPhaseDialogOpen] = useState(false)
  const [editingPhase, setEditingPhase] = useState<any>(null)
  const queryClient = useQueryClient()

  const { data: phases = [], isLoading } = useQuery({
    queryKey: ['study-phases', studyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_phases')
        .select('*')
        .eq('study_id', studyId)
        .order('order', { ascending: true })

      if (error) {
        console.error('Error fetching phases:', error)
        throw error
      }
      return data
    },
  })

  const updatePhaseMutation = useMutation({
    mutationFn: async (updates: any) => {
      const { data, error } = await supabase
        .from('study_phases')
        .update(updates)
        .eq('id', updates.id)
        .select()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-phases', studyId] })
      setEditingPhase(null)
      toast.success("Phase mise à jour avec succès")
    },
    onError: (error) => {
      console.error('Error updating phase:', error)
      toast.error("Erreur lors de la mise à jour de la phase")
    }
  })

  const deletePhaseMutation = useMutation({
    mutationFn: async (phaseId: string) => {
      const { error } = await supabase
        .from('study_phases')
        .delete()
        .eq('id', phaseId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-phases', studyId] })
      toast.success("Phase supprimée avec succès")
    },
    onError: (error) => {
      console.error('Error deleting phase:', error)
      toast.error("Erreur lors de la suppression de la phase")
    }
  })

  const updatePhaseOrderMutation = useMutation({
    mutationFn: async (updates: { id: string, order: number }[]) => {
      const { error } = await supabase
        .from('study_phases')
        .upsert(
          updates.map(({ id, order }) => ({
            id,
            order,
            study_id: studyId,
            name: phases.find(p => p.id === id)?.name || '',
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

    queryClient.setQueryData(['study-phases', studyId], items)

    try {
      await updatePhaseOrderMutation.mutateAsync(
        items.map((item, index) => ({
          id: item.id,
          order: index
        }))
      )
    } catch (error) {
      console.error('Error updating phases order:', error)
      queryClient.invalidateQueries({ queryKey: ['study-phases', studyId] })
    }
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const updates = {
      id: editingPhase.id,
      name: formData.get('name'),
      description: formData.get('description'),
      progress: parseInt(formData.get('progress') as string) || 0,
      start_date: formData.get('start_date'),
      end_date: formData.get('end_date')
    }
    updatePhaseMutation.mutate(updates)
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
                      <PhaseListItem
                        phase={phase}
                        studyId={studyId}
                        isDragging={snapshot.isDragging}
                        dragHandleProps={provided.dragHandleProps}
                        onEdit={setEditingPhase}
                        onDelete={(phase) => deletePhaseMutation.mutate(phase.id)}
                      />
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

        <EditPhaseDialog
          phase={editingPhase}
          isOpen={!!editingPhase}
          onClose={() => setEditingPhase(null)}
          onSubmit={handleEditSubmit}
        />
      </CardContent>
    </Card>
  )
}

export default StudyPhasesSection