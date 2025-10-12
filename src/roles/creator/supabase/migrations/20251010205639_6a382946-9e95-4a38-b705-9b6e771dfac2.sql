-- Allow authenticated users to insert new skills
CREATE POLICY "Authenticated users can insert skills"
ON public.skills
FOR INSERT
TO authenticated
WITH CHECK (true);