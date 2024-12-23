import { useState, useEffect } from 'react';
import { ChallengeAttempt } from '../types/ChallengeAttempt';
import { challengeAttemptService } from '../services/challengeAttemptService';

export function useChallengeAttempt(userId: string | undefined, challengeId: string | undefined) {
  const [attempt, setAttempt] = useState<ChallengeAttempt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !challengeId) {
      setIsLoading(false);
      return;
    }

    const loadAttempt = async () => {
      try {
        setIsLoading(true);
        const data = await challengeAttemptService.getAttemptByUserAndChallenge(
          userId,
          challengeId
        );
        setAttempt(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load attempt');
      } finally {
        setIsLoading(false);
      }
    };

    loadAttempt();
  }, [userId, challengeId]);

  return { attempt, isLoading, error };
}