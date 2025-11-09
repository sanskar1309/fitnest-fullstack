import { supabase } from './supabase'

const baseURL = {
  base: "https://holistic-health-buddy.vercel.app/api/v1",
  categories: "https://holistic-health-buddy.vercel.app/api/v1/categories",
  "category-by-id": "https://holistic-health-buddy.vercel.app/api/v1/categories?id=value",
  "category-by-name": "https://holistic-health-buddy.vercel.app/api/v1/categories?name=value",
  "category-by-id-level": "https://holistic-health-buddy.vercel.app/api/v1/categories?id=value&level=value",
  poses: "https://holistic-health-buddy.vercel.app/api/v1/poses",
  "pose-by-id": "https://holistic-health-buddy.vercel.app/api/v1/poses?id=value",
  "pose-by-name": "https://holistic-health-buddy.vercel.app/api/v1/poses?name=value",
  "poses-by-level": "https://holistic-health-buddy.vercel.app/api/v1/poses?level=beginner",
  meditation: "https://holistic-health-buddy.vercel.app/api/v1/meditation"
}

interface Pose {
  id: number
  english_name: string
  sanskrit_name_adapted?: string
  sanskrit_name?: string
  translation_name?: string
  pose_description?: string
  pose_benefits?: string
  url_svg?: string
  url_png?: string
  url_svg_alt?: string
}

interface Category {
  id: number
  category_name: string
  category_description?: string
  poses?: Pose[]
  transitive_poses?: TransitivePose[]
}

interface TransitivePose {
  poses: Pose
  difficulty?: {
    difficulty_level: string
  }
}

interface CategoryWithTransitive extends Category {
  transitive_poses: TransitivePose[]
}

interface MeditationCategory {
  id: number
  category_name: string
  category_description: string
  practices: MeditationPractice[]
}

interface MeditationPractice {
  id: number
  english_name: string
  practice_benefits: string
  practice_description: string
  suggested_duration: string
}

export async function getBaseURL() {
  return baseURL
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select(`
      *,
      transitive_poses (
        poses!pose_id (
          id, english_name, sanskrit_name_adapted, sanskrit_name, translation_name, pose_description, pose_benefits, url_svg, url_png, url_svg_alt
        )
      )
    `)

  if (error) throw error

  // Flatten the poses
  return (data as CategoryWithTransitive[])?.map((category: CategoryWithTransitive) => ({
    ...category,
    poses: category.transitive_poses?.map((tp: TransitivePose) => tp.poses) || [],
    transitive_poses: []
  })) || []
}

export async function getCategoriesByParams(params: { id?: number; name?: string; level?: string }): Promise<Category | null> {
  const { id, name, level } = params

  if (level) {
    return getCategoriesByLevel(id, level)
  }

  let query = supabase
    .from('categories')
    .select(`
      *,
      transitive_poses (
        poses!pose_id (
          id, english_name, sanskrit_name_adapted, sanskrit_name, translation_name, pose_description, pose_benefits, url_svg, url_png, url_svg_alt
        )
      )
    `)

  if (id) query = query.eq('id', id)
  if (name) query = query.ilike('category_name', name)

  const { data, error } = await query

  if (error) throw error

  if (!data || data.length === 0) return null

  // Return the first match, flattened
  const category = data[0] as CategoryWithTransitive
  return {
    ...category,
    poses: category.transitive_poses?.map((tp: TransitivePose) => tp.poses) || [],
    transitive_poses: []
  }
}

export async function getCategoriesByLevel(id?: number, level?: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select(`
      *,
      transitive_poses!inner (
        difficulty!difficulty_id (
          difficulty_level
        ),
        poses!pose_id (
          id, english_name, sanskrit_name_adapted, sanskrit_name, translation_name, pose_description, pose_benefits, url_svg, url_png, url_svg_alt
        )
      )
    `)
    .eq('id', id)
    .eq('transitive_poses.difficulty.difficulty_level', level)

  if (error) throw error

  if (!data || data.length === 0) return null

  const category = data[0] as any
  return {
    ...category,
    poses: category.transitive_poses?.map((tp: any) => ({
      ...tp.poses,
      difficulty_level: tp.difficulty.difficulty_level
    })) || []
  }
}

export async function getPoses(): Promise<Pose[]> {
  const { data, error } = await supabase
    .from('poses')
    .select('*')
    .order('english_name', { ascending: true })

  if (error) throw error
  return (data as Pose[]) || []
}

export async function getPosesByParams(params: { id?: number; name?: string; level?: string }): Promise<Pose | Pose[] | null> {
  const { id, name, level } = params

  if (level) {
    return getPosesByLevel(level)
  }

  let query = supabase
    .from('poses')
    .select('*')

  if (id) query = query.eq('id', id)
  if (name) query = query.ilike('english_name', name)

  const { data, error } = await query

  if (error) throw error

  if (!data || data.length === 0) return null

  return data[0] as Pose
}

export async function getPosesByLevel(level: string): Promise<Pose[]> {
  const { data, error } = await supabase
    .from('poses')
    .select(`
      *,
      transitive_poses!inner (
        difficulty!difficulty_id (
          difficulty_level
        )
      )
    `)
    .eq('transitive_poses.difficulty.difficulty_level', level)

  if (error) throw error

  return (data as any[])?.map((pose: any) => ({
    ...pose,
    difficulty_level: pose.transitive_poses[0]?.difficulty.difficulty_level
  })) || []
}

export async function getMeditation(): Promise<MeditationCategory[]> {
  const { data, error } = await supabase
    .from('meditation_categories')
    .select(`
      *,
      practices: meditation_practices (*)
    `)

  if (error) throw error

  return (data as MeditationCategory[]) || []
}
