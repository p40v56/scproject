import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useRedirectByUserType = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserType = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', session.user.id)
        .single();

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
        }
      }
    };

    checkUserType();
  }, [navigate]);
};