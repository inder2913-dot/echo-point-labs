-- Update RLS policy to ensure custom profiles are only visible to their creators
-- while baseline profiles remain visible to everyone

DROP POLICY IF EXISTS "Users can view all profiles" ON public.user_profiles;

CREATE POLICY "Users can view baseline profiles and their own custom profiles" 
ON public.user_profiles 
FOR SELECT 
USING (
  is_custom = false OR (is_custom = true AND user_id = auth.uid())
);