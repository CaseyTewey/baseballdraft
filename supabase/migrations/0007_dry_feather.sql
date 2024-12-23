/*
  # Create Daily Challenges Schema

  1. New Tables
    - `daily_challenges`
      - `id` (uuid, primary key)
      - `challenge_date` (date, unique)
      - `rule` (text)
      - `pick_limit` (integer)
      - `players_pool` (jsonb)
      - `created_at` (timestamptz)
    
  2. Security
    - Enable RLS
    - Add policies for public read access
*/

CREATE TABLE IF NOT EXISTS daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_date DATE NOT NULL UNIQUE,
  rule TEXT NOT NULL,
  pick_limit INTEGER NOT NULL DEFAULT 5,
  players_pool JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;

-- Allow public read access to daily challenges
CREATE POLICY "Daily challenges are viewable by everyone"
  ON daily_challenges
  FOR SELECT
  USING (true);

-- Only allow system-level operations for insert/update
CREATE POLICY "System level insert only"
  ON daily_challenges
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE is_super_admin = true));