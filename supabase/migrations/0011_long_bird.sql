/*
  # Fix daily challenge policies
  
  1. Changes
    - Drop and recreate policies with proper access
    - Ensure service role has full access
    - Add better indexes
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Anyone can view daily challenges" ON daily_challenges;
DROP POLICY IF EXISTS "Service role can manage daily challenges" ON daily_challenges;

-- Create new policies
CREATE POLICY "Anyone can view daily challenges"
  ON daily_challenges
  FOR SELECT
  USING (true);

CREATE POLICY "Service role has full access"
  ON daily_challenges
  USING (true)
  WITH CHECK (true);

-- Ensure proper indexes
CREATE INDEX IF NOT EXISTS idx_daily_challenges_date ON daily_challenges(challenge_date);

-- Grant necessary permissions
GRANT ALL ON daily_challenges TO service_role;
GRANT SELECT ON daily_challenges TO anon;
GRANT SELECT ON daily_challenges TO authenticated;