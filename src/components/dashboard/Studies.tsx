import React, { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

const Studies = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingStudy, setEditingStudy] = useState<any>(null)
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

  // Update study mutation
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
      setIsEditDialogOpen(false)
      setEditingStudy(null)
      toast.success("Étude mise à jour avec succès")
    },
    onError: (error) => {
      console.error('Error updating study:', error)
      toast.error("Erreur lors de la mise à jour de l'étude")
    },
  })

  // Delete study mutation
  const deleteStudyMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('studies')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studies'] })
      toast.success("Étude supprimée avec succès")
    },
    onError: (error) => {
      console.error('Error deleting study:', error)
      toast.error("Erreur lors de la suppression de l'étude")
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

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data = {
      id: editingStudy.id,
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
                <TableRow key={study.id}>
                  <TableCell className="font-medium">{study.title}</TableCell>
                  <TableCell>
                    {study.client ? `${study.client.first_name} ${study.client.last_name}` : '-'}
                  </TableCell>
                  <TableCell>
                    {study.assigned_member ? `${study.assigned_member.first_name} ${study.assigned_member.last_name}` : '-'}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      study.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : study.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : study.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {study.status === 'pending'
                        ? 'En attente'
                        : study.status === 'in_progress'
                        ? 'En cours'
                        : study.status === 'completed'
                        ? 'Terminée'
                        : study.status}
                    </span>
                  </TableCell>
                  <TableCell>{study.budget ? `${study.budget}€` : '-'}</TableCell>
                  <TableCell>
                    {study.start_date && study.end_date
                      ? `${new Date(study.start_date).toLocaleDateString()} - ${new Date(study.end_date).toLocaleDateString()}`
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog open={isEditDialogOpen && editingStudy?.id === study.id} onOpenChange={(open) => {
                        setIsEditDialogOpen(open)
                        if (!open) setEditingStudy(null)
                      }}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setEditingStudy(study)}>
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

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            Supprimer
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action est irréversible. Cela supprimera définitivement l'étude
                              et toutes les données associées.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteStudyMutation.mutate(study.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default Studies