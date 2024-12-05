import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Heart, CreditCard, Calendar } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const AlumniDonate = () => {
  const [amount, setAmount] = useState("");
  const { toast } = useToast();

  const handleDonate = () => {
    toast({
      title: "Don effectué",
      description: `Merci pour votre don de ${amount}€ !`,
    });
  };

  const donationOptions = [
    {
      amount: "20",
      description: "Soutien de base",
      impact: "Finance une journée de formation",
    },
    {
      amount: "50",
      description: "Soutien intermédiaire",
      impact: "Contribue à l'organisation d'un événement",
    },
    {
      amount: "100",
      description: "Soutien majeur",
      impact: "Permet le développement de nouveaux projets",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Faire un don</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Choisissez votre montant</CardTitle>
            <CardDescription>
              Votre don aide à soutenir les projets de la Junior-Entreprise
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {donationOptions.map((option) => (
                <Button
                  key={option.amount}
                  variant={amount === option.amount ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setAmount(option.amount)}
                >
                  {option.amount}€
                </Button>
              ))}
            </div>
            <div className="relative">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Autre montant"
                className="pl-8"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2">€</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations de paiement</CardTitle>
            <CardDescription>
              Le paiement est sécurisé et crypté
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input placeholder="Numéro de carte" icon={CreditCard} />
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="MM/AA" icon={Calendar} />
                <Input placeholder="CVC" type="password" />
              </div>
            </div>
            <Button onClick={handleDonate} className="w-full">
              <Heart className="mr-2" /> Faire un don
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {donationOptions.map((option) => (
          <Card key={option.amount}>
            <CardHeader>
              <CardTitle>{option.description}</CardTitle>
              <CardDescription>{option.amount}€</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{option.impact}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AlumniDonate;