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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

const PHASE_TYPES = [
  "Phase Préparatoire",
  "Phase Quantitative",
  "Phase Qualitative",
  "Rédaction du rapport",
  "Autre"
] as const

interface StudyPhasesSectionProps {
  studyId: string
}

const StudyPhasesSection = ({ studyId }: StudyPhasesSectionProps) => {
  const [isAddPhaseDialogOpen, setIsAddPhaseDialogOpen] = useState(false)
  const [selectedPhaseType, setSelectedPhaseType] = useState<string>("")
  const [customPhaseName, setCustomPhaseName] = useState("")
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
      setSelectedPhaseType("")
      setCustomPhaseName("")
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
    const phaseName = selectedPhaseType === "Autre" ? customPhaseName : selectedPhaseType
    
    if (!phaseName) {
      toast.error("Veuillez sélectionner ou saisir un nom de phase")
      return
    }

    createPhaseMutation.mutate({
      name: phaseName,
      progress: 0,
      status: 'pending'
    })
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
                <Label>Type de phase</Label>
                <Select
                  value={selectedPhaseType}
                  onValueChange={setSelectedPhaseType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type de phase" />
                  </SelectTrigger>
                  <SelectContent>
                    {PHASE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedPhaseType === "Autre" && (
                <div>
                  <Label>Nom de la phase personnalisée</Label>
                  <Input
                    value={customPhaseName}
                    onChange={(e) => setCustomPhaseName(e.target.value)}
                    placeholder="Entrez le nom de la phase"
                  />
                </div>
              )}

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