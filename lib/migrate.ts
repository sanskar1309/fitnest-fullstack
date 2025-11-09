import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Use service role key for migration

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

interface MeditationCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  tags: string[];
  practices: MeditationPractice[];
}

interface MeditationPractice {
  id: number;
  category_id: number;
  title: string;
  difficulty: string;
  benefits: string[];
  description: string;
  steps: string[];
  affirmation: string;
  duration: string;
  environment: string;
  audio_url: string;
  video_url: string;
  tags: string[];
}

interface Mood {
  mood: string;
  description: string;
  recommended_practices: number[];
}

async function migrateData() {
  try {
    // Clear existing data to avoid duplicates
    await supabase.from('transitive_poses').delete().neq('id', 0);
    await supabase.from('categories').delete().neq('id', 0);
    await supabase.from('poses').delete().neq('id', 0);
    await supabase.from('difficulty').delete().neq('id', 0);
    await supabase.from('moods').delete().neq('id', 0);
    await supabase.from('meditation_practices').delete().neq('id', 0);
    await supabase.from('meditation_categories').delete().neq('id', 0);
    console.log('Existing meditation data cleared');

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

    // Insert meditation categories and practices from meditations.json
    const meditationsData: { categories: MeditationCategory[] } = JSON.parse(fs.readFileSync('meditations.json', 'utf8'));

    // Insert categories
    const categoriesToInsert = meditationsData.categories.map(cat => ({
      id: cat.id,
      category_name: cat.name,
      category_description: cat.description,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      tags: cat.tags
    }));
    const { error: medCatError } = await supabase.from('meditation_categories').insert(categoriesToInsert);
    if (medCatError) throw medCatError;
    console.log('Meditation categories data inserted');

    // Insert practices
    const practicesToInsert: any[] = [];
    meditationsData.categories.forEach(cat => {
      cat.practices.forEach(practice => {
        practicesToInsert.push({
          id: practice.id,
          category_id: cat.id,
          english_name: practice.title,
          practice_benefits: practice.benefits.join(', '),
          practice_description: practice.description,
          suggested_duration: practice.duration,
          title: practice.title,
          difficulty: practice.difficulty,
          benefits: practice.benefits,
          description: practice.description,
          steps: practice.steps,
          affirmation: practice.affirmation,
          duration: practice.duration,
          environment: practice.environment,
          audio_url: practice.audio_url,
          video_url: practice.video_url,
          tags: practice.tags
        });
      });
    });
    const { error: medPracError } = await supabase.from('meditation_practices').insert(practicesToInsert);
    if (medPracError) throw medPracError;
    console.log('Meditation practices data inserted');

    // Insert moods data
    const moodsData: { moods: Mood[] } = JSON.parse(fs.readFileSync('moods.json', 'utf8'));
    const moodsToInsert = moodsData.moods.map((mood, index) => ({
      id: index + 1,
      mood: mood.mood,
      description: mood.description,
      recommended_practices: mood.recommended_practices
    }));
    const { error: moodsError } = await supabase.from('moods').insert(moodsToInsert);
    if (moodsError) throw moodsError;
    console.log('Moods data inserted');

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrateData();
