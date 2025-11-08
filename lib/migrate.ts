import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for inserts

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

interface Difficulty {
  id: number;
  name: string;
  [key: string]: any;
}

interface Pose {
  id: number;
  name: string;
  [key: string]: any;
}

interface Category {
  id: number;
  name: string;
  [key: string]: any;
}

interface TransitivePose {
  id: number;
  pose_id: number;
  related_pose_id: number;
  [key: string]: any;
}

async function migrateData() {
  try {
    // Clear existing data to avoid duplicates
    await supabase.from('transitive_poses').delete().neq('id', 0);
    await supabase.from('categories').delete().neq('id', 0);
    await supabase.from('poses').delete().neq('id', 0);
    await supabase.from('difficulty').delete().neq('id', 0);
    console.log('Existing data cleared');

    // Insert difficulty levels first
    const difficultyData: Difficulty[] = JSON.parse(fs.readFileSync('difficulty.json', 'utf8'));
    const { error: diffError } = await supabase.from('difficulty').insert(difficultyData);
    if (diffError) throw diffError;
    console.log('Difficulty data inserted');

    // Insert poses
    const posesData: Pose[] = JSON.parse(fs.readFileSync('poses.json', 'utf8'));
    const { error: posesError } = await supabase.from('poses').insert(posesData);
    if (posesError) throw posesError;
    console.log('Poses data inserted');

    // Insert categories
    const categoriesData: Category[] = JSON.parse(fs.readFileSync('categories.json', 'utf8'));
    const { error: catError } = await supabase.from('categories').insert(categoriesData);
    if (catError) throw catError;
    console.log('Categories data inserted');

    // Insert transitive_poses
    const transitiveData: TransitivePose[] = JSON.parse(fs.readFileSync('transitive_poses.json', 'utf8'));
    const { error: transError } = await supabase.from('transitive_poses').insert(transitiveData);
    if (transError) throw transError;
    console.log('Transitive poses data inserted');

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrateData();
