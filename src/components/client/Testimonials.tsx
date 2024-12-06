import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Testimonials = () => {
  const [testimonial, setTestimonial] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonial || !company) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    toast.success("Merci pour votre témoignage !");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Partagez votre expérience</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Votre témoignage</label>
            <Textarea
              value={testimonial}
              onChange={(e) => setTestimonial(e.target.value)}
              placeholder="Partagez votre expérience avec notre Junior-Entreprise..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Entreprise</label>
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Nom de votre entreprise"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Fonction</label>
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Votre fonction"
            />
          </div>

          <Button type="submit" className="w-full">
            Publier le témoignage
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Testimonials;