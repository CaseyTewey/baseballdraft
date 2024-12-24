import { supabase } from '../lib/supabase';
import { Challenge } from '../types/Challenge';

export const challengeService = {
  async getChallenges(): Promise<Challenge[]> {
    console.log('Fetching all challenges');
    
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .order('challenge_date', { ascending: true });

    if (error) {
      console.error('Error fetching challenges:', error);
      console.error('Error details:', error.details);
      console.error('Error message:', error.message);
      console.error('Error hint:', error.hint);
      throw error;
    }

    console.log('Challenge data:', data);
    return data || [];
  },

  async getChallenge(id: string): Promise<Challenge | null> {
    console.log('Fetching challenge:', id);
    
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching challenge:', error);
      console.error('Error details:', error.details);
      console.error('Error message:', error.message);
      console.error('Error hint:', error.hint);
      throw error;
    }

    console.log('Challenge data:', data);
    return data;
  }
};