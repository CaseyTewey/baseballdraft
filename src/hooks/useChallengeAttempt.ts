import { useState, useEffect } from 'react';
import { ChallengeAttempt } from '../types/ChallengeAttempt';
import { supabase } from '../lib/supabase';

export function useChallengeAttempt(userId: string | undefined, challengeId: string | undefined) {
  const [attempt, setAttempt] = useState<ChallengeAttempt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttempt = async () => {
    if (!userId || !challengeId) {
      setAttempt(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('challenge_attempts')
        .select('*')
        .eq('user_id', userId)
        .eq('challenge_id', challengeId)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      setAttempt(data || null);
    } catch (err) {
      console.error('Error fetching attempt:', err);
      setError('Failed to load attempt');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttempt();
  }, [userId, challengeId]);

  return {
    attempt,
    isLoading,
    error,
    mutate: fetchAttempt
  };
}