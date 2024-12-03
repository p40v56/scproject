import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface FirstLoginProps {
  onComplete: () => void;
}

const FirstLogin = ({ onComplete }: FirstLoginProps) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [newsletterSubscription, setNewsletterSubscription] = useState(false);

  const handlePayment = async () => {
    if (!acceptedTerms) {
      toast.error("Veuillez accepter les conditions générales de vente");
      return;
    }

    // TODO: Intégrer le système de paiement
    toast.success("Paiement effectué avec succès");
    onComplete();
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Bienvenue dans votre espace client</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-muted-foreground">
            Pour finaliser votre inscription, veuillez procéder au paiement de
            votre acompte.
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Je certifie avoir pris connaissance et j'accepte les conditions
                générales de vente
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="newsletter"
                checked={newsletterSubscription}
                onCheckedChange={(checked) =>
                  setNewsletterSubscription(checked as boolean)
                }
              />
              <label
                htmlFor="newsletter"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                S'inscrire à la newsletter
              </label>
            </div>
          </div>

          <Button onClick={handlePayment} className="w-full">
            Procéder au paiement
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FirstLogin;