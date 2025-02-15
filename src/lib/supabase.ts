import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const authRedirectUrl = import.meta.env.VITE_AUTH_REDIRECT_URL || `${window.location.origin}/auth/callback`;

// Enhanced validation with detailed checks
const validateConfig = () => {
  const issues = [];
  
  if (!supabaseUrl) {
    issues.push('VITE_SUPABASE_URL is missing');
  } else {
    // Ensure URL has https:// prefix
    if (!supabaseUrl.startsWith('https://')) {
      issues.push('VITE_SUPABASE_URL must start with https://');
    }
    if (!supabaseUrl.endsWith('.supabase.co')) {
      issues.push('VITE_SUPABASE_URL must end with .supabase.co');
    }
  }

  if (!supabaseAnonKey) {
    issues.push('VITE_SUPABASE_ANON_KEY is missing');
  } else if (supabaseAnonKey.length < 20) {
    issues.push('VITE_SUPABASE_ANON_KEY appears to be invalid');
  }

  if (import.meta.env.DEV && issues.length > 0) {
    console.error('Supabase Configuration Issues:', issues);
  }

  return issues.length === 0;
};

// Get the appropriate redirect URL based on environment
const getRedirectUrl = () => authRedirectUrl;

// Ensure URL has https:// prefix
const getFormattedUrl = (url: string) => url.startsWith('https://') ? url : `https://${url}`;

// Create Supabase client with enhanced error handling
export const supabase = validateConfig()
  ? createClient(getFormattedUrl(supabaseUrl), supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
        flowType: 'pkce',
        redirectTo: getRedirectUrl(),
      },
      global: {
        headers: { 'x-client-info': 'frequency-ai-web' },
      },
      db: {
        schema: 'public',
      },
    })
  : null;

// Export helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  if (!supabase) {
    // Log detailed error in development
    if (import.meta.env.DEV) {
      console.error('Supabase Configuration Status:', {
        url: supabaseUrl ? 'Present' : 'Missing',
        key: supabaseAnonKey ? 'Present' : 'Missing',
        urlValid: supabaseUrl?.includes('.supabase.co'),
        formattedUrl: supabaseUrl ? getFormattedUrl(supabaseUrl) : null,
        redirectUrl: getRedirectUrl(),
      });
    }
    return false;
  }
  return true;
};

// Debug check - log Supabase client status
console.log('Supabase client initialization:', {
  configured: isSupabaseConfigured(),
  client: supabase ? 'Present' : 'Missing',
  auth: supabase?.auth ? 'Present' : 'Missing'
});

if (!supabase) {
  throw new Error('Supabase client is not initialized properly. Check your environment variables.');
}
