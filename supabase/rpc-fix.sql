-- Create RPC function to bypass RLS for admin profile creation
-- Run this in Supabase SQL Editor

CREATE OR REPLACE FUNCTION public.create_admin_profile(
  user_id UUID,
  user_email TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, membership)
  VALUES (user_id, user_email, 'Admin', 'admin', 'premium')
  ON CONFLICT (id) DO NOTHING;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_admin_profile(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_admin_profile(UUID, TEXT) TO anon;
