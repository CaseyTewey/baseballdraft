/*
  # Create Challenge Attempts Schema

  1. New Tables
    - `challenge_attempts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `challenge_id` (uuid, references daily_challenges)
      - `score` (integer)
      - `picks` (jsonb)
      - `created_at` (timestamptz)
    
  2. Constraints
    - Unique constraint on (user_id, challenge_id)
    
  3. Security
    - Enable RLS
    - Add policies for user-specific access
*/

CREATE TABLE IF NOT EXISTS challenge_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES daily_challenges(id) ON DELETE CASCADE,
  score INTEGER,
  picks JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_challenge_attempts_user ON challenge_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_attempts_challenge ON challenge_attempts(challenge_id);

ALTER TABLE challenge_attempts ENABLE ROW LEVEL SECURITY;

-- Users can read their own attempts
CREATE POLICY "Users can view their own attempts"
  ON challenge_attempts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create their own attempts
CREATE POLICY "Users can create their own attempts"
  ON challenge_attempts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow public read access for leaderboard
CREATE POLICY "Anyone can view all attempts for leaderboard"
  ON challenge_attempts
  FOR SELECT
  USING (true);