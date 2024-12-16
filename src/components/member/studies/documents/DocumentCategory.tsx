import { FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"

interface Document {
  id: string
  name: string
  file_path: string
  file_type: string
  category: string
}

interface DocumentCategoryProps {
  title: string
  documents: Document[]
}

const DocumentCategory = ({ title, documents }: DocumentCategoryProps) => {
  const handleDownload = async (document: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(document.file_path)

      if (error) throw error

      // Create a download link
      const url = window.URL.createObjectURL(data)
      const link = document.createElement('a')
      link.href = url
      link.download = document.name
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading document:', error)
      toast.error('Erreur lors du téléchargement du document')
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
                {doc.file_type}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownload(doc)}
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger
          </Button>
        </div>
      ))}
      {documents.length === 0 && (
        <p className="text-center text-muted-foreground py-4">
          Aucun document dans cette catégorie
        </p>
      )}
    </div>
  )
}

export default DocumentCategory