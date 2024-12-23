import { supabase } from '../lib/supabase';
import { DailyChallenge } from '../types/Challenge';

export const challengeService = {
  async getTodayChallenge(): Promise<DailyChallenge | null> {
    const today = new Date().toISOString().split('T')[0];
    console.log('Fetching challenge for date:', today);
    
    const { data, error } = await supabase
      .from('daily_challenges')
      .select('*')
      .eq('challenge_date', today)
      .maybeSingle();

    if (error) {
      console.error('Error fetching challenge:', error);
      throw error;
    }

    console.log('Challenge data:', data);
    return data;
  }
};