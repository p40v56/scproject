import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GripVertical, Trash } from "lucide-react"
import { toast } from "sonner"

interface Phase {
  id: string
  name: string
  progress: number
  status: string
  start_date?: string
  end_date?: string
  mission_id?: string
  order?: number
}

interface PhaseItemProps {
  phase: Phase
  studyId: string
  isDragging?: boolean
  dragHandleProps?: any
}

const PhaseItem = ({ phase, studyId, isDragging, dragHandleProps }: PhaseItemProps) => {
  const queryClient = useQueryClient()

  const updatePhaseMutation = useMutation({
    mutationFn: async ({ id, progress, order }: { id: string, progress?: number, order?: number }) => {
      const updates: any = {}
      if (progress !== undefined) {
        updates.progress = progress
        updates.status = progress === 100 ? 'completed' : progress === 0 ? 'pending' : 'in_progress'
      }
      if (order !== undefined) {
        updates.order = order
      }

      const { data, error } = await supabase
        .from('study_phases')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-phases', studyId] })
    },
    onError: (error) => {
      console.error('Error updating phase:', error)
      toast.error('Erreur lors de la mise à jour de la phase')
    },
  })

  const deletePhaseMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('study_phases')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-phases', studyId] })
      toast.success('Phase supprimée avec succès')
    },
    onError: (error) => {
      console.error('Error deleting phase:', error)
      toast.error('Erreur lors de la suppression de la phase')
    },
  })

  return (
    <div className={`space-y-2 p-4 border rounded-lg ${isDragging ? 'bg-muted' : 'bg-card'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div {...dragHandleProps} className="cursor-grab">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <h4 className="font-medium">{phase.name}</h4>
            {phase.start_date && phase.end_date && (
              <p className="text-sm text-muted-foreground">
                {new Date(phase.start_date).toLocaleDateString()} - {new Date(phase.end_date).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{phase.progress}%</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deletePhaseMutation.mutate(phase.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Progress value={phase.progress} className="flex-1" />
        <Input
          type="number"
          min="0"
          max="100"
          value={phase.progress}
          onChange={(e) => updatePhaseMutation.mutate({
            id: phase.id,
            progress: parseInt(e.target.value)
          })}
          className="w-20"
        />
      </div>
    </div>
  )
}

export default PhaseItem