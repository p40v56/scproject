import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

const PHASE_TYPES = [
  "Phase Préparatoire",
  "Phase Quantitative",
  "Phase Qualitative",
  "Rédaction du rapport",
  "Autre"
] as const

interface AddPhaseDialogProps {
  studyId: string
  isOpen: boolean
  onClose: () => void
  missions?: { id: string; title: string }[]
}

const AddPhaseDialog = ({ studyId, isOpen, onClose, missions }: AddPhaseDialogProps) => {
  const [selectedType, setSelectedType] = useState<string>("")
  const [customName, setCustomName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedMission, setSelectedMission] = useState<string>("")
  const queryClient = useQueryClient()

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
      onClose()
      toast.success('Phase ajoutée avec succès')
      setSelectedType("")
      setCustomName("")
      setStartDate("")
      setEndDate("")
      setSelectedMission("")
    },
    onError: (error) => {
      console.error('Error creating phase:', error)
      toast.error('Erreur lors de la création de la phase')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const phaseName = selectedType === "Autre" ? customName : selectedType
    
    if (!phaseName) {
      toast.error("Veuillez sélectionner ou saisir un nom de phase")
      return
    }

    createPhaseMutation.mutate({
      name: phaseName,
      progress: 0,
      status: 'pending',
      start_date: startDate || null,
      end_date: endDate || null,
      mission_id: selectedMission || null
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle phase</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Type de phase</Label>
            <Select
              value={selectedType}
              onValueChange={setSelectedType}
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

          {selectedType === "Autre" && (
            <div>
              <Label>Nom de la phase personnalisée</Label>
              <Input
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Entrez le nom de la phase"
              />
            </div>
          )}

          <div>
            <Label>Date de début estimée</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <Label>Date de fin estimée</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {missions && missions.length > 0 && (
            <div>
              <Label>Mission associée</Label>
              <Select
                value={selectedMission}
                onValueChange={setSelectedMission}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une mission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucune</SelectItem>
                  {missions.map((mission) => (
                    <SelectItem key={mission.id} value={mission.id}>
                      {mission.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button type="submit" className="w-full">
            Ajouter
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddPhaseDialog