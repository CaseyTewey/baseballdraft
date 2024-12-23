import { supabase } from '../lib/supabase';
import { ChallengeAttempt } from '../types/ChallengeAttempt';

export const challengeAttemptService = {
  async insertAttempt(data: {
    userId: string;
    challengeId: string;
    score: number;
    picks: any[];
  }): Promise<ChallengeAttempt> {
    const { data: attempt, error } = await supabase
      .from('challenge_attempts')
      .insert([{
        user_id: data.userId,
        challenge_id: data.challengeId,
        score: data.score,
        picks: data.picks
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return attempt;
  },

  async getAttemptByUserAndChallenge(
    userId: string,
    challengeId: string
  ): Promise<ChallengeAttempt | null> {
    const { data, error } = await supabase
      .from('challenge_attempts')
      .select('*')
      .eq('user_id', userId)
      .eq('challenge_id', challengeId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  },

  async getLeaderboardForChallenge(
    challengeId: string
  ): Promise<(ChallengeAttempt & { username: string })[]> {
    const { data, error } = await supabase
      .from('challenge_attempts')
      .select(`
        *,
        profiles:profiles(username)
      `)
      .eq('challenge_id', challengeId)
      .order('score', { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(attempt => ({
      ...attempt,
      username: attempt.profiles.username
    }));
  }
};