/*
  # Create games table for lobby system

  1. New Tables
    - `games`
      - `id` (uuid, primary key)
      - `host_user_id` (uuid, references auth.users)
      - `opponent_user_id` (uuid, references auth.users, nullable)
      - `status` (text) - possible values: 'waiting', 'in_progress', 'completed'
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `games` table
    - Add policies for:
      - Anyone can read games
      - Authenticated users can create games
      - Host can update their own games
      - Opponent can join games
*/

CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_user_id UUID REFERENCES auth.users(id) NOT NULL,
  opponent_user_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'waiting',
  created_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT valid_status CHECK (status IN ('waiting', 'in_progress', 'completed'))
);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read games
CREATE POLICY "Games are viewable by everyone"
  ON games
  FOR SELECT
  USING (true);

-- Allow authenticated users to create games
CREATE POLICY "Users can create games"
  ON games
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = host_user_id AND opponent_user_id IS NULL);

-- Allow host to update their games
CREATE POLICY "Host can update their games"
  ON games
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = host_user_id);

-- Allow users to join games as opponent
CREATE POLICY "Users can join games"
  ON games
  FOR UPDATE
  TO authenticated
  USING (
    status = 'waiting' AND 
    opponent_user_id IS NULL AND 
    auth.uid() != host_user_id
  )
  WITH CHECK (
    status = 'in_progress' AND 
    auth.uid() = opponent_user_id
  );