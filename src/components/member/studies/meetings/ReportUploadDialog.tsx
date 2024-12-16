import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

interface ReportUploadDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  meetingId: string
}

const ReportUploadDialog = ({ isOpen, setIsOpen, meetingId }: ReportUploadDialogProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const queryClient = useQueryClient()

  const handleFileUpload = async () => {
    if (!file) {
      toast.error("Veuillez sélectionner un fichier")
      return
    }

    setIsUploading(true)
    try {
      const filePath = `meeting-reports/${meetingId}/${file.name}`
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { error: dbError } = await supabase
        .from('meeting_reports')
        .insert({
          meeting_id: meetingId,
          file_path: filePath
        })

      if (dbError) throw dbError

      toast.success("Compte rendu ajouté avec succès")
      queryClient.invalidateQueries({ queryKey: ['study-meetings'] })
      setIsOpen(false)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error("Erreur lors de l'upload du compte rendu")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un compte rendu</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            accept=".pdf,.doc,.docx"
            className="w-full"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isUploading}
            >
              Annuler
            </Button>
            <Button
              onClick={handleFileUpload}
              disabled={!file || isUploading}
            >
              {isUploading ? "Upload en cours..." : "Ajouter"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ReportUploadDialog