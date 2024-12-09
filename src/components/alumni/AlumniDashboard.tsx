import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Mail, Linkedin, Phone, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AlumniDashboard = () => {
  const navigate = useNavigate();

  const revenueData = [
    { year: '2019', amount: 120000 },
    { year: '2020', amount: 150000 },
    { year: '2021', amount: 180000 },
    { year: '2022', amount: 220000 },
    { year: '2023', amount: 280000 },
  ];

  const studiesData = [
    { year: '2019', count: 25 },
    { year: '2020', count: 30 },
    { year: '2021', count: 35 },
    { year: '2022', count: 42 },
    { year: '2023', count: 50 },
  ];

  const keyDates = [
    {
      date: "2024-03-25",
      title: "Assemblée Générale",
      type: "Événement important"
    },
    {
      date: "2024-04-15",
      title: "Afterwork Alumni",
      type: "Networking"
    },
    {
      date: "2024-05-01",
      title: "Conférence Annuelle",
      type: "Formation"
    }
  ];

  const teamMembers = [
    {
      name: "Sarah Martin",
      role: "Présidente",
      email: "sarah@junior-entreprise.com",
      linkedin: "https://linkedin.com/in/sarah-martin",
      phone: "+33 6 12 34 56 78",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop&q=80"
    },
    {
      name: "Thomas Dubois",
      role: "Vice-Président",
      email: "thomas@junior-entreprise.com",
      linkedin: "https://linkedin.com/in/thomas-dubois",
      phone: "+33 6 23 45 67 89",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&auto=format&fit=crop&q=80"
    },
    {
      name: "Julie Chen",
      role: "Trésorière",
      email: "julie@junior-entreprise.com",
      linkedin: "https://linkedin.com/in/julie-chen",
      phone: "+33 6 34 56 78 90",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&auto=format&fit=crop&q=80"
    },
    {
      name: "Lucas Bernard",
      role: "Responsable Communication",
      email: "lucas@junior-entreprise.com",
      linkedin: "https://linkedin.com/in/lucas-bernard",
      phone: "+33 6 45 67 89 01",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&auto=format&fit=crop&q=80"
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble des performances et de l'organisation
          </p>
        </div>
        <Button onClick={() => navigate("/client/request-study")} size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Demander une étude
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Évolution du chiffre d'affaires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  }).format(value as number)}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={{ fill: "#8B5CF6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Évolution du nombre d'études</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={studiesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: "#10B981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prochaines dates clés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {keyDates.map((event, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  <Badge variant="secondary" className="mt-1">
                    {event.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Organigramme de l'équipe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                  <div className="mt-4 flex gap-4">
                    <a
                      href={`mailto:${member.email}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                      title="Email"
                    >
                      <Mail className="h-5 w-5" />
                    </a>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      title="LinkedIn"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a
                      href={`tel:${member.phone}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                      title="Téléphone"
                    >
                      <Phone className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlumniDashboard;
