/*
  # Add Players and Draft Picks Tables

  1. New Tables
    - `players`: Stores MLB player information
      - `id` (uuid, primary key)
      - `player_name` (text)
      - `team` (text)
      - `rbis` (integer)
      - `home_runs` (integer)
      - `created_at` (timestamp)
    
    - `draft_picks`: Tracks draft picks for each game
      - `id` (uuid, primary key)
      - `game_id` (uuid, references games)
      - `user_id` (uuid, references auth.users)
      - `player_id` (uuid, references players)
      - `pick_order` (integer)
      - `created_at` (timestamp)

  2. Changes
    - Add `current_turn_user_id` to games table
    - Add indexes for better query performance

  3. Security
    - Enable RLS on both tables
    - Add appropriate policies for each table
*/

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  team text,
  rbis integer DEFAULT 0,
  home_runs integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create draft_picks table
CREATE TABLE IF NOT EXISTS draft_picks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  player_id uuid REFERENCES players(id) ON DELETE CASCADE,
  pick_order integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(game_id, player_id),
  UNIQUE(game_id, pick_order)
);

-- Add current_turn_user_id to games
ALTER TABLE games ADD COLUMN IF NOT EXISTS current_turn_user_id uuid REFERENCES auth.users(id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_draft_picks_game_id ON draft_picks(game_id);
CREATE INDEX IF NOT EXISTS idx_draft_picks_user_id ON draft_picks(user_id);
CREATE INDEX IF NOT EXISTS idx_draft_picks_player_id ON draft_picks(player_id);
CREATE INDEX IF NOT EXISTS idx_players_name ON players(player_name);

-- Enable RLS
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE draft_picks ENABLE ROW LEVEL SECURITY;

-- Policies for players table
CREATE POLICY "Players are viewable by everyone"
  ON players FOR SELECT
  TO public
  USING (true);

-- Policies for draft_picks table
CREATE POLICY "Draft picks are viewable by everyone"
  ON draft_picks FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create their own draft picks"
  ON draft_picks FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM games
      WHERE id = game_id
      AND status = 'in_progress'
      AND current_turn_user_id = auth.uid()
    )
  );