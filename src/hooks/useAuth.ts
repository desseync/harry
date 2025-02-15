import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { getCurrentSession, onAuthStateChange } from '../lib/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { session, error } = await getCurrentSession();
        if (error) throw error;
        setUser(session?.user ?? null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const subscription = onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading, error };
}