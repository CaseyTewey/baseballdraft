-- Add title column to challenges table
ALTER TABLE challenges ADD COLUMN title TEXT;

-- Make title column required and unique
ALTER TABLE challenges ALTER COLUMN title SET NOT NULL;
ALTER TABLE challenges ADD CONSTRAINT challenges_title_key UNIQUE (title); 