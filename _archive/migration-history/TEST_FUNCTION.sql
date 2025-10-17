-- Test if the handle_new_user function has proper permissions

-- Check if function has SECURITY DEFINER
SELECT prosecdef, proname 
FROM pg_proc 
WHERE proname = 'handle_new_user';
-- Should show: prosecdef = true (t)

