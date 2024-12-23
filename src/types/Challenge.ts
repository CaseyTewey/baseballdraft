export interface DailyChallenge {
  id: string;
  challenge_date: string;
  rule: string;
  pick_limit: number;
  players_pool: any[] | null;
  created_at: string;
}

export interface Player {
  id: string;
  name: string;
  team: string;
  stats: {
    [key: string]: number;
  };
}