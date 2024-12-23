import { Button } from "@/components/ui/button"
import { ChevronLeft, Download, FolderOpen, Upload } from "lucide-react"

interface FileManagerHeaderProps {
  currentPath: string[]
  selectedItems: Set<string>
  onBack: () => void
  onUpload: () => void
  onNewFolder: () => void
  onDownloadSelected: () => void
}

export default function FileManagerHeader({
  currentPath,
  selectedItems,
  onBack,
  onUpload,
  onNewFolder,
  onDownloadSelected,
}: FileManagerHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">Intranet Commun</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            className={`${currentPath.length === 0 ? "invisible" : ""}`}
            onClick={onBack}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour
          </Button>
          <span>/{currentPath.join("/")}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={onUpload}>
          <Upload className="mr-2 h-4 w-4" />
          Importer
        </Button>
        <Button variant="outline" onClick={onNewFolder}>
          <FolderOpen className="mr-2 h-4 w-4" />
          Nouveau dossier
        </Button>
        {selectedItems.size > 0 && (
          <Button variant="secondary" onClick={onDownloadSelected}>
            <Download className="mr-2 h-4 w-4" />
            Télécharger ({selectedItems.size})
          </Button>
        )}
      </div>
    </div>
  )
}