-- Create a function to handle thread creation with participants
CREATE OR REPLACE FUNCTION public.create_direct_message_thread(
  participant_ids uuid[]
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_thread_id uuid;
  participant_id uuid;
BEGIN
  -- Create the thread
  INSERT INTO message_threads (type)
  VALUES ('direct')
  RETURNING id INTO new_thread_id;
  
  -- Add all participants
  FOREACH participant_id IN ARRAY participant_ids
  LOOP
    INSERT INTO thread_participants (thread_id, user_id)
    VALUES (new_thread_id, participant_id);
  END LOOP;
  
  RETURN new_thread_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_direct_message_thread(uuid[]) TO authenticated;