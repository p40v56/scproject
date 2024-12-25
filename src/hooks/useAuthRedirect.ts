import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Profile } from '@/integrations/supabase/types';

export const useAuthRedirect = (
  userProfile: Profile | null,
  initializationComplete: React.MutableRefObject<boolean>
) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!initializationComplete.current) return;

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
    } else {
      navigate('/');
    }
  }, [userProfile, navigate, initializationComplete]);
};