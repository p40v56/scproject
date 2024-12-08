import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Clock, GraduationCap, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Mission = {
  id: number;
  title: string;
  type: string;
  level: string;
  location: string;
  duration: string;
  specialization: string;
  description: string;
  compensation: string;
  status: "open" | "in-progress" | "attributed";
  hasApplied?: boolean;
};

const StudentMissions = () => {
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: 1,
      title: "Distribution de questionnaires",
      type: "Étude de marché",
      level: "Tous",
      location: "Paris",
      duration: "2 semaines",
      specialization: "Marketing",
      description: "Analyse du marché du luxe en France pour un client prestigieux.",
      compensation: "400€",
      status: "open",
      hasApplied: false,
    },
    {
      id: 2,
      title: "Sondages téléphoniques",
      type: "Finance",
      level: "Tous",
      location: "Remote",
      duration: "1 semaine",
      specialization: "Finance",
      description: "Due diligence pour une startup en série A.",
      compensation: "300€",
      status: "open",
      hasApplied: false,
    },
  ]);

  const handleApply = (missionId: number) => {
    setMissions(missions.map(mission => {
      if (mission.id === missionId) {
        return { ...mission, hasApplied: true };
      }
      return mission;
    }));
    toast.success("Votre candidature a été envoyée avec succès");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Missions disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {missions.map((mission) => (
              <div key={mission.id} className="border rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{mission.title}</h3>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">{mission.type}</Badge>
                      <Badge variant="outline">{mission.specialization}</Badge>
                    </div>
                  </div>
                  <Badge variant="default" className="text-lg">
                    {mission.compensation}
                  </Badge>
                </div>

                <p className="text-muted-foreground">{mission.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>{mission.level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{mission.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{mission.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>{mission.specialization}</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => handleApply(mission.id)}
                  disabled={mission.hasApplied}
                >
                  {mission.hasApplied ? "Candidature envoyée" : "Postuler"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentMissions;