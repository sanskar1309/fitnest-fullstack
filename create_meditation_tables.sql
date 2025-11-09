-- Alter existing meditation_categories table to add new columns
ALTER TABLE public.meditation_categories
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Update existing rows to populate new columns from old ones (if needed)
UPDATE public.meditation_categories
SET name = category_name,
    description = category_description
WHERE name IS NULL AND category_name IS NOT NULL;

-- Make name column NOT NULL after populating it
ALTER TABLE public.meditation_categories ALTER COLUMN name SET NOT NULL;

-- Alter existing meditation_practices table to add new columns
ALTER TABLE public.meditation_practices
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS difficulty TEXT,
ADD COLUMN IF NOT EXISTS benefits TEXT[],
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS steps TEXT[],
ADD COLUMN IF NOT EXISTS affirmation TEXT,
ADD COLUMN IF NOT EXISTS duration TEXT,
ADD COLUMN IF NOT EXISTS environment TEXT,
ADD COLUMN IF NOT EXISTS audio_url TEXT,
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Update existing rows to populate new columns from old ones (if needed)
UPDATE public.meditation_practices
SET title = english_name,
    benefits = ARRAY[practice_benefits],
    description = practice_description,
    duration = suggested_duration
WHERE title IS NULL AND english_name IS NOT NULL;

-- Create moods table (new table)
CREATE TABLE IF NOT EXISTS public.moods (
    id SERIAL PRIMARY KEY,
    mood TEXT NOT NULL,
    description TEXT,
    recommended_practices INTEGER[]
);

-- Enable Row Level Security (RLS) if needed
ALTER TABLE public.meditation_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meditation_practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moods ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access on meditation_categories" ON public.meditation_categories;
DROP POLICY IF EXISTS "Allow public read access on meditation_practices" ON public.meditation_practices;
DROP POLICY IF EXISTS "Allow public read access on moods" ON public.moods;

-- Create policies for public read access (adjust as needed for your auth setup)
CREATE POLICY "Allow public read access on meditation_categories" ON public.meditation_categories
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access on meditation_practices" ON public.meditation_practices
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access on moods" ON public.moods
    FOR SELECT USING (true);

-- Temporarily disable RLS for migration (will re-enable after)
ALTER TABLE public.meditation_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.meditation_practices DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.moods DISABLE ROW LEVEL SECURITY;
