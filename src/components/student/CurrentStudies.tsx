import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import StudyProgress from "./studies/StudyProgress";
import StudyDates from "./studies/StudyDates";
import ContactCard from "./studies/ContactCard";
import DocumentsList from "./studies/DocumentsList";
import type { Document } from "@/types/documents";

const CurrentStudies = () => {
  const { data: studies, isLoading } = useQuery({
    queryKey: ['current-studies'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('studies')
        .select(`
          *,
          assigned_member:profiles!studies_assigned_member_id_fkey(
            id,
            first_name,
            last_name,
            email
          ),
          documents(*)
        `)
        .eq('status', 'in_progress');

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!studies || studies.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            Aucune étude en cours
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {studies.map((study) => (
        <Card key={study.id}>
          <CardHeader>
            <CardTitle>{study.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">{study.description}</p>
            <StudyProgress 
              currentStep={2} 
              totalSteps={5} 
            />
            <StudyDates 
              startDate={study.start_date ? new Date(study.start_date) : undefined}
              endDate={study.end_date ? new Date(study.end_date) : undefined}
            />
          </CardContent>
        </Card>
      ))}

      <div className="grid gap-6 md:grid-cols-2">
        {studies[0].assigned_member && (
          <ContactCard 
            contact={{
              name: `${studies[0].assigned_member.first_name} ${studies[0].assigned_member.last_name}`,
              role: "Chef de projet",
              email: studies[0].assigned_member.email || "",
            }} 
          />
        )}
        <DocumentsList 
          documents={(studies[0].documents || []).map(doc => ({
            ...doc,
            type: doc.file_type // Map file_type to type for UI display
          }))} 
        />
      </div>
    </div>
  );
};

export default CurrentStudies;