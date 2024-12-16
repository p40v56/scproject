import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Download, Upload, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface StudyDocumentsSectionProps {
  studyId: string
}

const StudyDocumentsSection = ({ studyId }: StudyDocumentsSectionProps) => {
  const [uploading, setUploading] = useState(false)
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

  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const document = documents?.find(d => d.id === documentId)
      if (!document) throw new Error('Document not found')

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([document.file_path])

      if (storageError) throw storageError

      // Delete from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId)

      if (dbError) throw dbError
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-documents', studyId] })
      toast.success('Document supprimé avec succès')
    },
    onError: (error) => {
      console.error('Error deleting document:', error)
      toast.error('Erreur lors de la suppression du document')
    },
  })

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const filePath = `${studyId}/${crypto.randomUUID()}.${fileExt}`

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Save to database
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          study_id: studyId,
          name: file.name,
          file_path: filePath,
          file_type: file.type,
        })

      if (dbError) throw dbError

      queryClient.invalidateQueries({ queryKey: ['study-documents', studyId] })
      toast.success('Document uploadé avec succès')
    } catch (error) {
      console.error('Error uploading document:', error)
      toast.error('Erreur lors de l\'upload du document')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const handleDownload = async (document: any) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(document.file_path)

      if (error) throw error

      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = document.name
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading document:', error)
      toast.error('Erreur lors du téléchargement du document')
    }
  }

  if (isLoading) {
    return <div>Chargement des documents...</div>
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Documents</CardTitle>
        <div className="flex items-center gap-2">
          <Input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            disabled={uploading}
          />
          <label htmlFor="file-upload">
            <Button variant="outline" disabled={uploading} asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Upload en cours...' : 'Upload'}
              </span>
            </Button>
          </label>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents?.map((document) => (
            <div
              key={document.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium">{document.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(document.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(document)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer ce document ? Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteDocumentMutation.mutate(document.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
          {documents?.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Aucun document uploadé
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default StudyDocumentsSection