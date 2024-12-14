import { CalendarDays } from "lucide-react";

interface StudyDatesProps {
  startDate: Date;
  endDate: Date;
}

const StudyDates = ({ startDate, endDate }: StudyDatesProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <CalendarDays className="h-4 w-4" />
      <span>
        Du {formatDate(startDate)} au {formatDate(endDate)}
      </span>
    </div>
  );
};

export default StudyDates;