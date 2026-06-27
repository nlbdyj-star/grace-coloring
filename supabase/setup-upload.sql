-- ============================================
-- 上传功能必需的 Supabase 配置
-- 请在 Supabase Dashboard → SQL Editor 中运行此脚本
-- ============================================

-- 1. 创建 Storage Bucket "media"（用于存储上传的图片和视频）
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. 允许匿名用户上传文件到 media bucket
-- 注意：这是为了方便后台管理。由于后台使用独立的 cookie 认证，
-- Supabase 无法识别管理员身份，所以使用匿名策略。
DROP POLICY IF EXISTS "Allow anon uploads to media" ON storage.objects;
CREATE POLICY "Allow anon uploads to media"
  ON storage.objects
  FOR ALL
  TO anon
  USING (bucket_id = 'media')
  WITH CHECK (bucket_id = 'media');

-- 3. 允许匿名用户读取 media bucket 中的文件
DROP POLICY IF EXISTS "Allow anon reads from media" ON storage.objects;
CREATE POLICY "Allow anon reads from media"
  ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'media');

-- 4. 为数据库表添加允许匿名 INSERT/UPDATE/DELETE 的 RLS 策略
-- 这允许后台管理面板直接向数据库添加内容

-- Videos 表
ALTER TABLE IF EXISTS public.videos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon all on videos" ON public.videos;
CREATE POLICY "Allow anon all on videos"
  ON public.videos
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Coloring Pages 表
ALTER TABLE IF EXISTS public.coloring_pages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon all on coloring_pages" ON public.coloring_pages;
CREATE POLICY "Allow anon all on coloring_pages"
  ON public.coloring_pages
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Wallpapers 表
ALTER TABLE IF EXISTS public.wallpapers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon all on wallpapers" ON public.wallpapers;
CREATE POLICY "Allow anon all on wallpapers"
  ON public.wallpapers
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Bible Stories 表
ALTER TABLE IF EXISTS public.bible_stories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon all on bible_stories" ON public.bible_stories;
CREATE POLICY "Allow anon all on bible_stories"
  ON public.bible_stories
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Categories 表
ALTER TABLE IF EXISTS public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon all on categories" ON public.categories;
CREATE POLICY "Allow anon all on categories"
  ON public.categories
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Downloads 表（只读 + 插入，不允许删除/修改）
ALTER TABLE IF EXISTS public.downloads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon all on downloads" ON public.downloads;
CREATE POLICY "Allow anon all on downloads"
  ON public.downloads
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Users 表（只读，不允许修改）
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon select on users" ON public.users;
CREATE POLICY "Allow anon select on users"
  ON public.users
  FOR SELECT
  TO anon
  USING (true);

-- Newsletter 表
ALTER TABLE IF EXISTS public.newsletter ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon all on newsletter" ON public.newsletter;
CREATE POLICY "Allow anon all on newsletter"
  ON public.newsletter
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);
