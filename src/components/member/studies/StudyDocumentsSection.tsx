import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import DocumentCategory from "./documents/DocumentCategory"
import DocumentUploadDialog from "./documents/DocumentUploadDialog"

interface StudyDocumentsSectionProps {
  studyId: string
}

const StudyDocumentsSection = ({ studyId }: StudyDocumentsSectionProps) => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: documents, isLoading } = useQuery({
    queryKey: ['study-documents', studyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('study_id', studyId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
  })

  const documentsByCategory = {
    administratif: documents?.filter(doc => doc.category === 'administratif') || [],
    facturation: documents?.filter(doc => doc.category === 'facturation') || [],
    etude: documents?.filter(doc => doc.category === 'etude') || [],
  }

  if (isLoading) {
    return <div>Chargement des documents...</div>
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Documents</CardTitle>
        <Button onClick={() => setIsUploadDialogOpen(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Ajouter un document
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <DocumentCategory
          title="Documents administratifs"
          documents={documentsByCategory.administratif}
        />
        <DocumentCategory
          title="Documents de facturation"
          documents={documentsByCategory.facturation}
        />
        <DocumentCategory
          title="Documents d'étude"
          documents={documentsByCategory.etude}
        />
      </CardContent>

      <DocumentUploadDialog
        studyId={studyId}
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['study-documents', studyId] })
        }}
      />
    </Card>
  )
}

export default StudyDocumentsSection