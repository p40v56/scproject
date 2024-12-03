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

const payments = [
  {
    id: 1,
    type: "Facture client",
    amount: 5000,
    status: "Payé",
    date: "2024-03-15",
    client: "TechCorp",
  },
  {
    id: 2,
    type: "Cotisation",
    amount: 20,
    status: "En attente",
    date: "2024-03-10",
    client: "Jean Dupont",
  },
  {
    id: 3,
    type: "Don",
    amount: 100,
    status: "Payé",
    date: "2024-03-01",
    client: "Marie Martin",
  },
]

const Payments = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestion des paiements</h1>
        <Button>Nouveau paiement</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total des paiements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5120 €</div>
            <p className="text-xs text-muted-foreground">+12% ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Paiements en attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 paiements</div>
            <p className="text-xs text-muted-foreground">Total: 1500 €</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Paiements du mois
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15 paiements</div>
            <p className="text-xs text-muted-foreground">Total: 8500 €</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.type}</TableCell>
                  <TableCell>{payment.amount} €</TableCell>
                  <TableCell>{payment.status}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{payment.client}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Détails
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

export default Payments