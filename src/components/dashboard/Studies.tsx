import { useState } from "react"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { StudyTableRow } from "./StudyTableRow"

const Studies = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  // Fetch studies
  const { data: studies, isLoading } = useQuery({
    queryKey: ['studies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('studies')
        .select(`
          *,
          client:profiles!studies_client_id_fkey(
            id,
            first_name,
            last_name,
            email
          ),
          assigned_member:profiles!studies_assigned_member_id_fkey(
            id,
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      console.log("Studies data:", data) // Debug log
      return data
    },
  })

  // Fetch available members and clients
  const { data: members } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'member')

      if (error) throw error
      return data
    },
  })

  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'client')

      if (error) throw error
      return data
    },
  })

  // Create study mutation
  const createStudyMutation = useMutation({
    mutationFn: async (formData: any) => {
      const { data, error } = await supabase
        .from('studies')
        .insert([formData])
        .select()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studies'] })
      setIsCreateDialogOpen(false)
      toast.success("Étude créée avec succès")
    },
    onError: (error) => {
      console.error('Error creating study:', error)
      toast.error("Erreur lors de la création de l'étude")
    },
  })

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      client_id: formData.get('client_id'),
      assigned_member_id: formData.get('assigned_member_id'),
      budget: formData.get('budget'),
      start_date: formData.get('start_date'),
      end_date: formData.get('end_date'),
      status: 'pending'
    }
    createStudyMutation.mutate(data)
  }

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestion des études</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Nouvelle étude</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une nouvelle étude</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input id="title" name="title" required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" />
              </div>
              <div>
                <Label htmlFor="client_id">Client</Label>
                <Select name="client_id" required>
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
                <Select name="assigned_member_id" required>
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
                <Label htmlFor="budget">Budget</Label>
                <Input id="budget" name="budget" type="number" />
              </div>
              <div>
                <Label htmlFor="start_date">Date de début</Label>
                <Input id="start_date" name="start_date" type="date" required />
              </div>
              <div>
                <Label htmlFor="end_date">Date de fin</Label>
                <Input id="end_date" name="end_date" type="date" required />
              </div>
              <Button type="submit" className="w-full">
                Créer l'étude
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des études</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Chargé de projet</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studies?.map((study) => (
                <StudyTableRow 
                  key={study.id} 
                  study={study} 
                  members={members || []} 
                  clients={clients || []} 
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default Studies