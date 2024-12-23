import { useState, useEffect } from 'react';
import { DailyChallenge } from '../types/Challenge';
import { challengeService } from '../services/challengeService';

export function useChallenge() {
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChallenge = async () => {
      try {
        setIsLoading(true);
        const data = await challengeService.getTodayChallenge();
        setChallenge(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load challenge');
      } finally {
        setIsLoading(false);
      }
    };

    loadChallenge();
  }, []);

  return { challenge, isLoading, error };
}