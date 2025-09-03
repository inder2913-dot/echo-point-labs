-- Keep only 1 custom profile (the original one)
WITH original_custom AS (
  SELECT id 
  FROM user_profiles 
  WHERE is_custom = true 
  ORDER BY created_at 
  LIMIT 1
)
DELETE FROM user_profiles 
WHERE is_custom = true 
AND id NOT IN (SELECT id FROM original_custom);