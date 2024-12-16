import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const CurrentStudies = () => {
  const navigate = useNavigate();

  // Fetch studies with related data
  const { data: studies, isLoading } = useQuery({
    queryKey: ['member-studies'],
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
        .order('created_at', { ascending: false });

      if (error) {
        toast.error("Erreur lors du chargement des études");
        throw error;
      }
      return data;
    },
  });

  const handleEditStudy = (studyId: string) => {
    navigate(`/member/studies/${studyId}`);
  };

  const handleDeleteStudy = async (studyId: string) => {
    try {
      const { error } = await supabase
        .from('studies')
        .delete()
        .eq('id', studyId);

      if (error) throw error;
      toast.success("Étude supprimée avec succès");
    } catch (error) {
      console.error('Error deleting study:', error);
      toast.error("Erreur lors de la suppression de l'étude");
    }
  };

  if (isLoading) {
    return <div>Chargement des études...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Études en cours</h2>
        <Button onClick={() => navigate("/member/studies/new")}>
          Nouvelle étude
        </Button>
      </div>

      <div className="grid gap-6">
        {studies?.map((study) => (
          <Card key={study.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{study.title}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditStudy(study.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer cette étude ? Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteStudy(study.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">{study.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Client</p>
                    <p className="text-sm text-muted-foreground">
                      {study.client ? `${study.client.first_name} ${study.client.last_name}` : 'Non assigné'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Chargé de projet</p>
                    <p className="text-sm text-muted-foreground">
                      {study.assigned_member 
                        ? `${study.assigned_member.first_name} ${study.assigned_member.last_name}` 
                        : 'Non assigné'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Budget</p>
                    <p className="text-sm text-muted-foreground">
                      {study.budget ? `${study.budget}€` : 'Non défini'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Statut</p>
                    <p className={`text-sm px-2 py-1 rounded-full inline-block ${
                      study.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : study.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {study.status === 'pending'
                        ? 'En attente'
                        : study.status === 'in_progress'
                        ? 'En cours'
                        : 'Terminée'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Date de début</p>
                    <p className="text-sm text-muted-foreground">
                      {study.start_date 
                        ? new Date(study.start_date).toLocaleDateString() 
                        : 'Non définie'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Date de fin</p>
                    <p className="text-sm text-muted-foreground">
                      {study.end_date 
                        ? new Date(study.end_date).toLocaleDateString() 
                        : 'Non définie'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {studies?.length === 0 && (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                Aucune étude en cours
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CurrentStudies;