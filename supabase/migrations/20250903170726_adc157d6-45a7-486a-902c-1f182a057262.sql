-- Add baseline reference to user_profiles for custom profiles
ALTER TABLE public.user_profiles 
ADD COLUMN baseline_id UUID REFERENCES public.user_profiles(id);

-- Add index for better performance when querying by baseline_id
CREATE INDEX idx_user_profiles_baseline_id ON public.user_profiles(baseline_id);

-- Update the existing RLS policy description for clarity
COMMENT ON POLICY "Users can view baseline profiles and their own custom profiles" ON public.user_profiles IS 
'Allows users to view baseline profiles (is_custom=false) and their own custom profiles (is_custom=true). Custom profiles can reference baseline profiles via baseline_id.';