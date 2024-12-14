import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StudyProgress from "./studies/StudyProgress";
import StudyDates from "./studies/StudyDates";
import ContactCard from "./studies/ContactCard";
import DocumentsList from "./studies/DocumentsList";

const CurrentStudies = () => {
  const study = {
    title: "Étude de marché secteur luxe",
    progress: 75,
    startDate: "01/03/2024",
    estimatedEndDate: "15/03/2024",
    estimatedPaymentDate: "30/03/2024",
    compensation: "400€",
    contacts: {
      projectManager: {
        name: "Marie Martin",
        email: "marie.martin@junior-entreprise.com",
        phone: "06 12 34 56 78",
      },
      qualityManager: {
        name: "Lucas Dubois",
        email: "lucas.dubois@junior-entreprise.com",
        phone: "06 98 76 54 32",
      },
    },
    documents: [
      {
        name: "Brief de mission",
        type: "PDF",
        date: "01/03/2024",
      },
      {
        name: "Guide méthodologique",
        type: "PDF",
        date: "01/03/2024",
      },
    ],
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{study.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <StudyProgress progress={study.progress} />
          <StudyDates
            startDate={study.startDate}
            estimatedEndDate={study.estimatedEndDate}
            estimatedPaymentDate={study.estimatedPaymentDate}
          />
        </CardContent>
      </Card>

      <ContactCard
        projectManager={study.contacts.projectManager}
        qualityManager={study.contacts.qualityManager}
      />

      <DocumentsList documents={study.documents} />
    </div>
  );
};

export default CurrentStudies;