import { useEffect, useState, useRef } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  return url && key && url !== 'https://placeholder.supabase.co' && key !== 'placeholder-key';
};

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export function useAuth() {
  const isMountedRef = useRef(true);
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    isMountedRef.current = true;

    // Skip Supabase calls if not configured
    if (!isSupabaseConfigured()) {
      if (isMountedRef.current) {
        setAuthState({
          user: null,
          session: null,
          loading: false,
        });
      }
      return;
    }

    // Additional check for supabase client
    if (!supabase) {
      if (isMountedRef.current) {
        setAuthState({
          user: null,
          session: null,
          loading: false,
        });
      }
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMountedRef.current) {
        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
        });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMountedRef.current) {
        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
        });
      }
    });

    return () => {
      isMountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      return { 
        data: { user: null, session: null }, 
        error: { message: 'Supabase is not configured. Please set up your environment variables.' }
      };
    }

    if (!supabase) {
      return { 
        data: { user: null, session: null }, 
        error: { message: 'Supabase client is not available.' }
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } catch (fetchError) {
      return {
        data: { user: null, session: null },
        error: { message: 'Network error: Unable to connect to authentication service.' }
      };
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      return { 
        data: { user: null, session: null }, 
        error: { message: 'Supabase is not configured. Please set up your environment variables.' }
      };
    }

    if (!supabase) {
      return { 
        data: { user: null, session: null }, 
        error: { message: 'Supabase client is not available.' }
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { data, error };
    } catch (fetchError) {
      return {
        data: { user: null, session: null },
        error: { message: 'Network error: Unable to connect to authentication service.' }
      };
    }
  };

  const signOut = async () => {
    if (!isSupabaseConfigured()) {
      return { error: null };
    }

    if (!supabase) {
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (fetchError) {
      return { error: { message: 'Network error: Unable to sign out.' } };
    }
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
  };
}