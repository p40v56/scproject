import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, FileText, FolderOpen, Upload } from "lucide-react";

type Document = {
  id: string;
  name: string;
  type: string;
  category: string;
  lastModified: string;
  size: string;
};

const documents: Document[] = [
  {
    id: "1",
    name: "Charte graphique.pdf",
    type: "PDF",
    category: "Branding",
    lastModified: "2024-03-15",
    size: "2.5 MB",
  },
  {
    id: "2",
    name: "Template présentation.pptx",
    type: "PPTX",
    category: "Templates",
    lastModified: "2024-03-14",
    size: "5.1 MB",
  },
  {
    id: "3",
    name: "Procédures qualité.docx",
    type: "DOCX",
    category: "Qualité",
    lastModified: "2024-03-10",
    size: "1.8 MB",
  },
];

export default function CommonIntranet() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Intranet Commun</h2>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="font-semibold mb-2">Documents partagés</h3>
          <p className="text-2xl font-bold">127</p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="font-semibold mb-2">Espace utilisé</h3>
          <p className="text-2xl font-bold">2.1 GB</p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="font-semibold mb-2">Dernière mise à jour</h3>
          <p className="text-2xl font-bold">Aujourd'hui</p>
        </div>
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