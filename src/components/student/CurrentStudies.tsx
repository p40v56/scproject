import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Download, Phone, Mail, Calendar } from "lucide-react";

const CurrentStudies = () => {
  const study = {
    title: "Étude de marché secteur luxe",
    progress: 75,
    startDate: "01/03/2024",
    estimatedEndDate: "15/03/2024",
    estimatedPaymentDate: "30/03/2024",
    compensation: "400€",
    contacts: {
      projectManager: {
        name: "Marie Martin",
        email: "marie.martin@junior-entreprise.com",
        phone: "06 12 34 56 78",
      },
      qualityManager: {
        name: "Lucas Dubois",
        email: "lucas.dubois@junior-entreprise.com",
        phone: "06 98 76 54 32",
      },
    },
    documents: [
      {
        name: "Brief de mission",
        type: "PDF",
        date: "01/03/2024",
      },
      {
        name: "Guide méthodologique",
        type: "PDF",
        date: "01/03/2024",
      },
    ],
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{study.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Progression</span>
              <span className="text-sm font-medium">{study.progress}%</span>
            </div>
            <Progress value={study.progress} className="h-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <div>
                <p className="text-sm font-medium">Début</p>
                <p className="text-sm text-muted-foreground">{study.startDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <div>
                <p className="text-sm font-medium">Fin estimée</p>
                <p className="text-sm text-muted-foreground">{study.estimatedEndDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <div>
                <p className="text-sm font-medium">Paiement estimé</p>
                <p className="text-sm text-muted-foreground">{study.estimatedPaymentDate}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Chargé de mission</h3>
            <div className="space-y-1">
              <p className="text-sm">{study.contacts.projectManager.name}</p>
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm text-muted-foreground">
                    {study.contacts.projectManager.email}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm text-muted-foreground">
                    {study.contacts.projectManager.phone}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Responsable qualité</h3>
            <div className="space-y-1">
              <p className="text-sm">{study.contacts.qualityManager.name}</p>
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm text-muted-foreground">
                    {study.contacts.qualityManager.email}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm text-muted-foreground">
                    {study.contacts.qualityManager.phone}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {study.documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <Download className="w-4 h-4" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {doc.type} • {doc.date}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Télécharger
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrentStudies;