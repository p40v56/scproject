import { Button } from "@/components/ui/button"
import { ChevronLeft, Download, FolderPlus, Upload, Trash2 } from "lucide-react"
import { useFileManager } from "./FileManagerContext"

interface FileManagerHeaderProps {
  onNewFolder: () => void
}

export default function FileManagerHeader({ onNewFolder }: FileManagerHeaderProps) {
  const {
    currentPath,
    selectedItems,
    handleBack,
    handleUpload,
    handleDownloadSelected,
    handleDeleteSelected,
  } = useFileManager()

  return (
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
        <Button onClick={handleUpload}>
          <Upload className="mr-2 h-4 w-4" />
          Importer
        </Button>
        <Button variant="outline" onClick={onNewFolder}>
          <FolderPlus className="mr-2 h-4 w-4" />
          Nouveau dossier
        </Button>
        {selectedItems.size > 0 && (
          <>
            <Button variant="secondary" onClick={handleDownloadSelected}>
              <Download className="mr-2 h-4 w-4" />
              Télécharger ({selectedItems.size})
            </Button>
            <Button variant="destructive" onClick={handleDeleteSelected}>
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer ({selectedItems.size})
            </Button>
          </>
        )}
      </div>
    </div>
  )
}