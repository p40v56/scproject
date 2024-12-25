import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tables } from '@/integrations/supabase/types';

type Profile = Tables<"profiles">;

export const useAuthRedirect = (userProfile: Profile | null) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile) {
      switch (userProfile.user_type) {
        case 'client':
          navigate('/client');
          break;
        case 'member':
          navigate('/member');
          break;
        case 'student':
          navigate('/student');
          break;
        case 'alumni':
          navigate('/alumni');
          break;
      }
    }
  }, [userProfile, navigate]);
};