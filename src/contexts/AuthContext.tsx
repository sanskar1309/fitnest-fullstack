import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/router';
import { isPasswordValid, isCommonPassword } from '../utils/passwordValidation';

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

  // Get the site URL from environment variable or fallback to current origin
  // This ensures production emails use the production URL instead of localhost
  const getSiteUrl = () => {
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      return process.env.NEXT_PUBLIC_SITE_URL;
    }
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return 'http://localhost:3000';
  };

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

        // Only navigate on SIGNED_IN if the user has just completed an explicit
        // sign-in flow (i.e. there's a redirect query or the current pathname
        // is a login/auth page). Avoid navigating on silent rehydration/token
        // refresh events which can otherwise cause unexpected redirects when
        // users switch tabs.
        if (event === 'SIGNED_IN') {
          const redirectTo = router.query.redirect as string | undefined;
          const onAuthPage = router.pathname.startsWith('/auth') || router.pathname === '/login';

          if (redirectTo || onAuthPage) {
            // Redirect only when explicit (redirect param or auth page)
            const target = redirectTo ?? '/';
            router.push(target);
          }
        }
        // Do not automatically redirect to home on SIGNED_OUT — let
        // `ProtectedRoute` or explicit signOut flows handle navigation so the
        // user does not get unexpectedly redirected when the session is
        // refreshed or temporarily becomes unavailable.
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

      // Check for common passwords
      if (isCommonPassword(trimmedPassword)) {
        return {
          data: null,
          error: {
            message: 'This password is too common. Please choose a different one.',
          } as any,
        };
      }

      // Validate minimum password length (12 characters as per Supabase recommendation)
      if (!isPasswordValid(trimmedPassword)) {
        return {
          data: null,
          error: {
            message: 'Password must be at least 12 characters long.',
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
      try {
        const checkResponse = await fetch('/api/check-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: trimmedEmail }),
        });

        if (checkResponse.ok) {
          const checkData = await checkResponse.json();

          if (checkData.exists) {
            return {
              data: null,
              error: {
                message: 'An account with this email already exists. Please sign in instead.',
              } as any,
            };
          }
        } else {
          // Log the error but don't block signup
          console.warn('Failed to check user existence, proceeding with signup:', await checkResponse.text());
        }
      } catch (checkError) {
        // Log the error but don't block signup
        console.warn('Error checking user existence, proceeding with signup:', checkError);
      }

      // Proceed with signup if email doesn't exist
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: trimmedPassword,
        options: {
          data: {
            name: trimmedName,
          },
          emailRedirectTo: `${getSiteUrl()}/auth/callback`,
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

      const { error } = await supabase.auth.signInWithPassword({
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
    // Perform the actual sign out and navigate explicitly — this avoids
    // coupling the subscription's SIGNED_OUT event (which can fire on
    // silent/session changes) with navigation logic.
    await supabase.auth.signOut();
    router.push('/');
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
        redirectTo: `${getSiteUrl()}/auth/reset-password`,
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
