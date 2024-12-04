import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {study.satisfactionSurveyCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                  <span>
                    {study.satisfactionSurveyCompleted
                      ? "Questionnaire de satisfaction complété"
                      : "Questionnaire de satisfaction en attente"}
                  </span>
                </div>
                {!study.satisfactionSurveyCompleted && (
                  <Button variant="outline" size="sm">
                    Compléter le questionnaire
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Documents disponibles</h3>
                <div className="space-y-2">
                  {study.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <Download className="w-4 h-4" />
                        <span>{doc.name}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!study.satisfactionSurveyCompleted}
                      >
                        Télécharger
                      </Button>
                    </div>
                  ))}
                </div>
                {!study.satisfactionSurveyCompleted && (
                  <p className="text-sm text-muted-foreground">
                    Les documents seront disponibles après avoir complété le
                    questionnaire de satisfaction
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CompletedStudies;