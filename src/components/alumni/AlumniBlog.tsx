import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AlumniBlog = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Blog Alumni</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Dernières actualités</CardTitle>
            <CardDescription>Articles spécialement rédigés pour les Alumni</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Contenu du blog à venir...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AlumniBlog;