import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface MeetingDocumentUploadDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  meetingId: string
  meetingTitle: string
}

export const MeetingDocumentUploadDialog = ({
  isOpen,
  setIsOpen,
  meetingId,
  meetingTitle,
}: MeetingDocumentUploadDialogProps) => {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const filePath = `meetings/${meetingId}/${file.name}`
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

      toast.success('Document uploaded successfully')
      setIsOpen(false)
    } catch (error) {
      console.error('Error uploading document:', error)
      toast.error('Error uploading document')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Document for {meetingTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx"
            disabled={isUploading}
          />
          <label htmlFor="file-upload">
            <Button
              variant="outline"
              className="w-full"
              disabled={isUploading}
              asChild
            >
              <span>
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Select File'}
              </span>
            </Button>
          </label>
          <p className="text-sm text-muted-foreground text-center">
            Supported formats: PDF, DOC, DOCX
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}