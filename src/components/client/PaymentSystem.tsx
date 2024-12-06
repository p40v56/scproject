import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const PaymentSystem = () => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);

  const handlePayment = () => {
    if (!acceptedTerms) {
      toast.error("Veuillez accepter les conditions générales de vente");
      return;
    }
    toast.success("Paiement effectué avec succès");
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Paiement sécurisé</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Input type="text" placeholder="Numéro de carte" />
            <div className="grid grid-cols-2 gap-4">
              <Input type="text" placeholder="MM/AA" />
              <Input type="text" placeholder="CVC" />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
            />
            <label
              htmlFor="terms"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Je certifie avoir pris connaissance et j'accepte les conditions générales de vente
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="newsletter"
              checked={subscribeNewsletter}
              onCheckedChange={(checked) => setSubscribeNewsletter(checked as boolean)}
            />
            <label
              htmlFor="newsletter"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
  );
};

export default PaymentSystem;