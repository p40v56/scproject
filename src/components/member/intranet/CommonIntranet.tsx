import { useState } from "react"
import { FileManagerProvider } from "./FileManagerProvider"
import FileManagerHeader from "./FileManagerHeader"
import FileManagerStats from "./FileManagerStats"
import FileManagerTable from "./FileManagerTable"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useFileManager } from "./FileManagerContext"

function FileManagerContent() {
  const { handleCreateFolder } = useFileManager()
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")

  const onCreateFolder = () => {
    handleCreateFolder(newFolderName)
    setNewFolderName("")
    setIsNewFolderDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <FileManagerHeader onNewFolder={() => setIsNewFolderDialogOpen(true)} />
      <FileManagerStats />
      <FileManagerTable />

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
            <Button onClick={onCreateFolder}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function CommonIntranet() {
  return (
    <FileManagerProvider>
      <FileManagerContent />
    </FileManagerProvider>
  )
}