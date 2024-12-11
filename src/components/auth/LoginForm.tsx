import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === "Invalid login credentials") {
          toast.error("Email ou mot de passe incorrect. Si vous n'avez pas de compte, inscrivez-vous d'abord.");
        } else {
          toast.error(error.message);
        }
        return;
      }

      toast.success("Connexion réussie");
    } catch (error) {
      toast.error("Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    // Vérification du format de l'email
    const emailDomain = email.split('@')[1];
    let userType = '';
    
    if (emailDomain === 'skema.edu') {
      userType = 'étudiant';
    } else if (emailDomain === 'alumni.skema.edu') {
      userType = 'alumni';
    } else if (emailDomain === 'junior-conseil.com') {
      userType = 'membre';
    } else {
      userType = 'client';
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success(`Inscription réussie en tant que ${userType} ! Vérifiez vos emails.`);
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-sm text-muted-foreground">
          Utilisez votre email institutionnel pour être automatiquement redirigé vers le bon espace :
        </p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>@skema.edu pour les étudiants</li>
          <li>@alumni.skema.edu pour les alumni</li>
          <li>@junior-conseil.com pour les membres</li>
          <li>Autre email pour les clients</li>
        </ul>
      </div>

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
        </div>
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            required
            minLength={6}
          />
        </div>
        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Chargement..." : "Se connecter"}
        </Button>
      </form>

      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Ou
            </span>
          </div>
        </div>

        <Button 
          onClick={handleSignUp} 
          variant="outline" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Chargement..." : "S'inscrire"}
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;