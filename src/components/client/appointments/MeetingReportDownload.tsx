import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FileText } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface MeetingReportDownloadProps {
  meetingReports: {
    id: string
    file_path: string
  }[]
  meetingTitle: string
}

export const MeetingReportDownload = ({ meetingReports, meetingTitle }: MeetingReportDownloadProps) => {
  const handleDownloadReport = async (filePath: string) => {
    try {
      console.log('Attempting to download report from path:', filePath)
      const { data, error } = await supabase.storage
        .from('documents')
        .download(filePath)
      
      if (error) {
        console.error('Download error:', error)
        toast.error("Erreur lors du téléchargement du compte rendu")
        return
      }

      const blob = new Blob([data])
      const url = window.URL.createObjectURL(blob)
      
      const a = window.document.createElement('a')
      a.href = url
      a.download = filePath.split('/').pop() || 'compte-rendu.pdf'
      
      window.document.body.appendChild(a)
      a.click()
      window.document.body.removeChild(a)
      
      window.URL.revokeObjectURL(url)
      
      toast.success("Compte rendu téléchargé avec succès")
    } catch (error) {
      console.error('Download error:', error)
      toast.error("Erreur lors du téléchargement du compte rendu")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="w-4 h-4 mr-2" />
          Voir le compte rendu
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compte rendu - {meetingTitle}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {meetingReports.map((report) => (
            <Button
              key={report.id}
              variant="outline"
              className="w-full"
              onClick={() => handleDownloadReport(report.file_path)}
            >
              Télécharger le compte rendu
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}