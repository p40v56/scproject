import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"

interface ReportUploadDialogProps {
  meetingId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const ReportUploadDialog = ({ meetingId, isOpen, onClose, onSuccess }: ReportUploadDialogProps) => {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const file = formData.get('file') as File

    if (!file) {
      toast.error('Veuillez sélectionner un fichier')
      return
    }

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const filePath = `meeting-reports/${meetingId}/${crypto.randomUUID()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { error: dbError } = await supabase
        .from('meeting_reports')
        .insert({
          meeting_id: meetingId,
          file_path: filePath,
        })

      if (dbError) throw dbError

      toast.success('Compte-rendu uploadé avec succès')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error uploading report:', error)
      toast.error("Erreur lors de l'upload du compte-rendu")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload du compte-rendu</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <Label htmlFor="file">Fichier</Label>
            <Input
              id="file"
              name="file"
              type="file"
              accept=".pdf,.doc,.docx"
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
              {uploading ? 'Upload en cours...' : 'Upload'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ReportUploadDialog