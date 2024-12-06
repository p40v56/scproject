import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Documents = () => {
  const categories = {
    administratif: [
      {
        id: 1,
        name: "Convention client",
        type: "PDF",
        date: "15/03/2024",
        category: "Administratif",
      },
      {
        id: 4,
        name: "Conditions générales de vente",
        type: "PDF",
        date: "15/03/2024",
        category: "Administratif",
      },
    ],
    facturation: [
      {
        id: 2,
        name: "Facture acompte",
        type: "PDF",
        date: "15/03/2024",
        category: "Facturation",
      },
      {
        id: 5,
        name: "Échéancier",
        type: "PDF",
        date: "15/03/2024",
        category: "Facturation",
      },
    ],
    etude: [
      {
        id: 3,
        name: "Cahier des charges",
        type: "PDF",
        date: "16/03/2024",
        category: "Étude",
      },
      {
        id: 6,
        name: "Planning détaillé",
        type: "PDF",
        date: "16/03/2024",
        category: "Étude",
      },
    ],
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="administratif" className="space-y-4">
          <TabsList>
            <TabsTrigger value="administratif">Administratif</TabsTrigger>
            <TabsTrigger value="facturation">Facturation</TabsTrigger>
            <TabsTrigger value="etude">Étude</TabsTrigger>
          </TabsList>

          <TabsContent value="administratif" className="space-y-4">
            {categories.administratif.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {doc.type} • {doc.date}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="facturation" className="space-y-4">
            {categories.facturation.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {doc.type} • {doc.date}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="etude" className="space-y-4">
            {categories.etude.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {doc.type} • {doc.date}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default Documents