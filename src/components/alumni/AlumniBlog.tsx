import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const AlumniBlog = () => {
  const articles = [
    {
      id: 1,
      title: "Succès de la dernière levée de fonds",
      excerpt: "Notre Junior-Entreprise a réussi à lever plus de 50K€...",
      date: "15 Mars 2024",
      category: "Finance",
      image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: 2,
      title: "Nouveau partenariat stratégique",
      excerpt: "Signature d'un accord majeur avec une entreprise du CAC40...",
      date: "10 Mars 2024",
      category: "Partenariat",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: 3,
      title: "Retour sur le Forum Entreprises",
      excerpt: "Plus de 500 étudiants ont participé à notre dernier forum...",
      date: "5 Mars 2024",
      category: "Événement",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Blog & Actualités</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-48 object-cover"
            />
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-blue-600">{article.category}</span>
                <span className="text-sm text-gray-500">{article.date}</span>
              </div>
              <CardTitle className="text-xl">{article.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{article.excerpt}</p>
              <Button variant="outline" className="w-full">
                Lire la suite <ArrowRight className="ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AlumniBlog;