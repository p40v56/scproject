import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, FileCheck, FileClock } from "lucide-react";

const StudentDocuments = () => {
  const documents = [
    {
      id: 1,
      name: "Convention étudiante",
      type: "PDF",
      date: "15/03/2024",
      status: "Signé",
      icon: FileCheck,
    },
    {
      id: 2,
      name: "Justificatif de paiement",
      type: "PDF",
      date: "15/03/2024",
      status: "Disponible",
      icon: FileText,
    },
    {
      id: 3,
      name: "Bulletin de versement",
      type: "PDF",
      date: "En attente",
      status: "En attente",
      icon: FileClock,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-4">
                <doc.icon className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {doc.type} • {doc.date} • {doc.status}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" disabled={doc.status === "En attente"}>
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

export default StudentDocuments;