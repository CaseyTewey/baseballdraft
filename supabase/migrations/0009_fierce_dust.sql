/*
  # Update daily challenges policy
  
  1. Changes
    - Remove system-level restriction for inserting challenges
    - Allow authenticated users to insert challenges
*/

DROP POLICY IF EXISTS "System level insert only" ON daily_challenges;

CREATE POLICY "Authenticated users can create challenges"
  ON daily_challenges
  FOR INSERT
  TO authenticated
  WITH CHECK (true);