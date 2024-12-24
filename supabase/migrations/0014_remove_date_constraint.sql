-- Remove unique constraint on challenge_date
ALTER TABLE challenges DROP CONSTRAINT IF EXISTS daily_challenges_challenge_date_key;

-- Make challenge_date nullable
ALTER TABLE challenges ALTER COLUMN challenge_date DROP NOT NULL; 