import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the root .env.development file
const envPath = join(__dirname, '../../.env.development');
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

interface Challenge {
  title: string;
  rule: string;
  pick_limit: number;
  players_pool: {
    id: string;
    name: string;
    team: string;
    stats: {
      [key: string]: number;
    };
  }[];
}

// Add your challenges here
// See docs/challengeGuide.md for examples and instructions
const exampleChallenges: Challenge[] = [
    {
        title: "Home Run Derby (2023)",
        rule: "Pick players with the most home runs in 2023!",
        pick_limit: 3,
        players_pool: [
          { id: "player_1", name: "Aaron Judge", team: "NYY", stats: { hrs: 62 } },
          { id: "player_2", name: "Shohei Ohtani", team: "LAA", stats: { hrs: 46 } },
          { id: "player_3", name: "Matt Olson", team: "ATL", stats: { hrs: 54 } },
          { id: "player_4", name: "Mookie Betts", team: "LAD", stats: { hrs: 39 } },
          { id: "player_5", name: "Kyle Schwarber", team: "PHI", stats: { hrs: 47 } },
          { id: "player_6", name: "Pete Alonso", team: "NYM", stats: { hrs: 46 } },
          { id: "player_7", name: "Vladimir Guerrero Jr.", team: "TOR", stats: { hrs: 26 } },
          { id: "player_8", name: "Fernando Tatis Jr.", team: "SD", stats: { hrs: 25 } },
        ],
      },
      {
        title: "RBI Machine (2021)",
        rule: "Pick players with the most RBIs in 2021!",
        pick_limit: 3,
        players_pool: [
          { id: "player_1", name: "Jose Abreu", team: "CWS", stats: { rbis: 117 } },
          { id: "player_2", name: "Rafael Devers", team: "BOS", stats: { rbis: 113 } },
          { id: "player_3", name: "Vladimir Guerrero Jr.", team: "TOR", stats: { rbis: 111 } },
          { id: "player_4", name: "Matt Olson", team: "OAK", stats: { rbis: 111 } },
          { id: "player_5", name: "Aaron Judge", team: "NYY", stats: { rbis: 98 } },
          { id: "player_6", name: "Bryce Harper", team: "PHI", stats: { rbis: 84 } },
          { id: "player_7", name: "Mookie Betts", team: "LAD", stats: { rbis: 93 } },
          { id: "player_8", name: "Shohei Ohtani", team: "LAA", stats: { rbis: 100 } },
        ],
      },
      {
        title: "Stolen Base Kings (2022)",
        rule: "Pick players with the most stolen bases in 2022!",
        pick_limit: 3,
        players_pool: [
          { id: "player_1", name: "Trea Turner", team: "LAD", stats: { sb: 33 } },
          { id: "player_2", name: "Ronald Acuña Jr.", team: "ATL", stats: { sb: 29 } },
          { id: "player_3", name: "Jazz Chisholm Jr.", team: "MIA", stats: { sb: 23 } },
          { id: "player_4", name: "Bobby Witt Jr.", team: "KC", stats: { sb: 30 } },
          { id: "player_5", name: "Francisco Lindor", team: "NYM", stats: { sb: 16 } },
          { id: "player_6", name: "Myles Straw", team: "CLE", stats: { sb: 21 } },
          { id: "player_7", name: "Starling Marte", team: "NYM", stats: { sb: 18 } },
          { id: "player_8", name: "Corbin Carroll", team: "ARI", stats: { sb: 23 } },
        ],
      },
      {
        title: "Career RBI Legends",
        rule: "Pick players with the most career RBIs!",
        pick_limit: 3,
        players_pool: [
          { id: "player_1", name: "Albert Pujols", team: "MLB", stats: { rbis: 2218 } },
          { id: "player_2", name: "Miguel Cabrera", team: "DET", stats: { rbis: 1887 } },
          { id: "player_3", name: "Nelson Cruz", team: "SD", stats: { rbis: 1325 } },
          { id: "player_4", name: "Joey Votto", team: "CIN", stats: { rbis: 1100 } },
          { id: "player_5", name: "Freddie Freeman", team: "LAD", stats: { rbis: 1250 } },
          { id: "player_6", name: "Paul Goldschmidt", team: "STL", stats: { rbis: 1300 } },
          { id: "player_7", name: "Anthony Rizzo", team: "NYY", stats: { rbis: 1100 } },
          { id: "player_8", name: "Bryce Harper", team: "PHI", stats: { rbis: 900 } },
        ],
      },
      {
        title: "Single-Season HR Race (2000)",
        rule: "Pick players with the most home runs in the 2000 season!",
        pick_limit: 3,
        players_pool: [
          { id: "player_1", name: "Barry Bonds", team: "SF", stats: { hrs: 49 } },
          { id: "player_2", name: "Sammy Sosa", team: "CHC", stats: { hrs: 50 } },
          { id: "player_3", name: "Luis Gonzalez", team: "ARI", stats: { hrs: 57 } },
          { id: "player_4", name: "Mark McGwire", team: "STL", stats: { hrs: 32 } },
          { id: "player_5", name: "Ken Griffey Jr.", team: "CIN", stats: { hrs: 40 } },
          { id: "player_6", name: "Alex Rodriguez", team: "SEA", stats: { hrs: 41 } },
          { id: "player_7", name: "Jeff Bagwell", team: "HOU", stats: { hrs: 47 } },
          { id: "player_8", name: "Troy Glaus", team: "ANA", stats: { hrs: 47 } },
        ],
      },
      {
        title: "Speedsters (Career)",
        rule: "Pick players with the most career stolen bases!",
        pick_limit: 3,
        players_pool: [
          { id: "player_1", name: "Rickey Henderson", team: "MLB", stats: { sb: 1406 } },
          { id: "player_2", name: "Lou Brock", team: "MLB", stats: { sb: 938 } },
          { id: "player_3", name: "Ichiro Suzuki", team: "SEA", stats: { sb: 509 } },
          { id: "player_4", name: "Dee Strange-Gordon", team: "MLB", stats: { sb: 336 } },
          { id: "player_5", name: "Juan Pierre", team: "MLB", stats: { sb: 614 } },
          { id: "player_6", name: "Jose Reyes", team: "MLB", stats: { sb: 517 } },
          { id: "player_7", name: "Barry Bonds", team: "MLB", stats: { sb: 514 } },
          { id: "player_8", name: "Kenny Lofton", team: "MLB", stats: { sb: 622 } },
        ],
      },
];

