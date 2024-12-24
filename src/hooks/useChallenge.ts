import { useState, useEffect } from 'react';
import { Challenge } from '../types/Challenge';
import { challengeService } from '../services/challengeService';

export function useChallenge() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        setIsLoading(true);
        const data = await challengeService.getChallenges();
        setChallenges(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load challenges');
      } finally {
        setIsLoading(false);
      }
    };

    loadChallenges();
  }, []);

  return { challenges, isLoading, error };
}