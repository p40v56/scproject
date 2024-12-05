import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AlumniArchives = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Archives</h1>
      <ScrollArea className="h-[600px] rounded-md border p-4">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Documents d'archives</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Comptes rendus de CA et autres documents historiques...</p>
          </CardContent>
        </Card>
      </ScrollArea>
    </div>
  );
};

export default AlumniArchives;