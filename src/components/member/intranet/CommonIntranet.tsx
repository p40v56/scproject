import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, FileText, FolderOpen, Upload, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

type FileOrFolder = {
  id: string;
  name: string;
  type: "file" | "folder";
  category?: string;
  lastModified: string;
  size?: string;
  path: string[];
};

const initialData: FileOrFolder[] = [
  {
    id: "folder-1",
    name: "Branding",
    type: "folder",
    lastModified: "2024-03-15",
    path: ["Branding"],
  },
  {
    id: "folder-2",
    name: "Templates",
    type: "folder",
    lastModified: "2024-03-14",
    path: ["Templates"],
  },
  {
    id: "folder-3",
    name: "Qualité",
    type: "folder",
    lastModified: "2024-03-10",
    path: ["Qualité"],
  },
];

const folderContents: Record<string, FileOrFolder[]> = {
  "Branding": [
    {
      id: "1",
      name: "Charte graphique.pdf",
      type: "file",
      category: "Branding",
      lastModified: "2024-03-15",
      size: "2.5 MB",
      path: ["Branding"],
    },
    {
      id: "folder-branding-1",
      name: "Logos",
      type: "folder",
      lastModified: "2024-03-15",
      path: ["Branding", "Logos"],
    },
  ],
  "Templates": [
    {
      id: "2",
      name: "Template présentation.pptx",
      type: "file",
      category: "Templates",
      lastModified: "2024-03-14",
      size: "5.1 MB",
      path: ["Templates"],
    },
  ],
  "Qualité": [
    {
      id: "3",
      name: "Procédures qualité.docx",
      type: "file",
      category: "Qualité",
      lastModified: "2024-03-10",
      size: "1.8 MB",
      path: ["Qualité"],
    },
  ],
  "Branding/Logos": [
    {
      id: "4",
      name: "Logo principal.png",
      type: "file",
      category: "Branding",
      lastModified: "2024-03-15",
      size: "1.2 MB",
      path: ["Branding", "Logos"],
    },
    {
      id: "5",
      name: "Logo secondaire.png",
      type: "file",
      category: "Branding",
      lastModified: "2024-03-15",
      size: "0.8 MB",
      path: ["Branding", "Logos"],
    },
  ],
};

export default function CommonIntranet() {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const getCurrentItems = () => {
    const pathKey = currentPath.join("/");
    return pathKey === "" ? initialData : folderContents[pathKey] || [];
  };

  const handleNavigate = (item: FileOrFolder) => {
    if (item.type === "folder") {
      setCurrentPath(item.path);
    }
  };

  const handleBack = () => {
    setCurrentPath((prev) => prev.slice(0, -1));
  };

  const handleSelect = (id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleDownloadSelected = () => {
    // In a real application, this would trigger actual file downloads
    console.log("Downloading selected items:", Array.from(selectedItems));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Intranet Commun</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Button
              variant="ghost"
              size="sm"
              className={`${currentPath.length === 0 ? "invisible" : ""}`}
              onClick={handleBack}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Retour
            </Button>
            <span>/{currentPath.join("/")}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Importer
          </Button>
          <Button variant="outline">
            <FolderOpen className="mr-2 h-4 w-4" />
            Nouveau dossier
          </Button>
          {selectedItems.size > 0 && (
            <Button variant="secondary" onClick={handleDownloadSelected}>
              <Download className="mr-2 h-4 w-4" />
              Télécharger ({selectedItems.size})
            </Button>
          )}
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

      <ScrollArea className="h-[calc(100vh-20rem)] border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Dernière modification</TableHead>
              <TableHead>Taille</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getCurrentItems().map((item) => (
              <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  <Checkbox
                    checked={selectedItems.has(item.id)}
                    onCheckedChange={() => handleSelect(item.id)}
                  />
                </TableCell>
                <TableCell
                  className="font-medium"
                  onClick={() => handleNavigate(item)}
                >
                  <div className="flex items-center gap-2">
                    {item.type === "folder" ? (
                      <FolderOpen className="h-4 w-4 text-blue-500" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                    {item.name}
                  </div>
                </TableCell>
                <TableCell>{item.lastModified}</TableCell>
                <TableCell>{item.size || "-"}</TableCell>
                <TableCell className="text-right">
                  {item.type === "file" && (
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}