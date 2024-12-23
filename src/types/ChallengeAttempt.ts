export interface ChallengeAttempt {
  id: string;
  user_id: string;
  challenge_id: string;
  score: number;
  picks: {
    player_id: string;
    name: string;
    stat_value: number;
  }[];
  created_at: string;
}