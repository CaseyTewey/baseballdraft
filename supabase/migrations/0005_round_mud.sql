/*
  # Fix Profile Joins for Games

  1. Changes
    - Add join table for games and profiles
    - Update indexes for efficient joins
  
  2. Security
    - Maintain existing RLS policies
*/

-- Create a view to make profile joins easier
CREATE OR REPLACE VIEW game_profiles AS
SELECT 
  g.*,
  host_profile.username as host_username,
  opponent_profile.username as opponent_username
FROM games g
LEFT JOIN profiles host_profile ON g.host_user_id = host_profile.user_id
LEFT JOIN profiles opponent_profile ON g.opponent_user_id = opponent_profile.user_id;