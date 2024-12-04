import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const StudentFirstLogin = ({ onComplete }: { onComplete: () => void }) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!acceptedTerms) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez accepter les conditions générales d'adhésion",
      });
      return;
    }

    // TODO: Implement actual payment logic
    toast({
      title: "Paiement effectué",
      description: "Votre cotisation a été payée avec succès",
    });
    onComplete();
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Paiement de la cotisation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms"
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
          />
          <label
            htmlFor="terms"
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Je certifie avoir pris connaissance et j'accepte les conditions générales d'adhésion
          </label>
        </div>

        <Button onClick={handlePayment} className="w-full">
          Payer la cotisation
        </Button>
      </CardContent>
    </Card>
  );
};

export default StudentFirstLogin;