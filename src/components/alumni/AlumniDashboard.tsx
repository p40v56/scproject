import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Calendar, TrendingUp } from "lucide-react";

const AlumniDashboard = () => {
  const stats = [
    {
      title: "Chiffre d'affaires en cours",
      value: "150K€",
      icon: TrendingUp,
      description: "Année 2024",
    },
    {
      title: "Études en cours",
      value: "12",
      icon: FileText,
      description: "Ce mois-ci",
    },
    {
      title: "Alumni actifs",
      value: "250+",
      icon: Users,
      description: "Dans le réseau",
    },
    {
      title: "Prochains événements",
      value: "3",
      icon: Calendar,
      description: "Dans les 30 jours",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord Alumni</h1>
        <p className="text-muted-foreground">
          Bienvenue dans votre espace Alumni. Retrouvez ici les informations clés de la Junior.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AlumniDashboard;