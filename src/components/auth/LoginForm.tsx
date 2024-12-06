import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Logique de redirection basique basée sur le préfixe de l'email
    if (email.startsWith("client")) {
      navigate("/client");
      toast.success("Connexion en tant que client");
    } else if (email.startsWith("student")) {
      navigate("/student");
      toast.success("Connexion en tant qu'étudiant");
    } else if (email.startsWith("alumni")) {
      navigate("/alumni");
      toast.success("Connexion en tant qu'alumni");
    } else if (email.startsWith("member")) {
      navigate("/member");
      toast.success("Connexion en tant que membre");
    } else {
      toast.error("Format d'email non reconnu");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Connexion</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="text-sm text-muted-foreground">
              Format test : client@test.com, student@test.com, alumni@test.com, member@test.com
            </p>
          </div>
          <Button type="submit" className="w-full">
            Se connecter
          </Button>
        </form>

        <div className="mt-8 space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Accès direct (phase de test)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => navigate("/client")}>
              Espace Client
            </Button>
            <Button variant="outline" onClick={() => navigate("/student")}>
              Espace Étudiant
            </Button>
            <Button variant="outline" onClick={() => navigate("/alumni")}>
              Espace Alumni
            </Button>
            <Button variant="outline" onClick={() => navigate("/member")}>
              Espace Membre
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;