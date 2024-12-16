import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface StudyPhasesSectionProps {
  studyId: string
}

const StudyPhasesSection = ({ studyId }: StudyPhasesSectionProps) => {
  const [isAddPhaseDialogOpen, setIsAddPhaseDialogOpen] = useState(false)
  const queryClient = useQueryClient()

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

  const createPhaseMutation = useMutation({
    mutationFn: async (formData: any) => {
      const { data, error } = await supabase
        .from('study_phases')
        .insert([{ ...formData, study_id: studyId }])
        .select()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-phases', studyId] })
      setIsAddPhaseDialogOpen(false)
      toast.success('Phase ajoutée avec succès')
    },
    onError: (error) => {
      console.error('Error creating phase:', error)
      toast.error('Erreur lors de la création de la phase')
    },
  })

  const updatePhaseMutation = useMutation({
    mutationFn: async ({ id, progress }: { id: string, progress: number }) => {
      const { data, error } = await supabase
        .from('study_phases')
        .update({ 
          progress,
          status: progress === 100 ? 'completed' : progress === 0 ? 'pending' : 'in_progress'
        })
        .eq('id', id)
        .select()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-phases', studyId] })
      toast.success('Progression mise à jour')
    },
    onError: (error) => {
      console.error('Error updating phase:', error)
      toast.error('Erreur lors de la mise à jour de la progression')
    },
  })

  const handleCreatePhase = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      start_date: formData.get('start_date'),
      end_date: formData.get('end_date'),
    }
    createPhaseMutation.mutate(data)
  }

  if (isLoading) {
    return <div>Chargement des phases...</div>
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Phases de l'étude</CardTitle>
        <Dialog open={isAddPhaseDialogOpen} onOpenChange={setIsAddPhaseDialogOpen}>
          <DialogTrigger asChild>
            <Button>Ajouter une phase</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle phase</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePhase} className="space-y-4">
              <div>
                <Label htmlFor="name">Nom de la phase</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" />
              </div>
              <div>
                <Label htmlFor="start_date">Date de début</Label>
                <Input id="start_date" name="start_date" type="date" />
              </div>
              <div>
                <Label htmlFor="end_date">Date de fin</Label>
                <Input id="end_date" name="end_date" type="date" />
              </div>
              <Button type="submit" className="w-full">
                Ajouter
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {phases?.map((phase) => (
            <div key={phase.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{phase.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {phase.status === 'completed' ? 'Terminée' :
                     phase.status === 'in_progress' ? 'En cours' : 'À venir'}
                  </p>
                </div>
                <span className="text-sm font-medium">{phase.progress}%</span>
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
          ))}
          {(!phases || phases.length === 0) && (
            <p className="text-center text-muted-foreground py-8">
              Aucune phase définie
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default StudyPhasesSection