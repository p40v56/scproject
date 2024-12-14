import { Progress } from "@/components/ui/progress";

interface StudyProgressProps {
  currentStep: number;
  totalSteps: number;
}

const StudyProgress = ({ currentStep, totalSteps }: StudyProgressProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Étape {currentStep}/{totalSteps}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default StudyProgress;