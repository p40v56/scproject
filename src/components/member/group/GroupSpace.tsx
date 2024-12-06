import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Network, Share } from "lucide-react";

const groups = [
  {
    id: 1,
    name: "Pôle Communication",
    members: 8,
    lastActivity: "Il y a 2 heures",
  },
  {
    id: 2,
    name: "Pôle Développement Commercial",
    members: 12,
    lastActivity: "Il y a 1 jour",
  },
  {
    id: 3,
    name: "Pôle Qualité",
    members: 6,
    lastActivity: "Il y a 3 heures",
  },
];

export default function GroupSpace() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Espace Groupe</h2>
        <Button>
          <Users className="mr-2 h-4 w-4" />
          Créer un groupe
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {groups.map((group) => (
          <Card key={group.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {group.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {group.members} membres
                </p>
                <p className="text-sm text-muted-foreground">
                  Dernière activité : {group.lastActivity}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    <Network className="mr-2 h-4 w-4" />
                    Rejoindre
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="mr-2 h-4 w-4" />
                    Partager
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}