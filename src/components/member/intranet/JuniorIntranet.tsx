import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, FileText, FolderOpen, Upload } from "lucide-react";

type Document = {
  id: string;
  name: string;
  type: string;
  category: string;
  lastModified: string;
  size: string;
  shared: boolean;
};

const documents: Document[] = [
  {
    id: "1",
    name: "Procédures internes.pdf",
    type: "PDF",
    category: "Procédures",
    lastModified: "2024-03-15",
    size: "1.2 MB",
    shared: false,
  },
  {
    id: "2",
    name: "Compte-rendu CA Mars.docx",
    type: "DOCX",
    category: "CA",
    lastModified: "2024-03-14",
    size: "800 KB",
    shared: false,
  },
  {
    id: "3",
    name: "Planning Q2 2024.xlsx",
    type: "XLSX",
    category: "Planning",
    lastModified: "2024-03-10",
    size: "1.5 MB",
    shared: true,
  },
];

export default function JuniorIntranet() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Intranet Junior</h2>
        <div className="flex gap-2">
          <Button>
            <Upload className="mr-2" />
            Importer
          </Button>
          <Button variant="outline">
            <FolderOpen className="mr-2" />
            Nouveau dossier
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Documents privés</CardTitle>
            <CardDescription>Documents internes à la Junior</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-sm text-muted-foreground">documents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents partagés</CardTitle>
            <CardDescription>Accessibles aux autres Juniors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-sm text-muted-foreground">documents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Espace utilisé</CardTitle>
            <CardDescription>Sur 10 GB disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2 GB</div>
            <p className="text-sm text-muted-foreground">utilisés</p>
          </CardContent>
        </Card>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Dernière modification</TableHead>
            <TableHead>Taille</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {doc.name}
                </div>
              </TableCell>
              <TableCell>{doc.category}</TableCell>
              <TableCell>{doc.lastModified}</TableCell>
              <TableCell>{doc.size}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}