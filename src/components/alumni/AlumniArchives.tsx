import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AlumniArchives = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  const archives = [
    {
      id: 1,
      title: "Compte-rendu CA T1 2024",
      type: "PDF",
      date: "15/03/2024",
      year: "2024",
      size: "2.4 MB",
      category: "Conseil d'Administration",
    },
    {
      id: 2,
      title: "Rapport d'activité 2023",
      type: "PDF",
      date: "01/03/2024",
      year: "2024",
      size: "5.1 MB",
      category: "Rapports Annuels",
    },
    {
      id: 3,
      title: "Statuts mis à jour",
      type: "PDF",
      date: "15/02/2024",
      year: "2024",
      size: "1.2 MB",
      category: "Documents Juridiques",
    },
    {
      id: 4,
      title: "Compte-rendu AG 2023",
      type: "PDF",
      date: "10/12/2023",
      year: "2023",
      size: "3.0 MB",
      category: "Assemblées Générales",
    },
    {
      id: 5,
      title: "Rapport d'activité 2022",
      type: "PDF",
      date: "01/03/2023",
      year: "2023",
      size: "4.5 MB",
      category: "Rapports Annuels",
    },
    {
      id: 6,
      title: "Statuts 2022",
      type: "PDF",
      date: "15/02/2023",
      year: "2023",
      size: "1.0 MB",
      category: "Documents Juridiques",
    },
  ];

  const categories = [
    "Conseil d'Administration",
    "Rapports Annuels",
    "Documents Juridiques",
    "Assemblées Générales",
  ];

  const years = ["2024", "2023", "2022", "2021", "2020"];

  const filteredArchives = archives.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    const matchesYear = selectedYear === "all" || doc.year === selectedYear;

    return matchesSearch && matchesCategory && matchesYear;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Archives</h1>
        <p className="text-muted-foreground">
          Accédez à l'ensemble des documents de la Junior-Entreprise
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <Input 
            className="pl-10" 
            placeholder="Rechercher dans les archives..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="md:max-w-[200px]">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="md:max-w-[120px]">
            <SelectValue placeholder="Année" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {categories.map((category) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-sm">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {archives.filter((a) => a.category === category).length}
              </p>
              <p className="text-sm text-gray-500">documents</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {filteredArchives.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="font-medium">{doc.title}</p>
                      <p className="text-sm text-gray-500">
                        {doc.type} • {doc.size} • {doc.date}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlumniArchives;
