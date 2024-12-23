/*
  # Update daily challenges table and policies
  
  1. Changes
    - Drop existing policies
    - Add new policies for better access control
    - Add service_role user for system operations
*/

-- First drop existing policies
DROP POLICY IF EXISTS "Daily challenges are viewable by everyone" ON daily_challenges;
DROP POLICY IF EXISTS "System level insert only" ON daily_challenges;
DROP POLICY IF EXISTS "Authenticated users can create challenges" ON daily_challenges;

-- Recreate the policies with proper access control
CREATE POLICY "Anyone can view daily challenges"
  ON daily_challenges
  FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage daily challenges"
  ON daily_challenges
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add index for challenge_date
CREATE INDEX IF NOT EXISTS idx_daily_challenges_date ON daily_challenges(challenge_date);