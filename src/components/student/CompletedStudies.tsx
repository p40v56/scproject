import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StudyDates from "./studies/StudyDates";
import SatisfactionSurveyStatus from "./studies/SatisfactionSurveyStatus";
import StudyDocuments from "./studies/StudyDocuments";
import { toast } from "sonner";

const CompletedStudies = () => {
  // Mock data - à remplacer par des données réelles
  const study = {
    title: "Étude de satisfaction client",
    description: "Analyse de la satisfaction des clients pour le service client existant.",
    startDate: new Date("2023-10-01"),
    endDate: new Date("2023-12-31"),
    surveyCompleted: false,
    documents: [
      {
        id: "1",
        name: "Rapport final",
        type: "PDF",
      },
      {
        id: "2",
        name: "Présentation des résultats",
        type: "PPTX",
      },
    ],
  };

  const handleSurveyComplete = () => {
    // TODO: Implement actual survey logic
    toast.success("Merci d'avoir complété le questionnaire de satisfaction");
  };

  const handleDocumentUpload = () => {
    // TODO: Implement actual upload logic
    toast.success("Document téléversé avec succès");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{study.title}</CardTitle>
          </div>
          <Badge variant="secondary">Terminée</Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">{study.description}</p>
          <StudyDates 
            startDate={study.startDate} 
            endDate={study.endDate} 
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <SatisfactionSurveyStatus
          isCompleted={study.surveyCompleted}
          onComplete={handleSurveyComplete}
        />
        <StudyDocuments
          documents={study.documents}
          onUpload={handleDocumentUpload}
        />
      </div>
    </div>
  );
};

export default CompletedStudies;