async function publishChallenge(challengeData: Challenge, index: number) {
  try {
    console.log('Publishing challenge:', challengeData.title);
    
    // Create new challenge with incrementing date
    const date = new Date();
    date.setDate(date.getDate() + index);
    
    const { data: newChallenge, error: insertError } = await supabase
      .from('challenges')
      .insert([{
        challenge_date: date.toISOString().split('T')[0],
        rule: challengeData.rule,
        pick_limit: challengeData.pick_limit,
        players_pool: challengeData.players_pool
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating challenge:', insertError);
      console.error('Error details:', insertError.details);
      console.error('Error message:', insertError.message);
      console.error('Error hint:', insertError.hint);
      return false;
    }

    console.log('Challenge created successfully:', newChallenge);
    return true;
  } catch (err) {
    console.error('Unexpected error:', err);
    return false;
  }
}

// Publish example challenges
async function publishExampleChallenges() {
  console.log('Publishing example challenges...');
  
  for (let i = 0; i < exampleChallenges.length; i++) {
    const success = await publishChallenge(exampleChallenges[i], i);
    if (success) {
      console.log('Successfully published challenge:', exampleChallenges[i].title);
    } else {
      console.log('Failed to publish challenge:', exampleChallenges[i].title);
    }
  }
  
  process.exit(0);
}

publishExampleChallenges(); 