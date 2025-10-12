-- Remove the restrictive check constraint on team_members.role
ALTER TABLE team_members DROP CONSTRAINT IF EXISTS team_members_role_check;