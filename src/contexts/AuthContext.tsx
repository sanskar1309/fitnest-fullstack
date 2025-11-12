import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/router';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<{ data: any; error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN') {
          // Redirect to intended page or home
          const redirectTo = router.query.redirect as string || '/';
          router.push(redirectTo);
        } else if (event === 'SIGNED_OUT') {
          router.push('/');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      // Validate inputs
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();
      const trimmedName = (name || '').trim();

      if (!trimmedEmail || !trimmedPassword) {
        return {
          data: null,
          error: {
            message: 'Email and password are required.',
          } as any,
        };
      }

      if (trimmedPassword.length < 6) {
        return {
          data: null,
          error: {
            message: 'Password must be at least 6 characters long.',
          } as any,
        };
      }

      if (!trimmedEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return {
          data: null,
          error: {
            message: 'Please enter a valid email address.',
          } as any,
        };
      }

      // First check if user already exists
      const checkResponse = await fetch('/api/check-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      if (!checkResponse.ok) {
        return {
          data: null,
          error: {
            message: 'Failed to check user existence. Please try again.',
          } as any,
        };
      }

      const checkData = await checkResponse.json();

      if (checkData.exists) {
        return {
          data: null,
          error: {
            message: 'An account with this email already exists. Please sign in instead.',
          } as any,
        };
      }

      // Proceed with signup if email doesn't exist
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: trimmedPassword,
        options: {
          data: {
            name: trimmedName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      return { data, error };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        data: null,
        error: {
          message: 'An unexpected error occurred. Please try again.',
        } as any,
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      if (!trimmedEmail || !trimmedPassword) {
        return {
          error: {
            message: 'Email and password are required.',
          } as any,
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      return { error };
    } catch (error) {
      console.error('Sign-in error:', error);
      return {
        error: {
          message: 'An unexpected error occurred. Please try again.',
        } as any,
      };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    try {
      const trimmedEmail = email.trim().toLowerCase();

      if (!trimmedEmail) {
        return {
          error: {
            message: 'Email is required.',
          } as any,
        };
      }

      if (!trimmedEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return {
          error: {
            message: 'Please enter a valid email address.',
          } as any,
        };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      return { error };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        error: {
          message: 'An unexpected error occurred. Please try again.',
        } as any,
      };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
