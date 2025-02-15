import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const authRedirectUrl =
  import.meta.env.VITE_AUTH_REDIRECT_URL || `${window.location.origin}/auth/callback`;

// Helper to validate and log environment variables
const validateConfig = () => {
  const errors: string[] = [];
  const logs: string[] = [];

  if (!supabaseUrl) {
    errors.push('VITE_SUPABASE_URL is missing.');
  } else {
    logs.push(`VITE_SUPABASE_URL: ${supabaseUrl}`);
    if (!supabaseUrl.startsWith('https://')) {
      errors.push('VITE_SUPABASE_URL must start with https://');
    }
    if (!supabaseUrl.endsWith('.supabase.co')) {
      errors.push('VITE_SUPABASE_URL must end with .supabase.co');
    }
  }

  if (!supabaseAnonKey) {
    errors.push('VITE_SUPABASE_ANON_KEY is missing.');
  } else {
    logs.push('VITE_SUPABASE_ANON_KEY: Present');
    if (supabaseAnonKey.length < 20) {
      errors.push('VITE_SUPABASE_ANON_KEY appears to be invalid (too short).');
    }
  }

  if (!authRedirectUrl) {
    errors.push('VITE_AUTH_REDIRECT_URL is missing.');
  } else {
    logs.push(`VITE_AUTH_REDIRECT_URL: ${authRedirectUrl}`);
    if (!authRedirectUrl.startsWith('https://')) {
      errors.push('VITE_AUTH_REDIRECT_URL must start with https://');
    }
  }

  console.log('Supabase Configuration Logs:', logs.join('\n'));
  if (errors.length > 0) {
    console.error('Supabase Configuration Errors:', errors.join('\n'));
  }

  return errors.length === 0;
};

// Create Supabase client or handle failure gracefully
export const supabase = (() => {
  if (!validateConfig()) {
    console.error('Supabase client failed to initialize. Fix the errors listed above.');
    return null;
  }

  console.log('Supabase client is initializing...');
  return createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: window.localStorage,
      redirectTo: authRedirectUrl,
    },
    global: {
      headers: { 'x-client-info': 'frequency-ai-web' },
    },
    db: {
      schema: 'public',
    },
  });
})();

// Export a helper function to check if Supabase is configured
export const isSupabaseConfigured = () => !!supabase;

// Log final initialization status
if (supabase) {
  console.log('Supabase client initialized successfully.');
} else {
  console.error('Supabase client initialization failed. Check your environment variables.');
}
