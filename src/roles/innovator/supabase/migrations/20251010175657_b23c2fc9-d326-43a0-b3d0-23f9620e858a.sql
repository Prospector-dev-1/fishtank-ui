-- Fix the INSERT policy for message_threads to allow authenticated users to create threads

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can create message threads" ON message_threads;

-- Create a new INSERT policy that allows any authenticated user to create threads
CREATE POLICY "Users can create message threads"
  ON message_threads
  FOR INSERT
  TO authenticated
  WITH CHECK (true);