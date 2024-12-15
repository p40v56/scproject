import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import StudyProgress from "./studies/StudyProgress";
import StudyDates from "./studies/StudyDates";
import ContactCard from "./studies/ContactCard";
import DocumentsList from "./studies/DocumentsList";
import { useAuth } from "@/components/auth/AuthProvider";

const CurrentStudies = () => {
  const { session } = useAuth();

  // Fetch both studies and missions
  const { data: studies, isLoading: studiesLoading } = useQuery({
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

  const { data: missions, isLoading: missionsLoading } = useQuery({
    queryKey: ['current-missions'],
    queryFn: async () => {
      if (!session?.user?.id) return [];

      const { data, error } = await supabase
        .from('missions')
        .select(`
          *,
          study:studies(
            *,
            assigned_member:profiles!studies_assigned_member_id_fkey(
              id,
              first_name,
              last_name,
              email
            )
          )
        `)
        .eq('assigned_student_id', session.user.id)
        .eq('status', 'in-progress');

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  if (studiesLoading || missionsLoading) {
    return <div>Chargement...</div>;
  }

  if ((!studies || studies.length === 0) && (!missions || missions.length === 0)) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            Aucune étude ou mission en cours
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Display Studies */}
      {studies && studies.map((study) => (
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

      {/* Display Missions */}
      {missions && missions.map((mission) => (
        <Card key={mission.id}>
          <CardHeader>
            <CardTitle>{mission.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">{mission.description}</p>
            {mission.study && (
              <>
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Étude associée</h3>
                  <p>{mission.study.title}</p>
                </div>
                {mission.study.assigned_member && (
                  <ContactCard 
                    contact={{
                      name: `${mission.study.assigned_member.first_name} ${mission.study.assigned_member.last_name}`,
                      role: "Chef de projet",
                      email: mission.study.assigned_member.email || "",
                    }} 
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Display Contact and Documents for the first study (if any) */}
      {studies && studies[0] && (
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
              type: doc.file_type
            }))} 
          />
        </div>
      )}
    </div>
  );
};

export default CurrentStudies;