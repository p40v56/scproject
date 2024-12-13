import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface UserListProps {
  role: string;
  searchQuery: string;
  onRoleChange: (userId: string, newRole: string) => void;
}

export const UserList = ({ role, searchQuery }: UserListProps) => {
  const queryClient = useQueryClient();
  const [pendingChanges, setPendingChanges] = useState<Record<string, { role?: string; userType?: string }>>({});

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error("Erreur lors du chargement des utilisateurs");
        throw error;
      }

      return data;
    },
  });

  const updateUser = useMutation({
    mutationFn: async ({ userId, changes }: { userId: string; changes: { roles?: string[]; user_type?: string } }) => {
      const { error } = await supabase
        .from('profiles')
        .update(changes)
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("Utilisateur mis à jour avec succès");
      setPendingChanges({});
    },
    onError: (error) => {
      console.error('Error updating user:', error);
      toast.error("Erreur lors de la mise à jour de l'utilisateur");
    },
  });

  const handleRoleChange = (userId: string, newRole: string) => {
    setPendingChanges((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], role: newRole },
    }));
  };

  const handleUserTypeChange = (userId: string, newUserType: string) => {
    setPendingChanges((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], userType: newUserType },
    }));
  };

  const handleSaveChanges = (userId: string) => {
    const changes = pendingChanges[userId];
    if (!changes) return;

    const updates: { roles?: string[]; user_type?: string } = {};
    if (changes.role) {
      updates.roles = [changes.role];
    }
    if (changes.userType) {
      updates.user_type = changes.userType;
    }

    updateUser.mutate({ userId, changes: updates });
  };

  const filteredUsers = users?.filter(
    (user) =>
      (role === "all" || (user.roles && user.roles.includes(role))) &&
      (user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Dernière activité</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                {user.first_name} {user.last_name}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Select
                  value={pendingChanges[user.id]?.role || user.roles?.[0] || "member"}
                  onValueChange={(newRole) => handleRoleChange(user.id, newRole)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Membre</SelectItem>
                    <SelectItem value="project-manager">Chargé de projet</SelectItem>
                    <SelectItem value="moderator">Modérateur</SelectItem>
                    <SelectItem value="treasurer">Trésorier</SelectItem>
                    <SelectItem value="commercial">Responsable Commercial</SelectItem>
                    <SelectItem value="hr">Responsable RH</SelectItem>
                    <SelectItem value="quality">Responsable Qualité</SelectItem>
                    <SelectItem value="secretary">Secrétaire Général</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super-admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Select
                  value={pendingChanges[user.id]?.userType || user.user_type}
                  onValueChange={(newType) => handleUserTypeChange(user.id, newType)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="student">Étudiant</SelectItem>
                    <SelectItem value="alumni">Alumni</SelectItem>
                    <SelectItem value="member">Membre</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>{new Date(user.updated_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {pendingChanges[user.id] && (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleSaveChanges(user.id)}
                    >
                      Valider
                    </Button>
                  )}
                  <Select defaultValue="more">
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="more">Plus d'actions</SelectItem>
                      <SelectItem value="view">Voir le profil</SelectItem>
                      <SelectItem value="disable">Désactiver</SelectItem>
                      <SelectItem value="delete">Supprimer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};