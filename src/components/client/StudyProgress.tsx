import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

export interface Phase {
  id: string;
  name: string;
  status: "completed" | "in-progress" | "pending";
  progress: number;
  start_date?: string;
  end_date?: string;
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {phases.map((phase, index) => (
        <div key={phase.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(phase.status)}
              <span className="font-medium">{phase.name}</span>
            </div>
            <span className="text-sm text-muted-foreground">{phase.progress}%</span>
          </div>
          <div className="relative pt-1">
            <Progress 
              value={phase.progress} 
              className="h-3 rounded-full bg-gray-100" 
            />
            <div 
              className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300 ease-in-out"
              style={{ width: `${phase.progress}%` }}
            />
          </div>
          {phase.start_date && phase.end_date && (
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatDate(phase.start_date)}</span>
              <span>{formatDate(phase.end_date)}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StudyProgress;