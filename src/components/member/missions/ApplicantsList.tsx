import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { User, UserCheck } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import StudentProfile from "./StudentProfile";
import type { Applicant } from "./types";

interface ApplicantsListProps {
  applicants: Applicant[];
  missionId: string;
}

export const ApplicantsList = ({ applicants, missionId }: ApplicantsListProps) => {
  const [selectedStudent, setSelectedStudent] = useState<Applicant | null>(null);

  const handleSelectApplicant = (applicantId: string) => {
    toast.success("Le candidat a été sélectionné pour la mission");
  };

  if (applicants.length === 0) {
    return <p className="text-muted-foreground">Aucune candidature pour le moment</p>;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Niveau</TableHead>
            <TableHead>Date de candidature</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants.map((applicant) => (
            <TableRow key={applicant.id}>
              <TableCell>{applicant.name}</TableCell>
              <TableCell>{applicant.level}</TableCell>
              <TableCell>{applicant.appliedDate}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectApplicant(applicant.id)}
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Sélectionner
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedStudent(applicant)}
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