import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

interface ReportUploadDialogProps {
  meetingId: string
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const ReportUploadDialog = ({ meetingId, isOpen, setIsOpen }: ReportUploadDialogProps) => {
  const [uploading, setUploading] = useState(false)
  const queryClient = useQueryClient()

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const file = formData.get('file') as File

    if (!file) {
      toast.error('Veuillez sélectionner un fichier')
      return
    }

    setUploading(true)
    try {
      // Generate a unique file path
      const fileExt = file.name.split('.').pop()
      const filePath = `meetings/${meetingId}/${crypto.randomUUID()}.${fileExt}`

      // Upload the file to storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Create the meeting report record
      const { error: dbError } = await supabase
        .from('meeting_reports')
        .insert({
          meeting_id: meetingId,
          file_path: filePath,
        })

      if (dbError) throw dbError

      toast.success('Compte rendu uploadé avec succès')
      queryClient.invalidateQueries({ queryKey: ['study-meetings'] })
      setIsOpen(false)
    } catch (error) {
      console.error('Error uploading report:', error)
      toast.error("Erreur lors de l'upload du compte rendu")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Uploader un compte rendu</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <Label htmlFor="file">Fichier</Label>
            <Input
              id="file"
              name="file"
              type="file"
              required
              accept=".pdf,.doc,.docx"
              disabled={uploading}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
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

export default ReportUploadDialog