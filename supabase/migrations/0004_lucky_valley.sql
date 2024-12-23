/*
  # Fix Game Relationships

  1. Changes
    - Update foreign key relationships for games table to reference profiles
    - Add indexes for better query performance
  
  2. Security
    - Keep existing RLS policies
*/

-- Drop existing foreign key constraints if they exist
ALTER TABLE games
DROP CONSTRAINT IF EXISTS games_host_user_id_fkey,
DROP CONSTRAINT IF EXISTS games_opponent_user_id_fkey;

-- Add correct foreign key constraints to profiles
ALTER TABLE games
ADD CONSTRAINT games_host_user_id_fkey
  FOREIGN KEY (host_user_id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

ALTER TABLE games
ADD CONSTRAINT games_opponent_user_id_fkey
  FOREIGN KEY (opponent_user_id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_games_host_user_id ON games(host_user_id);
CREATE INDEX IF NOT EXISTS idx_games_opponent_user_id ON games(opponent_user_id);
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);