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
  transitive_poses?: any[]
}

interface MeditationCategory {
  id: number
  name: string
  slug: string
  description: string
  tags: string[]
  practices: MeditationPractice[]
}

interface MeditationPractice {
  id: number
  title: string
  difficulty: string
  benefits: string[]
  description: string
  steps: string[]
  affirmation: string
  duration: string
  environment: string
  audio_url: string
  video_url: string
  tags: string[]
}

interface Mood {
  id: number
  mood: string
  description: string
  recommended_practices: number[]
}

export async function getBaseURL() {
  return baseURL
}

export async function getCategories(): Promise<Category[]> {
  const [{ data: categories, error: catError }, { data: transitivePoses, error: tpError }, { data: poses, error: posesError }] = await Promise.all([
    supabase.from('categories').select('*').order('id', { ascending: true }),
    supabase.from('transitive_poses').select('category_id, pose_id'),
    supabase.from('poses').select('id, english_name, sanskrit_name_adapted, sanskrit_name, translation_name, pose_description, pose_benefits, url_svg, url_png, url_svg_alt'),
  ])

  if (catError) throw catError
  if (tpError) throw tpError
  if (posesError) throw posesError

  const posesMap = new Map<number, Pose>((poses as Pose[]).map(p => [p.id, p]))

  return (categories as Category[]).map(category => ({
    ...category,
    poses: (transitivePoses as any[])
      .filter(tp => tp.category_id === category.id)
      .map(tp => posesMap.get(tp.pose_id))
      .filter(Boolean) as Pose[],
    transitive_poses: []
  }))
}

export async function getCategoriesByParams(params: { id?: string | number; name?: string; level?: string }): Promise<Category | null> {
  const { id, name, level } = params

  if (level) {
    return getCategoriesByLevel(id, level)
  }

  let query = supabase.from('categories').select('*')
  if (id) query = query.eq('id', id)
  if (name) query = query.ilike('category_name', name)

  const { data: categories, error: catError } = await query
  if (catError) throw catError
  if (!categories || categories.length === 0) return null

  const category = categories[0] as Category

  const [{ data: transitivePoses, error: tpError }, { data: poses, error: posesError }] = await Promise.all([
    supabase.from('transitive_poses').select('pose_id').eq('category_id', category.id),
    supabase.from('poses').select('id, english_name, sanskrit_name_adapted, sanskrit_name, translation_name, pose_description, pose_benefits, url_svg, url_png, url_svg_alt'),
  ])

  if (tpError) throw tpError
  if (posesError) throw posesError

  const poseIds = new Set((transitivePoses as any[]).map(tp => tp.pose_id))
  const filteredPoses = (poses as Pose[]).filter(p => poseIds.has(p.id))

  return {
    ...category,
    poses: filteredPoses,
    transitive_poses: []
  }
}

export async function getCategoriesByLevel(id?: string | number, level?: string): Promise<Category | null> {
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)

  if (catError) throw catError
  if (!categories || categories.length === 0) return null

  const category = categories[0] as Category

  const { data: transitivePoses, error: tpError } = await supabase
    .from('transitive_poses')
    .select('pose_id, difficulty_id')
    .eq('category_id', category.id)

  if (tpError) throw tpError

  const poseIds = (transitivePoses as any[]).map(tp => tp.pose_id)

  if (poseIds.length === 0) return { ...category, poses: [], transitive_poses: [] }

  let posesQuery = supabase
    .from('poses')
    .select('id, english_name, sanskrit_name_adapted, sanskrit_name, translation_name, pose_description, pose_benefits, url_svg, url_png, url_svg_alt')
    .in('id', poseIds)

  if (level) {
    const { data: difficultyData } = await supabase
      .from('difficulty')
      .select('id')
      .eq('difficulty_level', level)
      .single()

    if (difficultyData) {
      const filteredPoseIds = (transitivePoses as any[])
        .filter(tp => tp.difficulty_id === (difficultyData as any).id)
        .map(tp => tp.pose_id)

      if (filteredPoseIds.length === 0) return { ...category, poses: [], transitive_poses: [] }

      posesQuery = supabase
        .from('poses')
        .select('id, english_name, sanskrit_name_adapted, sanskrit_name, translation_name, pose_description, pose_benefits, url_svg, url_png, url_svg_alt')
        .in('id', filteredPoseIds)
    }
  }

  const { data: poses, error: posesError } = await posesQuery
  if (posesError) throw posesError

  return {
    ...category,
    poses: (poses as Pose[]) || [],
    transitive_poses: []
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

  let query = supabase.from('poses').select('*')
  if (id) query = query.eq('id', id)
  if (name) query = query.ilike('english_name', name)

  const { data, error } = await query
  if (error) throw error
  if (!data || data.length === 0) return null

  return data[0] as Pose
}

export async function getPosesByLevel(level: string): Promise<Pose[]> {
  const { data: difficultyData, error: diffError } = await supabase
    .from('difficulty')
    .select('id')
    .eq('difficulty_level', level)
    .single()

  if (diffError) throw diffError
  if (!difficultyData) return []

  const { data: transitivePoses, error: tpError } = await supabase
    .from('transitive_poses')
    .select('pose_id')
    .eq('difficulty_id', (difficultyData as any).id)

  if (tpError) throw tpError
  if (!transitivePoses || transitivePoses.length === 0) return []

  const poseIds = (transitivePoses as any[]).map(tp => tp.pose_id)

  const { data: poses, error: posesError } = await supabase
    .from('poses')
    .select('*')
    .in('id', poseIds)

  if (posesError) throw posesError

  return (poses as Pose[]) || []
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

export async function getMoods(): Promise<Mood[]> {
  const { data, error } = await supabase
    .from('moods')
    .select('*')

  if (error) throw error

  return (data as Mood[]) || []
}
