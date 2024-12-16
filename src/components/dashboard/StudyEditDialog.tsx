import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface StudyEditDialogProps {
  study: any
  members: any[]
  clients: any[]
}

export const StudyEditDialog = ({ study, members, clients }: StudyEditDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  const updateStudyMutation = useMutation({
    mutationFn: async ({ id, ...formData }: any) => {
      const { data, error } = await supabase
        .from('studies')
        .update(formData)
        .eq('id', id)
        .select()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studies'] })
      setIsOpen(false)
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
      id: study.id,
      title: formData.get('title'),
      description: formData.get('description'),
      client_id: formData.get('client_id'),
      assigned_member_id: formData.get('assigned_member_id'),
      budget: formData.get('budget'),
      start_date: formData.get('start_date'),
      end_date: formData.get('end_date'),
      status: formData.get('status')
    }
    updateStudyMutation.mutate(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Modifier
        </Button>
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
            <Label htmlFor="client_id">Client</Label>
            <Select name="client_id" defaultValue={study.client_id}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {clients?.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.first_name} {client.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="assigned_member_id">Chargé de projet</Label>
            <Select name="assigned_member_id" defaultValue={study.assigned_member_id}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un chargé de projet" />
              </SelectTrigger>
              <SelectContent>
                {members?.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.first_name} {member.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              required
            />
          </div>
          <div>
            <Label htmlFor="end_date">Date de fin</Label>
            <Input
              id="end_date"
              name="end_date"
              type="date"
              defaultValue={study.end_date ? new Date(study.end_date).toISOString().split('T')[0] : ''}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Mettre à jour l'étude
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}