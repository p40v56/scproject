import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useRedirectByUserType = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserType = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();

        if (error) {
          throw error;
        }

        if (profile) {
          switch (profile.user_type) {
            case 'client':
              navigate('/client');
              break;
            case 'student':
              navigate('/student');
              break;
            case 'alumni':
              navigate('/alumni');
              break;
            case 'member':
              navigate('/member');
              break;
            default:
              toast.error("Type d'utilisateur non reconnu");
              break;
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error("Erreur lors de la redirection");
      }
    };

    checkUserType();
  }, [navigate]);
};