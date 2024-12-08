import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, Download, Mail, Phone, GraduationCap, Building, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

type StudentProfileProps = {
  student: {
    id: string
    name: string
    level: string
    email?: string
    phone?: string
    school?: string
    campus?: string
    specialization?: string
    experience?: string
    availability?: string
    documents?: Array<{
      id: string
      name: string
      type: string
      url?: string
    }>
  }
  onClose: () => void
}

export default function StudentProfile({ student, onClose }: StudentProfileProps) {
  const handleDownload = (documentId: string, documentName: string) => {
    // Simulation du téléchargement
    console.log("Téléchargement du document:", documentId)
    toast.success(`Document ${documentName} téléchargé`)
  }

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">Profil de {student.name}</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Informations principales */}
        <div className="space-y-2">
          <h4 className="font-medium text-lg">Informations personnelles</h4>
          <div className="grid grid-cols-2 gap-4">
            {student.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{student.email}</span>
              </div>
            )}
            {student.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{student.phone}</span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Formation */}
        <div className="space-y-2">
          <h4 className="font-medium text-lg">Formation</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-muted-foreground" />
              <span>Niveau: <Badge variant="secondary">{student.level}</Badge></span>
            </div>
            {student.school && (
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-muted-foreground" />
                <span>École: {student.school}</span>
              </div>
            )}
            {student.campus && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>Campus: {student.campus}</span>
              </div>
            )}
            {student.specialization && (
              <div className="mt-1">
                <span className="text-sm text-muted-foreground">Spécialisation:</span>
                <Badge className="ml-2">{student.specialization}</Badge>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Expérience et disponibilité */}
        {(student.experience || student.availability) && (
          <>
            <div className="space-y-2">
              {student.experience && (
                <div>
                  <h4 className="font-medium text-lg mb-2">Expérience</h4>
                  <p className="text-sm text-muted-foreground">{student.experience}</p>
                </div>
              )}
              {student.availability && (
                <div className="mt-4">
                  <h4 className="font-medium text-lg mb-2">Disponibilité</h4>
                  <p className="text-sm text-muted-foreground">{student.availability}</p>
                </div>
              )}
            </div>
            <Separator />
          </>
        )}

        {/* Documents */}
        {student.documents && student.documents.length > 0 && (
          <div>
            <h4 className="font-medium text-lg mb-3">Documents</h4>
            <div className="space-y-2">
              {student.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <span className="font-medium">{doc.name}</span>
                      <p className="text-xs text-muted-foreground">{doc.type}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(doc.id, doc.name)}
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