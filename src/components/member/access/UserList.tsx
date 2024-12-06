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

// Données simulées pour l'exemple
const mockUsers = [
  {
    id: "1",
    name: "Jean Dupont",
    email: "jean.dupont@junior-entreprise.com",
    role: "member",
    entity: "Junior ISEP",
    lastActive: "2024-02-20",
  },
  {
    id: "2",
    name: "Marie Martin",
    email: "marie.martin@junior-entreprise.com",
    role: "project-manager",
    entity: "Junior ISEP",
    lastActive: "2024-02-19",
  },
  {
    id: "3",
    name: "Pierre Durand",
    email: "pierre.durand@junior-entreprise.com",
    role: "admin",
    entity: "Junior ISEP",
    lastActive: "2024-02-18",
  },
];

interface UserListProps {
  role: string;
  searchQuery: string;
  onRoleChange: (userId: string, newRole: string) => void;
}

export const UserList = ({ role, searchQuery, onRoleChange }: UserListProps) => {
  const filteredUsers = mockUsers.filter(
    (user) =>
      (role === "all" || user.role === role) &&
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Entité</TableHead>
            <TableHead>Dernière activité</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Select
                  value={user.role}
                  onValueChange={(newRole) => onRoleChange(user.id, newRole)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Membre</SelectItem>
                    <SelectItem value="project-manager">
                      Chargé de projet
                    </SelectItem>
                    <SelectItem value="moderator">Modérateur</SelectItem>
                    <SelectItem value="treasurer">Trésorier</SelectItem>
                    <SelectItem value="commercial">
                      Responsable Commercial
                    </SelectItem>
                    <SelectItem value="hr">Responsable RH</SelectItem>
                    <SelectItem value="quality">Responsable Qualité</SelectItem>
                    <SelectItem value="secretary">Secrétaire Général</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super-admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{user.entity}</Badge>
              </TableCell>
              <TableCell>{new Date(user.lastActive).toLocaleDateString()}</TableCell>
              <TableCell>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};