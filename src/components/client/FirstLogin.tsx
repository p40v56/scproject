import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

interface FirstLoginProps {
  onComplete: () => void;
}

const FirstLogin = ({ onComplete }: FirstLoginProps) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [newsletterSubscription, setNewsletterSubscription] = useState(false);
  const { session } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('membership_paid_date')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
    staleTime: Infinity, // On ne recharge pas les données automatiquement
    gcTime: 0, // On ne garde pas les données en cache
  });

  // Si le client a déjà payé, on passe à l'étape suivante
  if (profile?.membership_paid_date) {
    onComplete();
    return null;
  }

  const handlePayment = async () => {
    if (!acceptedTerms) {
      toast.error("Veuillez accepter les conditions générales de vente");
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          membership_paid_date: new Date().toISOString(),
        })
        .eq('id', session?.user?.id);

      if (error) throw error;

      toast.success("Paiement effectué avec succès");
      onComplete();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Une erreur est survenue lors du paiement");
    }
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