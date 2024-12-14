import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Document {
  name: string;
  type: string;
}

interface StudyDocumentsProps {
  documents: Document[];
  canDownload: boolean;
}

const StudyDocuments = ({ documents, canDownload }: StudyDocumentsProps) => {
  return (
    <div className="space-y-2">
      <h3 className="font-medium">Documents disponibles</h3>
      <div className="space-y-2">
        {documents.map((doc, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center gap-4">
              <Download className="w-4 h-4" />
              <span>{doc.name}</span>
            </div>
            <Button variant="outline" size="sm" disabled={!canDownload}>
              Télécharger
            </Button>
          </div>
        ))}
      </div>
      {!canDownload && (
        <p className="text-sm text-muted-foreground">
          Les documents seront disponibles après avoir complété le questionnaire de
          satisfaction
        </p>
      )}
    </div>
  );
};

export default StudyDocuments;