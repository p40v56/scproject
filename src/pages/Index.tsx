import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useRedirectByUserType } from "@/hooks/useRedirectByUserType";

const Index = () => {
  useRedirectByUserType();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
      <div className="absolute inset-0 bg-grid-slate-900/[0.02] bg-[size:20px_20px]" />
      <div className="w-full max-w-md p-8 glass-effect rounded-2xl shadow-2xl fade-in relative mx-4 backdrop-blur-sm border border-white/10">
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
            Junior Connect
          </h1>
          <p className="text-slate-600 font-medium">
            Portail de gestion
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
                    brand: '#1d4ed8',
                    brandAccent: '#1e40af',
                  },
                },
              },
              className: {
                container: 'space-y-4',
                button: 'bg-blue-700 hover:bg-blue-800 text-white font-medium py-2.5 rounded-lg transition-colors w-full',
                input: 'w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all',
                label: 'text-sm font-medium text-gray-700',
              },
            }}
            providers={[]}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Mot de passe',
                  button_label: 'Se connecter',
                  loading_button_label: 'Connexion en cours...',
                },
              },
            }}
            view="sign_in"
            showLinks={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;