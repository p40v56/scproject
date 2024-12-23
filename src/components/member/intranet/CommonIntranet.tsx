import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import FileManagerHeader from "./FileManagerHeader"
import FileManagerStats from "./FileManagerStats"
import FileManagerTable from "./FileManagerTable"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FileOrFolder } from "./types"

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
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const { toast } = useToast()

  const getCurrentItems = () => {
    const pathKey = currentPath.join("/")
    return pathKey === "" ? initialData : folderContents[pathKey] || []
  }

  const handleNavigate = (item: FileOrFolder) => {
    if (item.type === "folder") {
      setCurrentPath(item.path)
    }
  }

  const handleBack = () => {
    setCurrentPath((prev) => prev.slice(0, -1))
  }

  const handleSelect = (id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleUpload = () => {
    // TODO: Implement file upload functionality
    toast({
      title: "Upload",
      description: "Cette fonctionnalité sera bientôt disponible",
    })
  }

  const handleNewFolder = () => {
    setIsNewFolderDialogOpen(true)
  }

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du dossier ne peut pas être vide",
        variant: "destructive",
      })
      return
    }

    // TODO: Implement folder creation in the backend
    toast({
      title: "Dossier créé",
      description: `Le dossier "${newFolderName}" a été créé avec succès`,
    })

    setNewFolderName("")
    setIsNewFolderDialogOpen(false)
  }

  const handleDownloadSelected = () => {
    // TODO: Implement download functionality
    console.log("Downloading selected items:", Array.from(selectedItems))
    toast({
      title: "Téléchargement",
      description: "Cette fonctionnalité sera bientôt disponible",
    })
  }

  return (
    <div className="space-y-6">
      <FileManagerHeader
        currentPath={currentPath}
        selectedItems={selectedItems}
        onBack={handleBack}
        onUpload={handleUpload}
        onNewFolder={handleNewFolder}
        onDownloadSelected={handleDownloadSelected}
      />

      <FileManagerStats
        totalDocuments={127}
        usedSpace="2.1 GB"
        lastUpdate="Aujourd'hui"
      />

      <FileManagerTable
        items={getCurrentItems()}
        selectedItems={selectedItems}
        onSelect={handleSelect}
        onNavigate={handleNavigate}
      />

      <Dialog open={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau dossier</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Nom du dossier"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewFolderDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateFolder}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
