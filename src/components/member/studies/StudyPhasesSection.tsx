import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface Phase {
  id: string
  name: string
  progress: number
  status: "pending" | "in_progress" | "completed"
}

interface StudyPhasesSectionProps {
  studyId: string
}

const StudyPhasesSection = ({ studyId }: StudyPhasesSectionProps) => {
  const [isAddPhaseDialogOpen, setIsAddPhaseDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const phases: Phase[] = [
    { id: "1", name: "Phase préparatoire", status: "completed", progress: 100 },
    { id: "2", name: "Phase quantitative", status: "in_progress", progress: 60 },
    { id: "3", name: "Phase qualitative", status: "pending", progress: 0 },
    { id: "4", name: "Présentation finale", status: "pending", progress: 0 },
  ]

  const updatePhaseMutation = useMutation({
    mutationFn: async ({ phaseId, progress }: { phaseId: string, progress: number }) => {
      // TODO: Implement phase update logic with Supabase
      console.log('Updating phase:', phaseId, progress)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-phases', studyId] })
      toast.success('Phase mise à jour avec succès')
    },
    onError: (error) => {
      console.error('Error updating phase:', error)
      toast.error('Erreur lors de la mise à jour de la phase')
    },
  })

  const handleProgressUpdate = (phaseId: string, progress: number) => {
    updatePhaseMutation.mutate({ phaseId, progress })
  }

  return (
    <div className="space-y-6">
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
              <form className="space-y-4">
                <div>
                  <Label htmlFor="phase-name">Nom de la phase</Label>
                  <Input id="phase-name" placeholder="Ex: Phase préparatoire" />
                </div>
                <Button type="submit">Ajouter</Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {phases.map((phase) => (
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
                    onChange={(e) => handleProgressUpdate(phase.id, parseInt(e.target.value))}
                    className="w-20"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StudyPhasesSection