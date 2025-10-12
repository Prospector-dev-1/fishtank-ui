-- Grant explicit permissions and recreate policies for message_threads

-- Grant necessary permissions to authenticated role
GRANT ALL ON message_threads TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Drop and recreate policies with explicit role targeting
DROP POLICY IF EXISTS "Allow authenticated users to create threads" ON message_threads;
DROP POLICY IF EXISTS "Users can view their threads" ON message_threads;

-- Create explicit INSERT policy for authenticated users
CREATE POLICY "authenticated_insert_threads"
  ON message_threads
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create explicit SELECT policy
CREATE POLICY "authenticated_select_threads"
  ON message_threads
  FOR SELECT
  TO authenticated
  USING (is_thread_participant(id, auth.uid()));

-- Also ensure thread_participants has proper permissions
GRANT ALL ON thread_participants TO authenticated;