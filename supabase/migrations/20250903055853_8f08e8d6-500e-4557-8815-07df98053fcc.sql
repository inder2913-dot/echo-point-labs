-- Add graphics columns to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN hardware_graphics TEXT NOT NULL DEFAULT 'Onboard',
ADD COLUMN hardware_graphics_capacity TEXT;