import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SatisfactionSurveyStatus from "./studies/SatisfactionSurveyStatus";
import StudyDocuments from "./studies/StudyDocuments";

const CompletedStudies = () => {
  const studies = [
    {
      id: 1,
      title: "Analyse financière startup",
      date: "Février 2024",
      compensation: "300€",
      satisfactionSurveyCompleted: true,
      documents: [
        {
          name: "Attestation de mission",
          type: "PDF",
        },
        {
          name: "Bulletin de versement",
          type: "PDF",
        },
      ],
    },
    {
      id: 2,
      title: "Étude marketing digital",
      date: "Janvier 2024",
      compensation: "250€",
      satisfactionSurveyCompleted: false,
      documents: [
        {
          name: "Attestation de mission",
          type: "PDF",
        },
        {
          name: "Bulletin de versement",
          type: "PDF",
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {studies.map((study) => (
        <Card key={study.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{study.title}</CardTitle>
              <Badge variant="outline">{study.compensation}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <SatisfactionSurveyStatus
                isCompleted={study.satisfactionSurveyCompleted}
              />
              <StudyDocuments
                documents={study.documents}
                canDownload={study.satisfactionSurveyCompleted}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CompletedStudies;