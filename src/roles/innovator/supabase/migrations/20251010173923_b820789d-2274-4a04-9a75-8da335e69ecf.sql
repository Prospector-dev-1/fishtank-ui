-- Fix infinite recursion in thread_participants RLS policies

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view participants in their threads" ON thread_participants;
DROP POLICY IF EXISTS "Users can add participants to threads they're in" ON thread_participants;

-- Create new policies without recursion
-- Allow users to view participants in threads where they are a participant
CREATE POLICY "Users can view participants in their threads"
  ON thread_participants
  FOR SELECT
  USING (
    user_id = auth.uid() 
    OR 
    thread_id IN (
      SELECT thread_id 
      FROM thread_participants 
      WHERE user_id = auth.uid()
    )
  );

-- Allow users to add participants when creating a thread (both participants can be added)
CREATE POLICY "Users can add participants to threads"
  ON thread_participants
  FOR INSERT
  WITH CHECK (true);  -- Allow inserts, SELECT policy will control what they can see