import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface SatisfactionSurveyStatusProps {
  isCompleted: boolean;
  onComplete?: () => void;
}

const SatisfactionSurveyStatus = ({ isCompleted, onComplete }: SatisfactionSurveyStatusProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Questionnaire de satisfaction</CardTitle>
      </CardHeader>
      <CardContent>
        {isCompleted ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            <span>Questionnaire complété</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-5 w-5" />
              <span>Questionnaire en attente</span>
            </div>
            {onComplete && (
              <Button onClick={onComplete} className="w-full">
                Remplir le questionnaire
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SatisfactionSurveyStatus;