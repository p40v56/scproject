import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Upload } from "lucide-react"

const documents = [
  {
    id: 1,
    name: "Convention d'étude - TechCorp",
    type: "PDF",
    size: "2.4 MB",
    date: "2024-03-15",
    category: "Conventions",
  },
  {
    id: 2,
    name: "Devis - StartupXYZ",
    type: "PDF",
    size: "1.8 MB",
    date: "2024-03-10",
    category: "Devis",
  },
  {
    id: 3,
    name: "Rapport final - DigitalCo",
    type: "PDF",
    size: "5.2 MB",
    date: "2024-03-01",
    category: "Rapports",
  },
]

const Documents = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestion documentaire</h1>
        <Button>
          <Upload className="w-4 h-4 mr-2" />
          Importer un document
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {["Conventions", "Devis", "Rapports"].map((category) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {documents.filter((doc) => doc.category === category).length}
              </div>
              <p className="text-xs text-muted-foreground">documents</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documents récents</CardTitle>
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
                      {doc.type} • {doc.size} • {doc.date}
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
  )
}

export default Documents