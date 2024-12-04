import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface MembershipStatusProps {
  membershipPaidDate: Date;
  currentSchoolYear: string;
  isMembershipActive: boolean;
}

const MembershipStatus = ({
  membershipPaidDate,
  currentSchoolYear,
  isMembershipActive,
}: MembershipStatusProps) => {
  return (
    <Alert className={isMembershipActive ? "bg-green-50" : "bg-red-50"}>
      <div className="flex items-center gap-2">
        {isMembershipActive ? (
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        ) : (
          <AlertCircle className="h-5 w-5 text-red-600" />
        )}
        <div>
          <AlertTitle>
            {isMembershipActive ? "Adhésion active" : "Adhésion expirée"}
          </AlertTitle>
          <AlertDescription>
            Cotisation payée le {membershipPaidDate.toLocaleDateString()}
            <br />
            Valable jusqu'à la fin de l'année scolaire {currentSchoolYear}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};

export default MembershipStatus;