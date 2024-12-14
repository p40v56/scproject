import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UserActions } from "./UserActions";
import { UserTypeSelect } from "./UserTypeSelect";
import { UserRoleSelect } from "./UserRoleSelect";

interface UserListProps {
  userType: string;
  role: string;
  searchQuery: string;
  onRoleChange: (userId: string, newRole: string) => void;
}

export const UserList = ({ userType, role, searchQuery }: UserListProps) => {
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
    mutationFn: async ({ userId, changes }: { userId: string; changes: { roles?: string[]; user_type?: "client" | "student" | "alumni" | "member" } }) => {
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
      [userId]: { 
        ...prev[userId], 
        userType: newUserType,
        role: newUserType !== 'member' ? undefined : prev[userId]?.role,
      },
    }));
  };

  const handleSaveChanges = (userId: string) => {
    const changes = pendingChanges[userId];
    if (!changes) return;

    const updates: { roles?: string[]; user_type?: "client" | "student" | "alumni" | "member" } = {};
    
    if (changes.userType) {
      updates.user_type = changes.userType as "client" | "student" | "alumni" | "member";
      if (changes.userType !== 'member') {
        updates.roles = [];
      }
    }
    
    if (changes.role && (changes.userType === 'member' || (!changes.userType && users?.find(u => u.id === userId)?.user_type === 'member'))) {
      updates.roles = [changes.role];
    }

    updateUser.mutate({ userId, changes: updates });
  };

  const filteredUsers = users?.filter(user => {
    const matchesType = userType === 'all' || user.user_type === userType;
    const matchesRole = userType !== 'member' || role === 'all' || (user.roles && user.roles.includes(role));
    const matchesSearch = 
      user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesRole && matchesSearch;
  });

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
            <TableHead>Type</TableHead>
            <TableHead>Rôle</TableHead>
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
                <UserTypeSelect
                  value={pendingChanges[user.id]?.userType || user.user_type}
                  onChange={(newType) => handleUserTypeChange(user.id, newType)}
                />
              </TableCell>
              <TableCell>
                {(pendingChanges[user.id]?.userType || user.user_type) === 'member' && (
                  <UserRoleSelect
                    value={pendingChanges[user.id]?.role || user.roles?.[0] || "member"}
                    onChange={(newRole) => handleRoleChange(user.id, newRole)}
                  />
                )}
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
                  <UserActions userId={user.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};