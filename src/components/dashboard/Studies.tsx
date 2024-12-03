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

const studies = [
  {
    id: 1,
    title: "Étude de marché secteur IT",
    client: "TechCorp",
    status: "En cours",
    progress: 75,
    deadline: "2024-04-15",
  },
  {
    id: 2,
    title: "Analyse financière startup",
    client: "StartupXYZ",
    status: "En attente",
    progress: 0,
    deadline: "2024-05-01",
  },
  {
    id: 3,
    title: "Stratégie marketing digital",
    client: "DigitalCo",
    status: "Terminée",
    progress: 100,
    deadline: "2024-03-30",
  },
]

const Studies = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestion des études</h1>
        <Button>Nouvelle étude</Button>
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
                <TableHead>Statut</TableHead>
                <TableHead>Progression</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studies.map((study) => (
                <TableRow key={study.id}>
                  <TableCell className="font-medium">{study.title}</TableCell>
                  <TableCell>{study.client}</TableCell>
                  <TableCell>{study.status}</TableCell>
                  <TableCell>{study.progress}%</TableCell>
                  <TableCell>{study.deadline}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Voir détails
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

export default Studies