-- Create a development user profile that can be used for bypass authentication
-- Using a proper UUID format for the dev user

-- Generate a consistent UUID for the dev user (this will always be the same)
-- Using a deterministic UUID based on the string 'dev-user-123'
-- UUID: 12345678-1234-5678-9012-123456789012

-- First, let's create a profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  email TEXT,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table (drop first if they exist)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;  
CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Insert the development user profile with proper UUID
INSERT INTO public.profiles (user_id, email, display_name) 
VALUES ('12345678-1234-5678-9012-123456789012', 'dev@example.com', 'Development User')
ON CONFLICT (user_id) DO UPDATE SET 
  email = EXCLUDED.email,
  display_name = EXCLUDED.display_name,
  updated_at = now();

-- Add development bypass policies for all tables that use RLS
-- Projects table
DROP POLICY IF EXISTS "Development bypass for projects" ON public.projects;
CREATE POLICY "Development bypass for projects" 
ON public.projects 
FOR ALL 
USING (user_id = '12345678-1234-5678-9012-123456789012'::uuid)
WITH CHECK (user_id = '12345678-1234-5678-9012-123456789012'::uuid);

-- Project data table  
DROP POLICY IF EXISTS "Development bypass for project_data" ON public.project_data;
CREATE POLICY "Development bypass for project_data"
ON public.project_data
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = project_data.project_id 
  AND projects.user_id = '12345678-1234-5678-9012-123456789012'::uuid
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = project_data.project_id 
  AND projects.user_id = '12345678-1234-5678-9012-123456789012'::uuid
));

-- User profiles table
DROP POLICY IF EXISTS "Development bypass for user_profiles" ON public.user_profiles;
CREATE POLICY "Development bypass for user_profiles"
ON public.user_profiles
FOR ALL  
USING (user_id = '12345678-1234-5678-9012-123456789012'::uuid)
WITH CHECK (user_id = '12345678-1234-5678-9012-123456789012'::uuid);

-- Custom industries table
DROP POLICY IF EXISTS "Development bypass for custom_industries" ON public.custom_industries;
CREATE POLICY "Development bypass for custom_industries"
ON public.custom_industries
FOR ALL
USING (user_id = '12345678-1234-5678-9012-123456789012'::uuid) 
WITH CHECK (user_id = '12345678-1234-5678-9012-123456789012'::uuid);

-- Custom industry profiles table
DROP POLICY IF EXISTS "Development bypass for custom_industry_profiles" ON public.custom_industry_profiles;
CREATE POLICY "Development bypass for custom_industry_profiles"
ON public.custom_industry_profiles
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.custom_industries
  WHERE custom_industries.id = custom_industry_profiles.custom_industry_id
  AND custom_industries.user_id = '12345678-1234-5678-9012-123456789012'::uuid
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.custom_industries
  WHERE custom_industries.id = custom_industry_profiles.custom_industry_id
  AND custom_industries.user_id = '12345678-1234-5678-9012-123456789012'::uuid
));