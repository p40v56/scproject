import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Download } from "lucide-react";

const sections = [
  {
    id: 1,
    title: "Présidence",
    documents: [
      {
        id: 1,
        name: "Guide du président",
        type: "PDF",
        date: "01/03/2024",
      },
      {
        id: 2,
        name: "Procédures administratives",
        type: "PDF",
        date: "01/03/2024",
      },
    ],
  },
  {
    id: 2,
    title: "Trésorerie",
    documents: [
      {
        id: 3,
        name: "Guide du trésorier",
        type: "PDF",
        date: "01/03/2024",
      },
      {
        id: 4,
        name: "Processus comptables",
        type: "PDF",
        date: "01/03/2024",
      },
    ],
  },
  {
    id: 3,
    title: "Développement Commercial",
    documents: [
      {
        id: 5,
        name: "Guide commercial",
        type: "PDF",
        date: "01/03/2024",
      },
      {
        id: 6,
        name: "Stratégie commerciale",
        type: "PDF",
        date: "01/03/2024",
      },
    ],
  },
];

export default function Handover() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Book de passation</h2>
        <Button>
          <BookOpen className="mr-2 h-4 w-4" />
          Ajouter un document
        </Button>
      </div>

      <div className="grid gap-6">
        {sections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {section.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <BookOpen className="h-4 w-4" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.type} • {doc.date}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}