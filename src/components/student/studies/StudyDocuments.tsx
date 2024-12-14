import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Upload } from "lucide-react";
import { toast } from "sonner";

interface Document {
  id: string;
  name: string;
  type: string;
  url?: string;
}

interface StudyDocumentsProps {
  documents: Document[];
  onUpload?: () => void;
}

const StudyDocuments = ({ documents, onUpload }: StudyDocumentsProps) => {
  const handleDownload = (documentId: string, documentName: string) => {
    // TODO: Implement actual download logic
    console.log("Downloading document:", documentId);
    toast.success(`Document ${documentName} téléchargé`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Documents de l'étude</CardTitle>
        {onUpload && (
          <Button variant="outline" size="sm" onClick={onUpload}>
            <Upload className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {documents.map((doc) => (
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
        {documents.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Aucun document disponible
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StudyDocuments;