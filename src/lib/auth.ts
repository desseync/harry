import { supabase } from './supabase';
import type { AuthError, User } from '@supabase/supabase-js';

interface AuthResponse {
  user: User | null;
  error: AuthError | null;
}

/**
 * Register a new user with email and password
 */
export const registerUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  // Debug check
  if (!supabase) {
    console.error('Supabase client is not initialized');
    return {
      user: null,
      error: {
        message: 'Authentication service is not initialized',
        status: 500,
        name: 'InitializationError'
      } as AuthError
    };
  }

  try {
    console.log('Attempting registration...'); // Debug log
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/member`,
      },
    });

    if (error) {
      console.error('Registration error:', error); // Debug log
    } else {
      console.log('Registration successful:', data); // Debug log
    }

    return {
      user: data?.user ?? null,
      error: error,
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      user: null,
      error: error as AuthError,
    };
  }
};

/**
 * Sign in an existing user with email and password
 */
export const signInUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  // Debug check
  if (!supabase) {
    console.error('Supabase client is not initialized');
    return {
      user: null,
      error: {
        message: 'Authentication service is not initialized',
        status: 500,
        name: 'InitializationError'
      } as AuthError
    };
  }

  try {
    console.log('Attempting sign in...'); // Debug log
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error); // Debug log
    } else {
      console.log('Sign in successful:', data); // Debug log
    }

    return {
      user: data?.user ?? null,
      error: error,
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      user: null,
      error: error as AuthError,
    };
  }
};

/**
 * Sign out the current user
 */
export const signOutUser = async (): Promise<{ error: AuthError | null }> => {
  // Debug check
  if (!supabase) {
    console.error('Supabase client is not initialized');
    return {
      error: {
        message: 'Authentication service is not initialized',
        status: 500,
        name: 'InitializationError'
      } as AuthError
    };
  }

  try {
    console.log('Attempting sign out...'); // Debug log
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Sign out error:', error); // Debug log
    } else {
      console.log('Sign out successful'); // Debug log
    }
    
    return { error };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error: error as AuthError };
  }
};

/**
 * Get the current session
 */
export const getCurrentSession = async () => {
  // Debug check
  if (!supabase) {
    console.error('Supabase client is not initialized');
    return {
      session: null,
      error: {
        message: 'Authentication service is not initialized',
        status: 500,
        name: 'InitializationError'
      } as AuthError
    };
  }

  try {
    console.log('Getting current session...'); // Debug log
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Get session error:', error); // Debug log
    } else {
      console.log('Session retrieved:', session ? 'Present' : 'None'); // Debug log
    }
    
    return { session, error };
  } catch (error) {
    console.error('Get session error:', error);
    return { session: null, error: error as AuthError };
  }
};

/**
 * Subscribe to auth state changes
 */
export const onAuthStateChange = (
  callback: (event: 'SIGNED_IN' | 'SIGNED_OUT', session: any) => void
) => {
  // Debug check
  if (!supabase) {
    console.error('Supabase client is not initialized');
    return {
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    };
  }

  console.log('Setting up auth state change listener...'); // Debug log
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session ? 'Session present' : 'No session'); // Debug log
    callback(event, session);
  });
  
  return subscription;
};