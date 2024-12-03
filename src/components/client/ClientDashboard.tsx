import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ClientDashboard = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">État de l'étude</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">En cours</div>
          <p className="text-xs text-muted-foreground">Phase: Quantitative</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-muted-foreground">
            Convention, factures, rapports
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Prochain RDV</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">15 Avril 2024</div>
          <p className="text-xs text-muted-foreground">
            Présentation des résultats
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;