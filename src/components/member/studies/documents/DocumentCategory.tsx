import { FileText, Download, Trash2, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"

interface DocumentFile {
  id: string;
  name: string;
  file_path: string;
  file_type: string;
  category: string;
  created_at: string;
}

interface DocumentCategoryProps {
  title: string;
  documents: DocumentFile[];
}

const DocumentCategory = ({ title, documents }: DocumentCategoryProps) => {
  const [editingDoc, setEditingDoc] = useState<DocumentFile | null>(null)
  const [newName, setNewName] = useState("")

  const handleDownload = async (document: DocumentFile) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(document.file_path)

      if (error) throw error

      const url = window.URL.createObjectURL(data)
      const link = window.document.createElement('a')
      link.href = url
      link.download = document.name
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading document:', error)
      toast.error('Erreur lors du téléchargement du document')
    }
  }

  const handleDelete = async (document: DocumentFile) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([document.file_path])

      if (storageError) throw storageError

      // Delete from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', document.id)

      if (dbError) throw dbError

      toast.success('Document supprimé avec succès')
      // Refresh the page to update the list
      window.location.reload()
    } catch (error) {
      console.error('Error deleting document:', error)
      toast.error('Erreur lors de la suppression du document')
    }
  }

  const handleUpdate = async () => {
    if (!editingDoc || !newName.trim()) return

    try {
      const { error } = await supabase
        .from('documents')
        .update({ name: newName.trim() })
        .eq('id', editingDoc.id)

      if (error) throw error

      toast.success('Document mis à jour avec succès')
      setEditingDoc(null)
      // Refresh the page to update the list
      window.location.reload()
    } catch (error) {
      console.error('Error updating document:', error)
      toast.error('Erreur lors de la mise à jour du document')
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">{title}</h3>
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
                {format(new Date(doc.created_at), "dd/MM/yyyy 'à' HH:mm")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload(doc)}
            >
              <Download className="w-4 h-4 mr-2" />
              Télécharger
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingDoc(doc)
                setNewName(doc.name)
              }}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(doc)}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </div>
      ))}
      {documents.length === 0 && (
        <p className="text-center text-muted-foreground py-4">
          Aucun document dans cette catégorie
        </p>
      )}

      <Dialog open={!!editingDoc} onOpenChange={() => setEditingDoc(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le nom du document</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nouveau nom du document"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingDoc(null)}>
              Annuler
            </Button>
            <Button onClick={handleUpdate}>
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DocumentCategory