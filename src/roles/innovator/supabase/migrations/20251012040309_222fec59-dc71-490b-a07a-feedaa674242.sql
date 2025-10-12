-- Drop the old check constraint on team_members role
ALTER TABLE public.team_members DROP CONSTRAINT IF EXISTS team_members_role_check;

-- Add a new check constraint allowing business roles
ALTER TABLE public.team_members 
ADD CONSTRAINT team_members_role_check 
CHECK (role = ANY (ARRAY[
  'CEO'::text,
  'CTO'::text, 
  'CFO'::text,
  'COO'::text,
  'CMO'::text,
  'Lead Developer'::text,
  'Product Manager'::text,
  'Designer'::text,
  'Marketing Manager'::text,
  'Other'::text,
  'owner'::text,
  'admin'::text,
  'member'::text
]));