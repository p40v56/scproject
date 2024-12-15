import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import StudyDates from "./studies/StudyDates";
import SatisfactionSurveyStatus from "./studies/SatisfactionSurveyStatus";
import StudyDocuments from "./studies/StudyDocuments";
import { toast } from "sonner";
import type { Document } from "@/types/documents";

const CompletedStudies = () => {
  const { data: studies, isLoading } = useQuery({
    queryKey: ['completed-studies'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('studies')
        .select(`
          *,
          documents(*)
        `)
        .eq('status', 'completed');

      if (error) throw error;
      return data;
    },
  });

  const handleSurveyComplete = () => {
    toast.success("Merci d'avoir complété le questionnaire de satisfaction");
  };

  const handleDocumentUpload = async (file: File) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      toast.success("Document téléversé avec succès");
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error("Erreur lors du téléversement du document");
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!studies || studies.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            Aucune étude terminée
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {studies.map((study) => (
        <div key={study.id} className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{study.title}</CardTitle>
              </div>
              <Badge variant="secondary">Terminée</Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">{study.description}</p>
              <StudyDates 
                startDate={study.start_date ? new Date(study.start_date) : undefined}
                endDate={study.end_date ? new Date(study.end_date) : undefined}
              />
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <SatisfactionSurveyStatus
              isCompleted={false}
              onComplete={handleSurveyComplete}
            />
            <StudyDocuments
              documents={(study.documents || []).map(doc => ({
                ...doc,
                type: doc.file_type // Map file_type to type for UI display
              }))}
              onUpload={() => handleDocumentUpload}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompletedStudies;