import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Appointments = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !subject) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    toast.success("Demande de rendez-vous envoyée");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Planifier un rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date souhaitée</label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sujet</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: Point d'avancement"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Détails supplémentaires..."
              />
            </div>

            <Button type="submit" className="w-full">
              Demander un rendez-vous
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Appointments;