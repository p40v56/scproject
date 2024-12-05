import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Linkedin } from "lucide-react";

const AlumniDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Exemple de données (à remplacer par des données réelles)
  const alumni = [
    {
      id: 1,
      name: "Sophie Martin",
      role: "Ancienne Présidente (2020-2021)",
      currentPosition: "Chef de projet chez Company SA",
      email: "sophie.martin@email.com",
      linkedin: "https://linkedin.com/in/sophie-martin",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop&q=80",
    },
    // ... autres alumni
  ];

  const filteredAlumni = alumni.filter(
    (alum) =>
      alum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.currentPosition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Répertoire des Alumni</h1>
        <p className="text-muted-foreground">
          Retrouvez les anciens membres de la Junior-Entreprise
        </p>
      </div>

      <Input
        placeholder="Rechercher par nom, poste à la JE ou poste actuel..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-xl"
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAlumni.map((alum) => (
          <Card key={alum.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="aspect-square relative">
                <img
                  src={alum.image}
                  alt={alum.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-semibold">{alum.name}</h3>
                <p className="text-sm text-muted-foreground">{alum.role}</p>
                <p className="text-sm">{alum.currentPosition}</p>
                <div className="flex gap-2 mt-2">
                  <a
                    href={`mailto:${alum.email}`}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                  <a
                    href={alum.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AlumniDirectory;