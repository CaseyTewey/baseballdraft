/*
  # Add foreign key relationship between games and profiles

  1. Changes
    - Add foreign key constraint from games.host_user_id to profiles.user_id
    - Add foreign key constraint from games.opponent_user_id to profiles.user_id

  2. Notes
    - This ensures referential integrity between games and user profiles
    - Enables proper joins between games and profiles tables
*/

-- Add foreign key constraints
ALTER TABLE games
DROP CONSTRAINT IF EXISTS games_host_user_id_fkey,
DROP CONSTRAINT IF EXISTS games_opponent_user_id_fkey;

ALTER TABLE games
ADD CONSTRAINT games_host_user_id_fkey
  FOREIGN KEY (host_user_id)
  REFERENCES profiles(user_id)
  ON DELETE CASCADE;

ALTER TABLE games
ADD CONSTRAINT games_opponent_user_id_fkey
  FOREIGN KEY (opponent_user_id)
  REFERENCES profiles(user_id)
  ON DELETE CASCADE;