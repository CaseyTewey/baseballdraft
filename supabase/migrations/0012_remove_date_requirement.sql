/*
  # Make challenges date-independent
  
  1. Changes
    - Make challenge_date column nullable
    - Drop unique constraint on challenge_date
*/

-- Make challenge_date nullable and remove unique constraint
ALTER TABLE challenges 
  ALTER COLUMN challenge_date DROP NOT NULL,
  DROP CONSTRAINT IF EXISTS daily_challenges_challenge_date_key; 