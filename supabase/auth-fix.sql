-- Grace Coloring - Auth RLS Fix
-- Run this in Supabase SQL Editor to fix auth policies
-- This allows users to read their own profile and middleware to check admin role

-- Drop existing policies that conflict
DROP POLICY IF EXISTS "Admin full access" ON public.users;
DROP POLICY IF EXISTS "Editor read access" ON public.users;

-- Users can read their own profile
CREATE POLICY "Users read own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Admin can manage all users
CREATE POLICY "Admin manage users" ON public.users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Editor can read (but not edit) users
CREATE POLICY "Editor read users" ON public.users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'editor')
  );

-- Allow authenticated users to insert their own profile (for signup)
CREATE POLICY "Users insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);
