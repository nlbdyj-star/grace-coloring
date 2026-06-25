-- 赋予 newmichael359@gmail.com 管理员权限

INSERT INTO public.users (id, email, full_name, role, membership, downloads_today)
VALUES (
  'b7f06804-7a92-4a1e-b87b-bf16d35098e5',
  'newmichael359@gmail.com',
  'Admin',
  'admin',
  'premium',
  0
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  membership = 'premium',
  full_name = 'Admin';
