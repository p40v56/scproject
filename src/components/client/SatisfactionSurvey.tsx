import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const SatisfactionSurvey = () => {
  const [satisfaction, setSatisfaction] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!satisfaction) {
      toast.error("Veuillez évaluer votre satisfaction");
      return;
    }
    toast.success("Merci pour votre retour !");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Questionnaire de satisfaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label>Niveau de satisfaction global</Label>
            <RadioGroup
              value={satisfaction}
              onValueChange={setSatisfaction}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5" id="r5" />
                <Label htmlFor="r5">Très satisfait</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4" id="r4" />
                <Label htmlFor="r4">Satisfait</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="r3" />
                <Label htmlFor="r3">Neutre</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="r2" />
                <Label htmlFor="r2">Peu satisfait</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="r1" />
                <Label htmlFor="r1">Pas du tout satisfait</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Commentaires additionnels</Label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Partagez votre expérience..."
              className="min-h-[100px]"
            />
          </div>

          <Button type="submit" className="w-full">
            Soumettre
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SatisfactionSurvey;