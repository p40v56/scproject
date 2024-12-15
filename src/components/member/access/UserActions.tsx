import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserActionsProps {
  userId: string;
  userProfile: {
    first_name?: string;
    last_name?: string;
    email?: string;
    user_type?: string;
    roles?: string[];
  };
}

export const UserActions = ({ userId, userProfile }: UserActionsProps) => {
  const queryClient = useQueryClient();
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: string) => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke('admin-user-actions', {
        body: { action, userId },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Une erreur est survenue');
      }

      switch (action) {
        case 'disable':
          toast.success("Utilisateur désactivé");
          break;
        case 'delete':
          toast.success("Utilisateur supprimé");
          break;
        case 'sendMagicLink':
          toast.success("Magic link envoyé");
          break;
      }
      
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (error) {
      console.error(`Error ${action} user:`, error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
      setShowProfileDialog(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Voir le profil
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profil utilisateur</DialogTitle>
          </DialogHeader>
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Nom complet</p>
                <p className="text-sm text-muted-foreground">
                  {userProfile.first_name} {userProfile.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{userProfile.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Type</p>
                <p className="text-sm text-muted-foreground">{userProfile.user_type}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Rôles</p>
                <p className="text-sm text-muted-foreground">
                  {userProfile.roles?.join(', ') || 'Aucun'}
                </p>
              </div>
            </CardContent>
          </Card>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => handleAction('sendMagicLink')}
              disabled={isLoading}
            >
              Envoyer un magic link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm">
            Désactiver
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Désactiver l'utilisateur</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir désactiver cet utilisateur ? 
              Il ne pourra plus se connecter à l'application.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleAction('disable')}
              disabled={isLoading}
            >
              Désactiver
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm">
            Supprimer
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l'utilisateur</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? 
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleAction('delete')}
              disabled={isLoading}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};