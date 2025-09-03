-- Remove excess custom profiles to have exactly 101
WITH custom_to_keep AS (
  SELECT id 
  FROM user_profiles 
  WHERE is_custom = true 
  ORDER BY created_at 
  LIMIT 101
)
DELETE FROM user_profiles 
WHERE is_custom = true 
AND id NOT IN (SELECT id FROM custom_to_keep);