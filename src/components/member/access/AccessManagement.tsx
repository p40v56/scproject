import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserList } from "./UserList";
import { RoleDetails } from "./RoleDetails";
import { CreateAccountForm } from "./CreateAccountForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserTypeSelect } from "./UserTypeSelect";
import { UserRoleSelect } from "./UserRoleSelect";

const AccessManagement = () => {
  const [selectedType, setSelectedType] = useState<string>("member");
  const [selectedRole, setSelectedRole] = useState<string>("member");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleRoleChange = async (userId: string, newRole: string) => {
    console.log(`Changing role for user ${userId} to ${newRole}`);
  };

  const handleSyncUsers = async () => {
    await queryClient.invalidateQueries({ queryKey: ['users'] });
    toast.success("La liste des utilisateurs a été synchronisée");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des accès</h1>
        <div className="flex gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>Créer un compte</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un nouveau compte</DialogTitle>
              </DialogHeader>
              <CreateAccountForm />
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={handleSyncUsers}>
            Synchroniser les utilisateurs
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Filtres</CardTitle>
            <CardDescription>
              Filtrez les utilisateurs par type et rôle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type d'utilisateur</label>
              <UserTypeSelect 
                value={selectedType} 
                onChange={setSelectedType}
              />
            </div>
            {selectedType === 'member' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Rôle</label>
                <UserRoleSelect 
                  value={selectedRole} 
                  onChange={setSelectedRole}
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Rechercher</label>
              <Input
                type="search"
                placeholder="Rechercher un utilisateur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <RoleDetails role={selectedRole} />
      </div>

      <UserList
        userType={selectedType}
        role={selectedRole}
        searchQuery={searchQuery}
        onRoleChange={handleRoleChange}
      />
    </div>
  );
};

export default AccessManagement;