import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { User, UserCheck } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import StudentProfile from "./StudentProfile";
import type { Applicant } from "./types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ApplicantsListProps {
  applicants: Applicant[];
  missionId: string;
}

export const ApplicantsList = ({ applicants, missionId }: ApplicantsListProps) => {
  const [selectedStudent, setSelectedStudent] = useState<Applicant | null>(null);
  const queryClient = useQueryClient();

  const { data: profiles } = useQuery({
    queryKey: ['applicant-profiles', applicants.map(a => a.student_id)],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('id', applicants.map(a => a.student_id || ''));
      
      if (error) throw error;
      return data;
    },
    enabled: applicants.length > 0,
  });

  const selectApplicantMutation = useMutation({
    mutationFn: async (applicantId: string) => {
      // 1. Update mission status to in-progress
      const { error: missionError } = await supabase
        .from('missions')
        .update({ 
          status: 'in-progress',
          assigned_student_id: applicants.find(a => a.id === applicantId)?.student_id
        })
        .eq('id', missionId);
      
      if (missionError) throw missionError;

      // 2. Update application status to selected
      const { error: applicationError } = await supabase
        .from('mission_applications')
        .update({ 
          status: 'selected',
          selected_at: new Date().toISOString()
        })
        .eq('id', applicantId);

      if (applicationError) throw applicationError;
    },
    onSuccess: () => {
      toast.success("Le candidat a été sélectionné pour la mission");
      queryClient.invalidateQueries({ queryKey: ['missions'] });
    },
    onError: (error) => {
      console.error('Error selecting applicant:', error);
      toast.error("Erreur lors de la sélection du candidat");
    }
  });

  const handleSelectApplicant = (applicantId: string) => {
    selectApplicantMutation.mutate(applicantId);
  };

  if (applicants.length === 0) {
    return <p className="text-muted-foreground">Aucune candidature pour le moment</p>;
  }

  const getStudentName = (studentId: string | null) => {
    const profile = profiles?.find(p => p.id === studentId);
    return profile ? `${profile.first_name} ${profile.last_name}` : 'Étudiant inconnu';
  };

  const getStudentLevel = (studentId: string | null) => {
    const profile = profiles?.find(p => p.id === studentId);
    return profile?.study_year || 'Non spécifié';
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Niveau</TableHead>
            <TableHead>Date de candidature</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants.map((applicant) => (
            <TableRow key={applicant.id}>
              <TableCell>{getStudentName(applicant.student_id)}</TableCell>
              <TableCell>{getStudentLevel(applicant.student_id)}</TableCell>
              <TableCell>{new Date(applicant.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  applicant.status === 'selected' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {applicant.status === 'selected' ? 'Sélectionné' : 'En attente'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectApplicant(applicant.id)}
                    disabled={applicant.status === 'selected'}
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Sélectionner
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedStudent({
                      ...applicant,
                      name: getStudentName(applicant.student_id),
                      level: getStudentLevel(applicant.student_id)
                    })}
                  >
                    <User className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedStudent && (
        <Dialog
          open={!!selectedStudent}
          onOpenChange={() => setSelectedStudent(null)}
        >
          <StudentProfile
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
          />
        </Dialog>
      )}
    </div>
  );
};