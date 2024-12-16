import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"

interface DocumentUploadDialogProps {
  studyId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const DocumentUploadDialog = ({ studyId, isOpen, onClose, onSuccess }: DocumentUploadDialogProps) => {
  const [uploading, setUploading] = useState(false)
  const [category, setCategory] = useState<string>("")
  const [documentName, setDocumentName] = useState("")

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const file = formData.get('file') as File
    const documentCategory = formData.get('category') as string
    const name = documentName.trim() || file.name

    if (!file || !documentCategory) {
      toast.error('Veuillez sélectionner un fichier et une catégorie')
      return
    }

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const filePath = `${studyId}/${crypto.randomUUID()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          study_id: studyId,
          name: name,
          file_path: filePath,
          file_type: file.type,
          category: documentCategory
        })

      if (dbError) throw dbError

      toast.success('Document uploadé avec succès')
      onSuccess()
      onClose()
      setDocumentName("")
      setCategory("")
    } catch (error) {
      console.error('Error uploading document:', error)
      toast.error("Erreur lors de l'upload du document")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Uploader un document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom du document</Label>
            <Input
              id="name"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="Nom du document (optionnel)"
            />
          </div>
          <div>
            <Label htmlFor="category">Catégorie</Label>
            <Select
              name="category"
              value={category}
              onValueChange={setCategory}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="administratif">Administratif</SelectItem>
                <SelectItem value="facturation">Facturation</SelectItem>
                <SelectItem value="etude">Étude</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="file">Fichier</Label>
            <Input
              id="file"
              name="file"
              type="file"
              required
              disabled={uploading}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={uploading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading ? 'Upload en cours...' : 'Uploader'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DocumentUploadDialog