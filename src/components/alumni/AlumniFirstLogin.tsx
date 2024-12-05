import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface AlumniFirstLoginProps {
  onComplete: () => void;
}

const AlumniFirstLogin = ({ onComplete }: AlumniFirstLoginProps) => {
  const [acceptSkemaAlumni, setAcceptSkemaAlumni] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);
  const [hasSkemaAccount, setHasSkemaAccount] = useState<boolean | null>(null);

  const handleContinue = () => {
    // TODO: Implement actual data synchronization with SKEMA Alumni
    if (acceptSkemaAlumni) {
      toast.success(
        "Vos informations seront synchronisées avec SKEMA Alumni"
      );
    }
    if (subscribeNewsletter) {
      toast.success("Vous êtes inscrit à la newsletter");
    }
    onComplete();
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Bienvenue dans votre espace Alumni</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {hasSkemaAccount === null ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Avez-vous déjà un compte SKEMA Alumni ?
              </p>
              <div className="flex gap-4">
                <Button onClick={() => setHasSkemaAccount(true)}>Oui</Button>
                <Button onClick={() => setHasSkemaAccount(false)} variant="outline">
                  Non
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {!hasSkemaAccount && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Vous pourrez créer votre espace avec vos données personnelles.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="skema-alumni"
                    checked={acceptSkemaAlumni}
                    onCheckedChange={(checked) => setAcceptSkemaAlumni(checked as boolean)}
                  />
                  <label
                    htmlFor="skema-alumni"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    J'accepte que mes coordonnées et informations personnelles
                    soient transmises à SKEMA Alumni
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

              <Button onClick={handleContinue} className="w-full">
                Continuer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AlumniFirstLogin;