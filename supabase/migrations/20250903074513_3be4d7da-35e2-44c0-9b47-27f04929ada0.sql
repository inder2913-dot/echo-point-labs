-- Add profiles with AMD and Apple Silicon processors for more diversity
INSERT INTO public.user_profiles (
  user_id, role, department, level, industry, 
  hardware_cpu, hardware_ram, hardware_storage, hardware_graphics, hardware_graphics_capacity,
  description, is_custom
) VALUES 
-- AMD Ryzen profiles
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'AMD Software Engineer', 'Engineering', 'Mid-Level', 'Technology', 'AMD Ryzen 5', '16GB', '512GB SSD', 'Dedicated', '4GB', 'Software Engineer with AMD setup', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'AMD Senior Developer', 'Engineering', 'Senior', 'Technology', 'AMD Ryzen 7', '32GB', '1TB SSD', 'Dedicated', '8GB', 'Senior Developer with AMD Ryzen 7', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'AMD Data Scientist', 'Data Science', 'Senior', 'Technology', 'AMD Ryzen 9', '64GB', '2TB SSD', 'Dedicated', '16GB', 'Data Scientist with AMD Ryzen 9', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'AMD Game Developer', 'Engineering', 'Mid-Level', 'Gaming', 'AMD Ryzen 7', '32GB', '1TB SSD', 'Dedicated', '12GB', 'Game Developer with AMD setup', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'AMD Graphics Designer', 'Creative', 'Mid-Level', 'Media', 'AMD Ryzen 7', '32GB', '1TB SSD', 'Dedicated', '16GB', 'Graphics Designer with AMD setup', false),

-- Apple Silicon (Mac) profiles  
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Mac iOS Developer', 'Engineering', 'Mid-Level', 'Technology', 'Apple M1', '16GB', '512GB SSD', 'Integrated', '8GB', 'iOS Developer with Apple M1', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Mac Senior iOS Developer', 'Engineering', 'Senior', 'Technology', 'Apple M2', '32GB', '1TB SSD', 'Integrated', '10GB', 'Senior iOS Developer with Apple M2', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Mac Creative Director', 'Creative', 'Management', 'Media', 'Apple M2 Pro', '32GB', '1TB SSD', 'Integrated', '16GB', 'Creative Director with Apple M2 Pro', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Mac Video Editor', 'Creative', 'Mid-Level', 'Media', 'Apple M2 Max', '64GB', '2TB SSD', 'Integrated', '32GB', 'Video Editor with Apple M2 Max', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Mac UX Designer', 'Design', 'Mid-Level', 'Technology', 'Apple M1', '16GB', '512GB SSD', 'Integrated', '8GB', 'UX Designer with Apple M1', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Mac Mobile App Developer', 'Engineering', 'Mid-Level', 'Technology', 'Apple M2', '16GB', '512GB SSD', 'Integrated', '10GB', 'Mobile App Developer with Apple M2', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Mac Music Producer', 'Creative', 'Mid-Level', 'Media', 'Apple M1 Pro', '32GB', '1TB SSD', 'Integrated', '16GB', 'Music Producer with Apple M1 Pro', false),

-- Mixed AMD profiles for different departments
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'AMD Budget Analyst', 'Finance', 'Mid-Level', 'Technology', 'AMD Ryzen 5', '16GB', '256GB SSD', 'Onboard', '2GB', 'Budget Analyst with AMD setup', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'AMD Marketing Specialist', 'Marketing', 'Mid-Level', 'Technology', 'AMD Ryzen 5', '16GB', '512GB SSD', 'Onboard', '2GB', 'Marketing Specialist with AMD setup', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'AMD Sales Manager', 'Sales', 'Management', 'Technology', 'AMD Ryzen 7', '16GB', '512GB SSD', 'Onboard', '2GB', 'Sales Manager with AMD setup', false);