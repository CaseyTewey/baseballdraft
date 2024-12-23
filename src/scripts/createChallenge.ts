import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the root .env file
const envPath = join(__dirname, '../../.env');
const envConfig = dotenv.parse(readFileSync(envPath));

// Set environment variables
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  console.error('VITE_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

// Create client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const players = [
  { name: 'Mike Trout', hrs: 3 },
  { name: 'Aaron Judge', hrs: 2 },
  { name: 'Bryce Harper', hrs: 1 },
  { name: 'Mookie Betts', hrs: 4 },
  { name: 'Freddie Freeman', hrs: 2 }
].map((player, index) => ({
  id: `player_${index + 1}`,
  name: player.name,
  team: 'MLB',
  stats: { hrs: player.hrs }
}));

async function createTodayChallenge() {
  try {
    const today = new Date().toISOString().split('T')[0];
    console.log('Creating challenge for date:', today);
    
    // First, check if a challenge already exists for today
    console.log('Checking for existing challenge...');
    const { data: existingChallenge, error: checkError } = await supabase
      .from('daily_challenges')
      .select('id')
      .eq('challenge_date', today)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing challenge:', checkError);
      process.exit(1);
    }

    if (existingChallenge) {
      console.log('Challenge already exists for today:', existingChallenge);
      process.exit(0);
    }

    console.log('No existing challenge found. Creating new challenge...');
    console.log('Players:', JSON.stringify(players, null, 2));

    // Create new challenge
    const { data: newChallenge, error: insertError } = await supabase
      .from('daily_challenges')
      .insert([{
        challenge_date: today,
        rule: "Pick players with the most home runs!",
        pick_limit: 3,
        players_pool: players
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating challenge:', insertError);
      console.error('Error details:', insertError.details);
      console.error('Error hint:', insertError.hint);
      process.exit(1);
    }

    console.log('Challenge created successfully:', newChallenge);
    process.exit(0);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

createTodayChallenge();