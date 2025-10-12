-- Fix message_threads INSERT policy to properly check authentication

DROP POLICY IF EXISTS "Users can create message threads" ON message_threads;

CREATE POLICY "Users can create message threads"
  ON message_threads
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);