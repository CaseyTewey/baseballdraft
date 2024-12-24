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

async function clearChallenges() {
  try {
    // First, get count of existing challenges
    const { count, error: countError } = await supabase
      .from('challenges')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error getting challenge count:', countError);
      process.exit(1);
    }

    console.log(`Found ${count} challenges to delete`);

    // Delete all challenges with a simple delete query
    const { error: deleteError } = await supabase
      .from('challenges')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // This will match all rows

    if (deleteError) {
      console.error('Error deleting challenges:', deleteError);
      console.error('Error details:', deleteError.details);
      console.error('Error message:', deleteError.message);
      console.error('Error hint:', deleteError.hint);
      process.exit(1);
    }

    console.log('Successfully deleted all challenges');
    process.exit(0);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

clearChallenges(); 