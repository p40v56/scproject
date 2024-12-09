import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, FileText, UserPlus, Mail, Phone, Linkedin } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AlumniSeniorCommittee = () => {
  const [applicationText, setApplicationText] = useState("");
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const committeeMembers = [
    {
      id: 1,
      name: "Jean Dupont",
      role: "Président du Comité Senior",
      email: "jean.dupont@alumni.com",
      phone: "+33 6 12 34 56 78",
      linkedin: "https://linkedin.com/in/jean-dupont",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&auto=format&fit=crop&q=80"
    },
    {
      id: 2,
      name: "Marie Martin",
      role: "Vice-Présidente",
      email: "marie.martin@alumni.com",
      phone: "+33 6 23 45 67 89",
      linkedin: "https://linkedin.com/in/marie-martin",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop&q=80"
    }
  ];

  const documents = [
    {
      id: 1,
      title: "Compte rendu - Audit Stratégique 2023",
      type: "Compte rendu",
      date: "2023-12-15",
      downloadUrl: "#"
    },
    {
      id: 2,
      title: "Synthèse - Développement Commercial",
      type: "Synthèse",
      date: "2023-11-20",
      downloadUrl: "#"
    }
  ];

  const handleApply = () => {
    toast.success("Votre candidature a été envoyée avec succès");
    setShowApplicationForm(false);
    setApplicationText("");
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
        <Dialog open={showApplicationForm} onOpenChange={setShowApplicationForm}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Rejoindre le comité
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Candidature au Comité Senior</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="motivation" className="text-sm font-medium">
                  Lettre de motivation
                </label>
                <Textarea
                  id="motivation"
                  value={applicationText}
                  onChange={(e) => setApplicationText(e.target.value)}
                  placeholder="Expliquez en quelques lignes pourquoi vous souhaitez rejoindre le comité senior..."
                  className="min-h-[150px]"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="cv" className="text-sm font-medium">
                  CV (optionnel)
                </label>
                <Input id="cv" type="file" />
              </div>
              <Button onClick={handleApply} className="w-full">
                Envoyer ma candidature
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Membres du Comité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {committeeMembers.map((member) => (
              <div
                key={member.id}
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Historique des Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div>
                  <h3 className="font-medium">{doc.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(doc.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  <Badge variant="secondary" className="mt-1">
                    {doc.type}
                  </Badge>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={doc.downloadUrl} download>
                    Télécharger
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlumniSeniorCommittee;