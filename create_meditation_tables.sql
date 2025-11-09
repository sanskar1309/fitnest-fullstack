-- Create meditation_categories table
CREATE TABLE IF NOT EXISTS public.meditation_categories (
    id SERIAL PRIMARY KEY,
    category_name TEXT NOT NULL,
    category_description TEXT
);

-- Create meditation_practices table
CREATE TABLE IF NOT EXISTS public.meditation_practices (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES public.meditation_categories(id) ON DELETE CASCADE,
    english_name TEXT NOT NULL,
    practice_benefits TEXT,
    practice_description TEXT,
    suggested_duration TEXT
);

-- Enable Row Level Security (RLS) if needed
ALTER TABLE public.meditation_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meditation_practices ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (adjust as needed for your auth setup)
CREATE POLICY "Allow public read access on meditation_categories" ON public.meditation_categories
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access on meditation_practices" ON public.meditation_practices
    FOR SELECT USING (true);

-- Temporarily disable RLS for migration (will re-enable after)
ALTER TABLE public.meditation_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.meditation_practices DISABLE ROW LEVEL SECURITY;
