import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, AlertCircle, Pencil } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const [editingPhase, setEditingPhase] = useState<Phase | null>(null);
  const queryClient = useQueryClient();

  const updatePhaseMutation = useMutation({
    mutationFn: async (updatedPhase: Partial<Phase> & { id: string }) => {
      const { data, error } = await supabase
        .from('study_phases')
        .update({
          name: updatedPhase.name,
          start_date: updatedPhase.start_date,
          end_date: updatedPhase.end_date,
        })
        .eq('id', updatedPhase.id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-phases'] });
      toast.success("Phase mise à jour avec succès");
      setEditingPhase(null);
    },
    onError: (error) => {
      console.error('Error updating phase:', error);
      toast.error("Erreur lors de la mise à jour de la phase");
    },
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhase) return;

    const formData = new FormData(e.target as HTMLFormElement);
    updatePhaseMutation.mutate({
      id: editingPhase.id,
      name: formData.get('name') as string,
      start_date: formData.get('start_date') as string,
      end_date: formData.get('end_date') as string,
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
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{phase.progress}%</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingPhase(phase)}
                className="h-8 w-8 hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
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
              <span>{new Date(phase.start_date).toLocaleDateString()}</span>
              <span>{new Date(phase.end_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      ))}

      <Dialog open={!!editingPhase} onOpenChange={() => setEditingPhase(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier la phase</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nom de la phase
              </label>
              <Input
                id="name"
                name="name"
                defaultValue={editingPhase?.name}
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="start_date" className="text-sm font-medium">
                Date de début
              </label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                defaultValue={editingPhase?.start_date?.split('T')[0]}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="end_date" className="text-sm font-medium">
                Date de fin
              </label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                defaultValue={editingPhase?.end_date?.split('T')[0]}
                className="w-full"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingPhase(null)}
              >
                Annuler
              </Button>
              <Button type="submit">
                Enregistrer
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudyProgress;