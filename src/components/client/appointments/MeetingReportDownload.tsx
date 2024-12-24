import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"

interface MeetingReportDownloadProps {
  meetingReport: {
    id: string
    file_path: string
    created_at: string
  }
  meetingTitle: string
}

export const MeetingReportDownload = ({ meetingReport, meetingTitle }: MeetingReportDownloadProps) => {
  const handleDownload = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(meetingReport.file_path)

      if (error) throw error

      const url = URL.createObjectURL(data)
      const link = document.createElement('a')
      link.href = url
      link.download = `compte-rendu-${meetingTitle}.${meetingReport.file_path.split('.').pop()}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success('Document téléchargé avec succès')
    } catch (error) {
      console.error('Error downloading document:', error)
      toast.error('Erreur lors du téléchargement du document')
    }
  }

  return (
    <div className="flex items-center justify-between p-2 bg-muted rounded-md">
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-blue-600" />
        <span className="text-sm">
          Compte rendu du {new Date(meetingReport.created_at).toLocaleDateString('fr-FR')}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDownload}
      >
        <Download className="w-4 h-4" />
      </Button>
    </div>
  )
}