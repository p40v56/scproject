import { CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SatisfactionSurveyStatusProps {
  isCompleted: boolean;
  onComplete?: () => void;
}

const SatisfactionSurveyStatus = ({ isCompleted, onComplete }: SatisfactionSurveyStatusProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {isCompleted ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <AlertCircle className="w-5 h-5 text-yellow-500" />
        )}
        <span>
          {isCompleted
            ? "Questionnaire de satisfaction complété"
            : "Questionnaire de satisfaction en attente"}
        </span>
      </div>
      {!isCompleted && (
        <Button variant="outline" size="sm" onClick={onComplete}>
          Compléter le questionnaire
        </Button>
      )}
    </div>
  );
};

export default SatisfactionSurveyStatus;