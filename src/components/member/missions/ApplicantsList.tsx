import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface Applicant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  study_year?: string;
  specialization?: string;
  campus?: string;
  application_id: string;
  application_status: string;
  resume_url?: string;
  cover_letter?: string;
}

interface ApplicantsListProps {
  missionId: string;
}

const ApplicantsList = ({ missionId }: ApplicantsListProps) => {
  const [selectedStudent, setSelectedStudent] = useState<Applicant | null>(null)
  const queryClient = useQueryClient()

  const { data: applicants, isLoading } = useQuery({
    queryKey: ['mission-applicants', missionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mission_applications')
        .select(`
          id,
          status,
          resume_url,
          cover_letter,
          student:profiles!mission_applications_student_id_fkey (
            id,
            first_name,
            last_name,
            email,
            study_year,
            specialization,
            campus
          )
        `)
        .eq('mission_id', missionId)

      if (error) throw error

      return data.map((app: any) => ({
        ...app.student,
        application_id: app.id,
        application_status: app.status,
        resume_url: app.resume_url,
        cover_letter: app.cover_letter,
      }))
    },
  })

  const updateApplicationMutation = useMutation({
    mutationFn: async ({ applicationId, status }: { applicationId: string, status: string }) => {
      const { error } = await supabase
        .from('mission_applications')
        .update({ status })
        .eq('id', applicationId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mission-applicants', missionId] })
      toast.success("Statut de la candidature mis à jour")
    },
    onError: (error) => {
      console.error('Error updating application:', error)
      toast.error("Erreur lors de la mise à jour du statut")
    },
  })

  const handleStudentSelect = (student: Applicant) => {
    setSelectedStudent(student)
  }

  if (isLoading) {
    return <div>Chargement des candidatures...</div>
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Candidatures ({applicants?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applicants?.map((applicant) => (
              <div
                key={applicant.application_id}
                className="p-4 border rounded-lg space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">
                      {applicant.first_name} {applicant.last_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {applicant.email}
                    </p>
                    {applicant.study_year && (
                      <p className="text-sm text-muted-foreground">
                        {applicant.study_year} - {applicant.specialization}
                      </p>
                    )}
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedStudent(applicant)}
                    >
                      Voir détails
                    </Button>
                    <Button
                      variant={applicant.application_status === 'accepted' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateApplicationMutation.mutate({
                        applicationId: applicant.application_id,
                        status: 'accepted'
                      })}
                    >
                      Accepter
                    </Button>
                    <Button
                      variant={applicant.application_status === 'rejected' ? 'destructive' : 'outline'}
                      size="sm"
                      onClick={() => updateApplicationMutation.mutate({
                        applicationId: applicant.application_id,
                        status: 'rejected'
                      })}
                    >
                      Refuser
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {(!applicants || applicants.length === 0) && (
              <p className="text-center text-muted-foreground py-4">
                Aucune candidature pour le moment
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ApplicantsList