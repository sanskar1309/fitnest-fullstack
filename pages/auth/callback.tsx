import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';
import { LottieLoader } from '../../src/components/ui/LottieLoader';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle different types of auth callbacks
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          router.push('/login?error=auth_callback_error');
          return;
        }

        if (data.session) {
          // Check if this is a password reset callback
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const type = hashParams.get('type');

          if (type === 'recovery' && accessToken) {
            // This is a password reset callback, redirect to reset password page
            router.push('/auth/reset-password');
            return;
          }

          // Regular email confirmation or other auth callback
          const redirectTo = router.query.redirect as string || '/';
          router.push(redirectTo);
        } else {
          // No session, redirect to login
          router.push('/login');
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        router.push('/login?error=unexpected_error');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
      <div className="text-center space-y-4">
        <LottieLoader />
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Processing authentication...
          </h2>
          <p className="text-muted-foreground">
            Please wait while we complete your request.
          </p>
        </div>
      </div>
    </div>
  );
}
