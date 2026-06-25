-- ============================================
-- 创建管理员账号
-- 邮箱: admin@gracecoloring.com
-- 密码: GraceAdmin2024!
-- ============================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  new_id UUID;
BEGIN
  -- 检查 auth 用户是否已存在
  SELECT id INTO new_id FROM auth.users WHERE email = 'admin@gracecoloring.com';

  -- 不存在则创建
  IF new_id IS NULL THEN
    new_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data
    ) VALUES (
      new_id,
      'admin@gracecoloring.com',
      crypt('GraceAdmin2024!', gen_salt('bf', 10)),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Admin"}'::jsonb
    );
  END IF;

  -- 创建/更新 public.users 档案
  INSERT INTO public.users (id, email, full_name, role, membership, downloads_today)
  VALUES (new_id, 'admin@gracecoloring.com', 'Admin', 'admin', 'premium', 0)
  ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    membership = 'premium',
    full_name = 'Admin';
END $$;
