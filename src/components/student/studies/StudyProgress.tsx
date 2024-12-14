import { Progress } from "@/components/ui/progress";

interface StudyProgressProps {
  progress: number;
}

const StudyProgress = ({ progress }: StudyProgressProps) => {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">Progression</span>
        <span className="text-sm font-medium">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default StudyProgress;