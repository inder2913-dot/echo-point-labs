-- Add profiles with 2GB and 4GB RAM configurations
INSERT INTO public.user_profiles (
  user_id, role, department, level, industry, 
  hardware_cpu, hardware_ram, hardware_storage, hardware_graphics, hardware_graphics_capacity,
  description, is_custom
) VALUES 
-- 2GB RAM profiles (basic/legacy systems)
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Basic Data Entry Clerk', 'Administration', 'Junior', 'Government', 'Core i3', '2GB', '128GB SSD', 'Onboard', '1GB', 'Basic data entry with minimal requirements', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Legacy System Operator', 'Operations', 'Junior', 'Manufacturing', 'Core i3', '2GB', '256GB SSD', 'Onboard', '1GB', 'Legacy system operator with minimal specs', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Basic Reception', 'Administration', 'Junior', 'Healthcare', 'Core i3', '2GB', '128GB SSD', 'Onboard', '1GB', 'Reception desk with basic computing needs', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Kiosk Terminal Operator', 'Operations', 'Junior', 'Retail', 'Core i3', '2GB', '128GB SSD', 'Onboard', '1GB', 'Kiosk terminal operator', false),

-- 4GB RAM profiles (entry-level systems)
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Entry Level Assistant', 'Administration', 'Junior', 'Education', 'Core i3', '4GB', '256GB SSD', 'Onboard', '1GB', 'Entry level administrative assistant', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Basic Clerk', 'Administration', 'Junior', 'Government', 'Core i3', '4GB', '256GB SSD', 'Onboard', '1GB', 'Basic clerical work', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Call Center Agent', 'Support', 'Junior', 'Technology', 'Core i3', '4GB', '256GB SSD', 'Onboard', '1GB', 'Call center customer support', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Simple POS Operator', 'Operations', 'Junior', 'Retail', 'Core i3', '4GB', '256GB SSD', 'Onboard', '1GB', 'Point of sale system operator', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Basic Inventory Clerk', 'Operations', 'Junior', 'Manufacturing', 'Core i3', '4GB', '256GB SSD', 'Onboard', '1GB', 'Basic inventory management', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Document Scanner', 'Administration', 'Junior', 'Financial Services', 'Core i3', '4GB', '256GB SSD', 'Onboard', '1GB', 'Document scanning and filing', false);