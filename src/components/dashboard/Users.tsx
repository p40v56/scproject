import React from "react"
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

const users = [
  {
    id: 1,
    name: "Jean Dupont",
    role: "Chargé d'études",
    department: "Marketing",
    status: "Actif",
    joinDate: "2023-09-01",
  },
  {
    id: 2,
    name: "Marie Martin",
    role: "Admin",
    department: "Direction",
    status: "Actif",
    joinDate: "2023-06-15",
  },
  {
    id: 3,
    name: "Pierre Durand",
    role: "Alumni",
    department: "Finance",
    status: "Inactif",
    joinDate: "2022-09-01",
  },
]

const Users = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
        <Button>Ajouter un utilisateur</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date d'entrée</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
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

export default Users