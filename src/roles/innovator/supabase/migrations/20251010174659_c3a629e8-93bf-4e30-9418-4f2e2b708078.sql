-- Drop the problematic RLS policies that cause infinite recursion
DROP POLICY IF EXISTS "Users can view participants in their threads" ON thread_participants;
DROP POLICY IF EXISTS "Users can view threads they participate in" ON message_threads;

-- Create a security definer function to check thread participation without recursion
CREATE OR REPLACE FUNCTION public.is_thread_participant(thread_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM thread_participants
    WHERE thread_id = thread_uuid
      AND user_id = user_uuid
  );
$$;

-- Create new RLS policies using the security definer function
CREATE POLICY "Users can view participants in their threads"
  ON thread_participants
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR
    public.is_thread_participant(thread_id, auth.uid())
  );

CREATE POLICY "Users can view threads they participate in"
  ON message_threads
  FOR SELECT
  USING (public.is_thread_participant(id, auth.uid()));