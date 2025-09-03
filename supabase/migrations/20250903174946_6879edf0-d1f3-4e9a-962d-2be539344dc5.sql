-- Add source_profile_id to track profiles from user_profiles table
ALTER TABLE custom_industry_profiles 
ADD COLUMN source_profile_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE;