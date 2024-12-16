import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface StudyOverviewSectionProps {
  study: any
}

const StudyOverviewSection = ({ study }: StudyOverviewSectionProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const updateStudyMutation = useMutation({
    mutationFn: async (formData: any) => {
      const { data, error } = await supabase
        .from('studies')
        .update(formData)
        .eq('id', study.id)
        .select()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studies', study.id] })
      setIsEditDialogOpen(false)
      toast.success("Étude mise à jour avec succès")
    },
    onError: (error) => {
      console.error('Error updating study:', error)
      toast.error("Erreur lors de la mise à jour de l'étude")
    },
  })

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      budget: formData.get('budget'),
      start_date: formData.get('start_date'),
      end_date: formData.get('end_date'),
      status: formData.get('status')
    }
    updateStudyMutation.mutate(data)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Client</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{study.client ? `${study.client.first_name} ${study.client.last_name}` : 'Non assigné'}</p>
            <p className="text-sm text-muted-foreground">{study.client?.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chargé de projet</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{study.assigned_member ? `${study.assigned_member.first_name} ${study.assigned_member.last_name}` : 'Non assigné'}</p>
            <p className="text-sm text-muted-foreground">{study.assigned_member?.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{study.budget ? `${study.budget}€` : 'Non défini'}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Détails de l'étude</CardTitle>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Modifier</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier l'étude</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre</Label>
                  <Input id="title" name="title" defaultValue={study.title} required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" defaultValue={study.description} />
                </div>
                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select name="status" defaultValue={study.status}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="in_progress">En cours</SelectItem>
                      <SelectItem value="completed">Terminée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="budget">Budget</Label>
                  <Input id="budget" name="budget" type="number" defaultValue={study.budget} />
                </div>
                <div>
                  <Label htmlFor="start_date">Date de début</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    defaultValue={study.start_date ? new Date(study.start_date).toISOString().split('T')[0] : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">Date de fin</Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="date"
                    defaultValue={study.end_date ? new Date(study.end_date).toISOString().split('T')[0] : ''}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Mettre à jour
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium">Description</h4>
            <p className="text-sm text-muted-foreground">{study.description || 'Aucune description'}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Date de début</h4>
              <p className="text-sm text-muted-foreground">
                {study.start_date ? new Date(study.start_date).toLocaleDateString() : 'Non définie'}
              </p>
            </div>
            <div>
              <h4 className="font-medium">Date de fin</h4>
              <p className="text-sm text-muted-foreground">
                {study.end_date ? new Date(study.end_date).toLocaleDateString() : 'Non définie'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StudyOverviewSection