import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useRedirectByUserType } from "@/hooks/useRedirectByUserType";

const Index = () => {
  useRedirectByUserType();

  return (
    <div className="min-h-screen flex items-center justify-center honeycomb-bg">
      <div className="w-full max-w-md space-y-8 p-8 glass-effect rounded-2xl shadow-2xl fade-in relative mx-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
            SKEMA Conseil Intranet
          </h1>
          <p className="text-slate-600">
            Portail de gestion centralisé
          </p>
        </div>
        <div className="scale-in">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2563eb',
                    brandAccent: '#1d4ed8',
                  },
                },
              },
            }}
            providers={[]}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;