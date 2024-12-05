import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Linkedin, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AlumniDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const alumni = [
    {
      id: 1,
      name: "Sophie Martin",
      role: "Ancienne Présidente (2020-2021)",
      currentPosition: "Chef de projet chez Company SA",
      location: "Paris",
      graduationYear: "2021",
      email: "sophie.martin@email.com",
      linkedin: "https://linkedin.com/in/sophie-martin",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop&q=80",
    },
    {
      id: 2,
      name: "Lucas Bernard",
      role: "Ancien Trésorier (2019-2020)",
      currentPosition: "Consultant Finance chez BigFour",
      location: "Lyon",
      graduationYear: "2020",
      email: "lucas.bernard@email.com",
      linkedin: "https://linkedin.com/in/lucas-bernard",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&auto=format&fit=crop&q=80",
    },
    // ... autres alumni
  ];

  const years = ["2023", "2022", "2021", "2020", "2019"];
  const locations = ["Paris", "Lyon", "Bordeaux", "Marseille", "Lille"];

  const filteredAlumni = alumni.filter((alum) => {
    const matchesSearch = 
      alum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.currentPosition.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesYear = selectedYear === "all" || alum.graduationYear === selectedYear;
    const matchesLocation = selectedLocation === "all" || alum.location === selectedLocation;

    return matchesSearch && matchesYear && matchesLocation;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Répertoire des Alumni</h1>
        <p className="text-muted-foreground">
          Retrouvez les anciens membres de la Junior-Entreprise
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Rechercher par nom, poste ou entreprise..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:max-w-xs"
        />
        
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="md:max-w-[180px]">
            <SelectValue placeholder="Année de sortie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les années</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="md:max-w-[180px]">
            <SelectValue placeholder="Localisation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les villes</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {alum.location}
                </div>
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