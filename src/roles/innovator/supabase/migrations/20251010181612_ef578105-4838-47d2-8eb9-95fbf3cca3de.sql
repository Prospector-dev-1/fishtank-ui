-- Fix message_threads RLS policies completely

-- Drop all existing policies on message_threads
DROP POLICY IF EXISTS "Users can create message threads" ON message_threads;
DROP POLICY IF EXISTS "Users can view threads they participate in" ON message_threads;

-- Create INSERT policy that allows any authenticated user to create threads
CREATE POLICY "Allow authenticated users to create threads"
  ON message_threads
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create SELECT policy for viewing threads
CREATE POLICY "Users can view their threads"
  ON message_threads
  FOR SELECT
  TO authenticated
  USING (is_thread_participant(id, auth.uid()));