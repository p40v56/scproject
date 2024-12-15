import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Clock, GraduationCap, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const StudentMissions = () => {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [selectedMission, setSelectedMission] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");

  const { data: missions, isLoading } = useQuery({
    queryKey: ['missions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('missions')
        .select(`
          *,
          mission_applications!mission_applications_mission_id_fkey(
            id,
            student_id,
            status
          )
        `)
        .eq('status', 'open');

      if (error) throw error;
      return data;
    },
  });

  const applyMutation = useMutation({
    mutationFn: async ({ missionId, coverLetter, resumeUrl }: { missionId: string, coverLetter: string, resumeUrl: string }) => {
      const { data, error } = await supabase
        .from('mission_applications')
        .insert([
          {
            mission_id: missionId,
            student_id: session?.user.id,
            cover_letter: coverLetter,
            resume_url: resumeUrl,
          }
        ]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Votre candidature a été envoyée avec succès");
      setSelectedMission(null);
      setCoverLetter("");
      setResumeUrl("");
      queryClient.invalidateQueries({ queryKey: ['missions'] });
    },
    onError: (error) => {
      console.error('Error applying to mission:', error);
      toast.error("Erreur lors de l'envoi de la candidature");
    },
  });

  const handleApply = (mission: any) => {
    setSelectedMission(mission);
  };

  const submitApplication = () => {
    if (!coverLetter || !resumeUrl) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    applyMutation.mutate({
      missionId: selectedMission.id,
      coverLetter,
      resumeUrl,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const hasApplied = (mission: any) => {
    return mission.mission_applications.some((app: any) => app.student_id === session?.user.id);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Missions disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {missions?.map((mission) => (
              <div key={mission.id} className="border rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{mission.title}</h3>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">{mission.study_level}</Badge>
                    </div>
                  </div>
                  <Badge variant="default" className="text-lg">
                    {mission.compensation}€
                  </Badge>
                </div>

                <p className="text-muted-foreground">{mission.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>{mission.study_level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Mission ouverte</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => handleApply(mission)}
                  disabled={hasApplied(mission)}
                >
                  {hasApplied(mission) ? "Candidature envoyée" : "Postuler"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedMission} onOpenChange={(open) => !open && setSelectedMission(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Postuler à la mission</DialogTitle>
            <DialogDescription>
              {selectedMission?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resume">Lien vers votre CV</Label>
              <Input
                id="resume"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coverLetter">Lettre de motivation</Label>
              <Textarea
                id="coverLetter"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Écrivez votre lettre de motivation..."
                rows={6}
              />
            </div>

            <Button 
              className="w-full" 
              onClick={submitApplication}
              disabled={applyMutation.isPending}
            >
              {applyMutation.isPending ? "Envoi en cours..." : "Envoyer ma candidature"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentMissions;