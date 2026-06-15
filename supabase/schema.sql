-- Grace Coloring - Supabase Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'editor', 'user')),
  membership TEXT NOT NULL DEFAULT 'free' CHECK (membership IN ('free', 'premium')),
  downloads_today INTEGER NOT NULL DEFAULT 0,
  downloads_reset_at TIMESTAMPTZ,
  is_banned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'all' CHECK (type IN ('video', 'coloring', 'wallpaper', 'story', 'all')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- VIDEOS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  thumbnail TEXT NOT NULL,
  video_url TEXT NOT NULL,
  youtube_url TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  description TEXT,
  bible_verse TEXT,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[] DEFAULT '{}',
  duration TEXT,
  views INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- ============================================
-- COLORING PAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.coloring_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  bible_character TEXT,
  story TEXT,
  tags TEXT[] DEFAULT '{}',
  line_art_image TEXT NOT NULL,
  colored_preview_image TEXT NOT NULL,
  pdf_file TEXT,
  difficulty TEXT NOT NULL DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  downloads_count INTEGER NOT NULL DEFAULT 0,
  views_count INTEGER NOT NULL DEFAULT 0,
  favorites_count INTEGER NOT NULL DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- WALLPAPERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.wallpapers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  image_original TEXT NOT NULL,
  image_mobile TEXT NOT NULL,
  image_desktop TEXT NOT NULL,
  image_4k TEXT,
  image_8k TEXT,
  tags TEXT[] DEFAULT '{}',
  downloads_count INTEGER NOT NULL DEFAULT 0,
  views_count INTEGER NOT NULL DEFAULT 0,
  favorites_count INTEGER NOT NULL DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- BIBLE STORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.bible_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  hero_image TEXT,
  content TEXT NOT NULL DEFAULT '',
  bible_verse TEXT,
  bible_reference TEXT,
  related_coloring_pages UUID[] DEFAULT '{}',
  related_videos UUID[] DEFAULT '{}',
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- ============================================
-- DOWNLOADS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('coloring', 'wallpaper', 'video', 'pdf')),
  content_id UUID NOT NULL,
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- FAVORITES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('coloring', 'wallpaper', 'video')),
  content_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, content_type, content_id)
);

-- ============================================
-- NEWSLETTER TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.newsletter (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  subscribed BOOLEAN NOT NULL DEFAULT true,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- MEDIA LIBRARY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.media_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'pdf', 'video')),
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  tags TEXT[] DEFAULT '{}',
  uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- SITE SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  group_name TEXT NOT NULL DEFAULT 'general',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_videos_status ON public.videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_category ON public.videos(category_id);
CREATE INDEX IF NOT EXISTS idx_videos_created ON public.videos(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_coloring_status ON public.coloring_pages(status);
CREATE INDEX IF NOT EXISTS idx_coloring_category ON public.coloring_pages(category_id);
CREATE INDEX IF NOT EXISTS idx_coloring_created ON public.coloring_pages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coloring_difficulty ON public.coloring_pages(difficulty);

CREATE INDEX IF NOT EXISTS idx_wallpapers_status ON public.wallpapers(status);
CREATE INDEX IF NOT EXISTS idx_wallpapers_category ON public.wallpapers(category_id);
CREATE INDEX IF NOT EXISTS idx_wallpapers_created ON public.wallpapers(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_stories_status ON public.bible_stories(status);
CREATE INDEX IF NOT EXISTS idx_stories_category ON public.bible_stories(category_id);
CREATE INDEX IF NOT EXISTS idx_stories_created ON public.bible_stories(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_downloads_user ON public.downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_content ON public.downloads(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_downloads_created ON public.downloads(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_media_type ON public.media_library(file_type);
CREATE INDEX IF NOT EXISTS idx_media_created ON public.media_library(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coloring_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallpapers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bible_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Admin/Editor can read all tables
CREATE POLICY "Admin full access" ON public.users FOR ALL USING (auth.uid() IN (
  SELECT id FROM public.users WHERE role = 'admin'
));
CREATE POLICY "Editor read access" ON public.users FOR SELECT USING (auth.uid() IN (
  SELECT id FROM public.users WHERE role IN ('admin', 'editor')
));

-- Public tables (readable by everyone when published)
CREATE POLICY "Published videos visible" ON public.videos FOR SELECT USING (status = 'published');
CREATE POLICY "Published coloring visible" ON public.coloring_pages FOR SELECT USING (status = 'published');
CREATE POLICY "Published wallpapers visible" ON public.wallpapers FOR SELECT USING (status = 'published');
CREATE POLICY "Published stories visible" ON public.bible_stories FOR SELECT USING (status = 'published');
CREATE POLICY "Categories visible" ON public.categories FOR SELECT USING (true);

-- Admin/Editor can manage content
CREATE POLICY "Admin manage videos" ON public.videos FOR ALL USING (auth.uid() IN (
  SELECT id FROM public.users WHERE role IN ('admin', 'editor')
));
CREATE POLICY "Admin manage coloring" ON public.coloring_pages FOR ALL USING (auth.uid() IN (
  SELECT id FROM public.users WHERE role IN ('admin', 'editor')
));
CREATE POLICY "Admin manage wallpapers" ON public.wallpapers FOR ALL USING (auth.uid() IN (
  SELECT id FROM public.users WHERE role IN ('admin', 'editor')
));
CREATE POLICY "Admin manage stories" ON public.bible_stories FOR ALL USING (auth.uid() IN (
  SELECT id FROM public.users WHERE role IN ('admin', 'editor')
));
CREATE POLICY "Admin manage categories" ON public.categories FOR ALL USING (auth.uid() IN (
  SELECT id FROM public.users WHERE role IN ('admin', 'editor')
));
CREATE POLICY "Admin manage media" ON public.media_library FOR ALL USING (auth.uid() IN (
  SELECT id FROM public.users WHERE role IN ('admin', 'editor')
));
CREATE POLICY "Admin manage settings" ON public.site_settings FOR ALL USING (auth.uid() IN (
  SELECT id FROM public.users WHERE role = 'admin'
));
CREATE POLICY "Admin manage newsletter" ON public.newsletter FOR ALL USING (auth.uid() IN (
  SELECT id FROM public.users WHERE role IN ('admin', 'editor')
));
CREATE POLICY "Admin manage downloads" ON public.downloads FOR ALL USING (auth.uid() IN (
  SELECT id FROM public.users WHERE role IN ('admin', 'editor')
));

-- Users can manage their own data
CREATE POLICY "Users own favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own downloads" ON public.downloads FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON public.videos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_coloring_updated_at BEFORE UPDATE ON public.coloring_pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_wallpapers_updated_at BEFORE UPDATE ON public.wallpapers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON public.bible_stories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, role, membership)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    'free'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SEED DATA
-- ============================================
INSERT INTO public.categories (name, slug, description, type, sort_order) VALUES
  ('Jesus', 'jesus', 'Stories and coloring pages about Jesus', 'all', 1),
  ('Noah''s Ark', 'noahs-ark', 'The story of Noah and the great flood', 'all', 2),
  ('Moses', 'moses', 'The story of Moses and the Exodus', 'all', 3),
  ('David', 'david', 'The story of King David', 'all', 4),
  ('Miracles', 'miracles', 'Biblical miracles and wonders', 'all', 5),
  ('Easter', 'easter', 'Easter and resurrection stories', 'all', 6),
  ('Christmas', 'christmas', 'Christmas and nativity stories', 'all', 7),
  ('Angels', 'angels', 'Stories about angels', 'all', 8),
  ('Parables', 'parables', 'Parables of Jesus', 'all', 9)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.site_settings (key, value, group_name) VALUES
  ('site_name', 'Grace Coloring', 'general'),
  ('site_description', 'Find Peace Through Creativity', 'general'),
  ('google_analytics', '', 'analytics'),
  ('google_search_console', '', 'analytics'),
  ('facebook_pixel', '', 'analytics'),
  ('mailchimp_api_key', '', 'email'),
  ('convertkit_api_key', '', 'email'),
  ('brevo_api_key', '', 'email')
ON CONFLICT (key) DO NOTHING;
