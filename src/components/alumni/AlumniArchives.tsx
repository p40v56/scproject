import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const AlumniArchives = () => {
  const archives = [
    {
      id: 1,
      title: "Compte-rendu CA T1 2024",
      type: "PDF",
      date: "15/03/2024",
      size: "2.4 MB",
      category: "Conseil d'Administration",
    },
    {
      id: 2,
      title: "Rapport d'activité 2023",
      type: "PDF",
      date: "01/03/2024",
      size: "5.1 MB",
      category: "Rapports Annuels",
    },
    {
      id: 3,
      title: "Statuts mis à jour",
      type: "PDF",
      date: "15/02/2024",
      size: "1.2 MB",
      category: "Documents Juridiques",
    },
  ];

  const categories = [
    "Conseil d'Administration",
    "Rapports Annuels",
    "Documents Juridiques",
    "Assemblées Générales",
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Archives</h1>
      
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <Input className="pl-10" placeholder="Rechercher dans les archives..." />
        </div>
        <Button variant="outline">Filtrer</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {categories.map((category) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-sm">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {archives.filter((a) => a.category === category).length}
              </p>
              <p className="text-sm text-gray-500">documents</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documents récents</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {archives.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="font-medium">{doc.title}</p>
                      <p className="text-sm text-gray-500">
                        {doc.type} • {doc.size} • {doc.date}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlumniArchives;