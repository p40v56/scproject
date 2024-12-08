import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type StudentProfileProps = {
  student: {
    id: string
    name: string
    level: string
    email?: string
    phone?: string
    documents?: Array<{
      id: string
      name: string
      type: string
    }>
  }
  onClose: () => void
}

export default function StudentProfile({ student, onClose }: StudentProfileProps) {
  const handleDownload = (documentId: string) => {
    // Logique de téléchargement à implémenter
    console.log("Téléchargement du document:", documentId)
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Profil de {student.name}</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium">Informations</h4>
          <div className="mt-2 space-y-2">
            <p className="text-sm">Niveau: <Badge>{student.level}</Badge></p>
            {student.email && <p className="text-sm">Email: {student.email}</p>}
            {student.phone && <p className="text-sm">Téléphone: {student.phone}</p>}
          </div>
        </div>

        {student.documents && student.documents.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Documents</h4>
            <div className="space-y-2">
              {student.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-2 border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">{doc.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(doc.id)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DialogContent>
  )
}