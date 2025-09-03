-- Update RLS policy to allow users to view all profiles for baseline management
DROP POLICY "Users can view their own profiles" ON public.user_profiles;

-- Create new policy that allows viewing all profiles
CREATE POLICY "Users can view all profiles" 
ON public.user_profiles 
FOR SELECT 
USING (true);

-- Keep other policies restrictive for data security
-- Users can still only create/update/delete their own profiles