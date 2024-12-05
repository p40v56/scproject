import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

const AlumniSeniorCommittee = () => {
  const advices = [
    {
      id: 1,
      author: "Marie Dubois",
      role: "Membre du Comité Senior",
      content: "Conseil sur la stratégie de développement commercial...",
      likes: 15,
      date: "2024-02-15",
    },
    // ... autres conseils
  ];

  const handleLike = (id: number) => {
    // Implémenter la logique de like
    console.log("Like advice:", id);
  };

  const handleRequestMeeting = () => {
    // Implémenter la logique de demande de rendez-vous
    console.log("Request meeting");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Comité Senior</h1>
          <p className="text-muted-foreground">
            Échangez avec les membres expérimentés de notre réseau
          </p>
        </div>
        <Button onClick={handleRequestMeeting}>
          Solliciter le comité senior
        </Button>
      </div>

      <div className="grid gap-6">
        {advices.map((advice) => (
          <Card key={advice.id}>
            <CardHeader>
              <CardTitle className="text-lg">{advice.author}</CardTitle>
              <p className="text-sm text-muted-foreground">{advice.role}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{advice.content}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {new Date(advice.date).toLocaleDateString()}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => handleLike(advice.id)}
                >
                  <Heart className="h-4 w-4" />
                  <span>{advice.likes}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AlumniSeniorCommittee;