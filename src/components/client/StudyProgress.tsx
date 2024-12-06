import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

interface Phase {
  name: string;
  status: "completed" | "in-progress" | "pending";
  progress: number;
}

interface StudyProgressProps {
  phases: Phase[];
}

const StudyProgress = ({ phases }: StudyProgressProps) => {
  const getStatusIcon = (status: Phase["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-gray-300" />;
    }
  };

  return (
    <div className="space-y-4">
      {phases.map((phase, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(phase.status)}
              <span className="font-medium">{phase.name}</span>
            </div>
            <span className="text-sm text-muted-foreground">{phase.progress}%</span>
          </div>
          <Progress value={phase.progress} className="h-2" />
        </div>
      ))}
    </div>
  );
};

export default StudyProgress;