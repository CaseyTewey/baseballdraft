/*
  # Rename daily_challenges table and related objects
  
  1. Changes
    - Rename daily_challenges table to challenges
    - Rename related indexes and foreign key constraints
    - Update RLS policies
*/

-- Rename the table
ALTER TABLE daily_challenges RENAME TO challenges;

-- Rename the index
ALTER INDEX idx_daily_challenges_date RENAME TO idx_challenges_date;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view daily challenges" ON challenges;
DROP POLICY IF EXISTS "Service role can manage daily challenges" ON challenges;

-- Recreate policies with new names
CREATE POLICY "Anyone can view challenges"
  ON challenges
  FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage challenges"
  ON challenges
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Update foreign key constraints in challenge_attempts
ALTER TABLE challenge_attempts 
  DROP CONSTRAINT IF EXISTS challenge_attempts_challenge_id_fkey,
  ADD CONSTRAINT challenge_attempts_challenge_id_fkey 
    FOREIGN KEY (challenge_id) 
    REFERENCES challenges(id) 
    ON DELETE CASCADE; 