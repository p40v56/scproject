import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { StudyEditDialog } from "./StudyEditDialog"

interface StudyTableRowProps {
  study: any
  members: any[]
  clients: any[]
}

export const StudyTableRow = ({ study, members, clients }: StudyTableRowProps) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

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

  return (
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
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/member/current-studies/${study.id}`)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Voir
          </Button>
          <StudyEditDialog study={study} members={members} clients={clients} />
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
  )
}