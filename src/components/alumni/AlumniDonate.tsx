import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AlumniDonate = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Faire un don</h1>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Soutenez la Junior-Entreprise</CardTitle>
          <CardDescription>
            Participez à la santé financière de la Junior en effectuant un don
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="lg" className="w-full">
            Faire un don sécurisé
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlumniDonate;