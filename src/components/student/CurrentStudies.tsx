import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StudyProgress from "./studies/StudyProgress";
import StudyDates from "./studies/StudyDates";
import ContactCard from "./studies/ContactCard";
import DocumentsList from "./studies/DocumentsList";

const CurrentStudies = () => {
  // Mock data - à remplacer par des données réelles
  const study = {
    title: "Étude de marché - Nouveau produit",
    description: "Analyse des tendances et comportements des consommateurs pour le lancement d'un nouveau produit.",
    currentStep: 2,
    totalSteps: 5,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-03-31"),
    contact: {
      name: "Marie Dupont",
      role: "Chef de projet",
      email: "marie.dupont@example.com",
      phone: "01 23 45 67 89",
    },
    documents: [
      {
        id: "1",
        name: "Brief de l'étude",
        type: "PDF",
      },
      {
        id: "2",
        name: "Guide d'entretien",
        type: "DOCX",
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
          <p className="text-muted-foreground">{study.description}</p>
          <StudyProgress 
            currentStep={study.currentStep} 
            totalSteps={study.totalSteps} 
          />
          <StudyDates 
            startDate={study.startDate} 
            endDate={study.endDate} 
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <ContactCard contact={study.contact} />
        <DocumentsList documents={study.documents} />
      </div>
    </div>
  );
};

export default CurrentStudies;