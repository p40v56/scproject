import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

const Documents = () => {
  const documents = [
    {
      id: 1,
      name: "Convention client",
      type: "PDF",
      date: "15/03/2024",
      category: "Administratif",
    },
    {
      id: 2,
      name: "Facture acompte",
      type: "PDF",
      date: "15/03/2024",
      category: "Facturation",
    },
    {
      id: 3,
      name: "Cahier des charges",
      type: "PDF",
      date: "16/03/2024",
      category: "Étude",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {doc.type} • {doc.date} • {doc.category}
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
      </CardContent>
    </Card>
  );
};

export default Documents;