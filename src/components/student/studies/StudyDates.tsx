import { Calendar } from "lucide-react";

interface StudyDatesProps {
  startDate: string;
  estimatedEndDate: string;
  estimatedPaymentDate: string;
}

const StudyDates = ({ startDate, estimatedEndDate, estimatedPaymentDate }: StudyDatesProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        <div>
          <p className="text-sm font-medium">Début</p>
          <p className="text-sm text-muted-foreground">{startDate}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        <div>
          <p className="text-sm font-medium">Fin estimée</p>
          <p className="text-sm text-muted-foreground">{estimatedEndDate}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        <div>
          <p className="text-sm font-medium">Paiement estimé</p>
          <p className="text-sm text-muted-foreground">{estimatedPaymentDate}</p>
        </div>
      </div>
    </div>
  );
};

export default StudyDates;