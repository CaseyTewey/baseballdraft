-- Add foreign key from challenge_attempts to profiles
ALTER TABLE challenge_attempts
  DROP CONSTRAINT IF EXISTS challenge_attempts_user_id_fkey,
  ADD CONSTRAINT challenge_attempts_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE; 