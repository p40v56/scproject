import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserList } from "./UserList";
import { RoleDetails } from "./RoleDetails";
import { useToast } from "@/components/ui/use-toast";

const AccessManagement = () => {
  const [selectedRole, setSelectedRole] = useState<string>("member");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleRoleChange = async (userId: string, newRole: string) => {
    // Simulation d'une mise à jour
    console.log(`Changing role for user ${userId} to ${newRole}`);
    toast({
      title: "Rôle mis à jour",
      description: "Le rôle de l'utilisateur a été modifié avec succès.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des accès</h1>
        <Button
          onClick={() => {
            toast({
              title: "Synchronisation terminée",
              description: "La liste des utilisateurs a été mise à jour.",
            });
          }}
        >
          Synchroniser les utilisateurs
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Filtres</CardTitle>
            <CardDescription>
              Filtrez les utilisateurs par rôle et nom
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rôle</label>
              <Select
                value={selectedRole}
                onValueChange={setSelectedRole}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
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
            </div>
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
        role={selectedRole}
        searchQuery={searchQuery}
        onRoleChange={handleRoleChange}
      />
    </div>
  );
};

export default AccessManagement;