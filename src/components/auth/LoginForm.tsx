import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="text-sm text-slate-500">
            Format test : client@test.com, student@test.com, alumni@test.com, member@test.com
          </p>
        </div>
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 transition-colors">
          Se connecter
        </Button>
      </form>

      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Accès direct (phase de test)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/client")}
            className="hover:bg-blue-50 transition-colors slide-in"
            style={{ animationDelay: "0ms" }}
          >
            Espace Client
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/student")}
            className="hover:bg-blue-50 transition-colors slide-in"
            style={{ animationDelay: "100ms" }}
          >
            Espace Étudiant
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/alumni")}
            className="hover:bg-blue-50 transition-colors slide-in"
            style={{ animationDelay: "200ms" }}
          >
            Espace Alumni
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/member")}
            className="hover:bg-blue-50 transition-colors slide-in"
            style={{ animationDelay: "300ms" }}
          >
            Espace Membre
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;