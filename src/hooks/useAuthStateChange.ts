import { useEffect, useRef } from 'react';
import { AuthError, Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/integrations/supabase/types';

interface UseAuthStateChangeProps {
  setSession: (session: Session | null) => void;
  setUserProfile: (profile: Profile | null) => void;
  onError?: (error: AuthError) => void;
}

export const useAuthStateChange = ({
  setSession,
  setUserProfile,
  onError
}: UseAuthStateChangeProps) => {
  const initializationComplete = useRef(false);

  useEffect(() => {
    const fetchProfile = async (user: User) => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        return profile;
      } catch (error) {
        console.error('Error fetching profile:', error);
        onError?.(error as AuthError);
        return null;
      }
    };

    const handleAuthChange = async (event: string, session: Session | null) => {
      console.log("Auth state change event:", event);
      
      if (event === 'SIGNED_OUT') {
        setSession(null);
        setUserProfile(null);
        initializationComplete.current = true;
        return;
      }

      if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        const profile = await fetchProfile(session.user);
        setSession(session);
        setUserProfile(profile);
        initializationComplete.current = true;
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.user) {
          const profile = await fetchProfile(session.user);
          setSession(session);
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        onError?.(error as AuthError);
      } finally {
        initializationComplete.current = true;
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession, setUserProfile, onError]);

  return { initializationComplete };
};