-- Create baseline user profiles for different roles and departments
INSERT INTO public.user_profiles (
  user_id, role, department, level, industry, 
  hardware_cpu, hardware_ram, hardware_storage, hardware_graphics, hardware_graphics_capacity,
  description, is_custom
) VALUES 
-- Executive Level Profiles
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'CEO', 'Executive', 'Executive', 'Technology', 'Core i7', '16GB', '512GB SSD', 'Dedicated', '4GB', 'Chief Executive Officer baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'CTO', 'Executive', 'Executive', 'Technology', 'Core i9', '32GB', '1TB SSD', 'Dedicated', '8GB', 'Chief Technology Officer baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'CFO', 'Executive', 'Executive', 'Technology', 'Core i7', '16GB', '512GB SSD', 'Dedicated', '4GB', 'Chief Financial Officer baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'VP Engineering', 'Engineering', 'Executive', 'Technology', 'Core i9', '32GB', '1TB SSD', 'Dedicated', '8GB', 'VP Engineering baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'VP Sales', 'Sales', 'Executive', 'Technology', 'Core i7', '16GB', '512GB SSD', 'Dedicated', '4GB', 'VP Sales baseline', false),

-- Management Level Profiles
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Engineering Manager', 'Engineering', 'Management', 'Technology', 'Core i7', '16GB', '512GB SSD', 'Dedicated', '4GB', 'Engineering Manager baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Product Manager', 'Product', 'Management', 'Technology', 'Core i7', '16GB', '512GB SSD', 'Dedicated', '4GB', 'Product Manager baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Sales Manager', 'Sales', 'Management', 'Technology', 'Core i5', '16GB', '256GB SSD', 'Onboard', '2GB', 'Sales Manager baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Marketing Manager', 'Marketing', 'Management', 'Technology', 'Core i7', '16GB', '512GB SSD', 'Dedicated', '4GB', 'Marketing Manager baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'HR Manager', 'Human Resources', 'Management', 'Technology', 'Core i5', '16GB', '256GB SSD', 'Onboard', '2GB', 'HR Manager baseline', false),

-- Senior Technical Roles
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Senior Software Engineer', 'Engineering', 'Senior', 'Technology', 'Core i7', '32GB', '1TB SSD', 'Dedicated', '6GB', 'Senior Software Engineer baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Senior Data Scientist', 'Data Science', 'Senior', 'Technology', 'Core i9', '64GB', '2TB SSD', 'Dedicated', '16GB', 'Senior Data Scientist baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Senior DevOps Engineer', 'Engineering', 'Senior', 'Technology', 'Core i7', '32GB', '1TB SSD', 'Dedicated', '8GB', 'Senior DevOps Engineer baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Senior UX Designer', 'Design', 'Senior', 'Technology', 'Core i7', '32GB', '1TB SSD', 'Dedicated', '8GB', 'Senior UX Designer baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Senior Security Engineer', 'Security', 'Senior', 'Technology', 'Core i7', '32GB', '1TB SSD', 'Dedicated', '6GB', 'Senior Security Engineer baseline', false),

-- Mid-Level Technical Roles
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Software Engineer', 'Engineering', 'Mid-Level', 'Technology', 'Core i7', '16GB', '512GB SSD', 'Dedicated', '4GB', 'Software Engineer baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Data Analyst', 'Data Science', 'Mid-Level', 'Technology', 'Core i7', '16GB', '512GB SSD', 'Dedicated', '4GB', 'Data Analyst baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'DevOps Engineer', 'Engineering', 'Mid-Level', 'Technology', 'Core i7', '16GB', '512GB SSD', 'Dedicated', '4GB', 'DevOps Engineer baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'UX Designer', 'Design', 'Mid-Level', 'Technology', 'Core i5', '16GB', '512GB SSD', 'Dedicated', '4GB', 'UX Designer baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'QA Engineer', 'Quality Assurance', 'Mid-Level', 'Technology', 'Core i5', '16GB', '256GB SSD', 'Onboard', '2GB', 'QA Engineer baseline', false),

-- Junior Technical Roles
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Junior Software Engineer', 'Engineering', 'Junior', 'Technology', 'Core i5', '16GB', '256GB SSD', 'Onboard', '2GB', 'Junior Software Engineer baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Junior Data Analyst', 'Data Science', 'Junior', 'Technology', 'Core i5', '16GB', '256GB SSD', 'Onboard', '2GB', 'Junior Data Analyst baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Junior UX Designer', 'Design', 'Junior', 'Technology', 'Core i5', '8GB', '256GB SSD', 'Onboard', '2GB', 'Junior UX Designer baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Junior QA Tester', 'Quality Assurance', 'Junior', 'Technology', 'Core i5', '8GB', '256GB SSD', 'Onboard', '1GB', 'Junior QA Tester baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Technical Writer', 'Documentation', 'Junior', 'Technology', 'Core i5', '8GB', '256GB SSD', 'Onboard', '1GB', 'Technical Writer baseline', false),

-- Sales Team Roles
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Senior Sales Executive', 'Sales', 'Senior', 'Technology', 'Core i5', '16GB', '512GB SSD', 'Onboard', '2GB', 'Senior Sales Executive baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Sales Executive', 'Sales', 'Mid-Level', 'Technology', 'Core i5', '8GB', '256GB SSD', 'Onboard', '1GB', 'Sales Executive baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Sales Development Rep', 'Sales', 'Junior', 'Technology', 'Core i3', '8GB', '256GB SSD', 'Onboard', '1GB', 'Sales Development Rep baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Account Manager', 'Sales', 'Mid-Level', 'Technology', 'Core i5', '8GB', '256GB SSD', 'Onboard', '1GB', 'Account Manager baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Business Development Manager', 'Sales', 'Senior', 'Technology', 'Core i5', '16GB', '256GB SSD', 'Onboard', '2GB', 'Business Development Manager baseline', false),

-- Marketing Team Roles
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Content Marketing Manager', 'Marketing', 'Mid-Level', 'Technology', 'Core i5', '16GB', '512GB SSD', 'Dedicated', '2GB', 'Content Marketing Manager baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Digital Marketing Specialist', 'Marketing', 'Mid-Level', 'Technology', 'Core i5', '8GB', '256GB SSD', 'Onboard', '2GB', 'Digital Marketing Specialist baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Social Media Manager', 'Marketing', 'Junior', 'Technology', 'Core i5', '8GB', '256GB SSD', 'Onboard', '1GB', 'Social Media Manager baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Graphic Designer', 'Marketing', 'Mid-Level', 'Technology', 'Core i7', '16GB', '512GB SSD', 'Dedicated', '4GB', 'Graphic Designer baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Brand Manager', 'Marketing', 'Senior', 'Technology', 'Core i5', '16GB', '256GB SSD', 'Onboard', '2GB', 'Brand Manager baseline', false),

-- HR and Operations Roles
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'HR Specialist', 'Human Resources', 'Mid-Level', 'Technology', 'Core i5', '8GB', '256GB SSD', 'Onboard', '1GB', 'HR Specialist baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Recruiter', 'Human Resources', 'Mid-Level', 'Technology', 'Core i5', '8GB', '256GB SSD', 'Onboard', '1GB', 'Recruiter baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Operations Manager', 'Operations', 'Management', 'Technology', 'Core i5', '16GB', '256GB SSD', 'Onboard', '2GB', 'Operations Manager baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Office Administrator', 'Operations', 'Junior', 'Technology', 'Core i3', '8GB', '256GB SSD', 'Onboard', '1GB', 'Office Administrator baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Executive Assistant', 'Executive', 'Junior', 'Technology', 'Core i5', '8GB', '256GB SSD', 'Onboard', '1GB', 'Executive Assistant baseline', false),

-- Finance Team Roles
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Finance Manager', 'Finance', 'Management', 'Technology', 'Core i5', '16GB', '256GB SSD', 'Onboard', '2GB', 'Finance Manager baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Financial Analyst', 'Finance', 'Mid-Level', 'Technology', 'Core i5', '16GB', '256GB SSD', 'Onboard', '2GB', 'Financial Analyst baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Accountant', 'Finance', 'Mid-Level', 'Technology', 'Core i5', '8GB', '256GB SSD', 'Onboard', '1GB', 'Accountant baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Accounts Payable Clerk', 'Finance', 'Junior', 'Technology', 'Core i3', '8GB', '256GB SSD', 'Onboard', '1GB', 'Accounts Payable Clerk baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Budget Analyst', 'Finance', 'Mid-Level', 'Technology', 'Core i5', '8GB', '256GB SSD', 'Onboard', '1GB', 'Budget Analyst baseline', false),

-- Customer Success and Support
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Customer Success Manager', 'Customer Success', 'Mid-Level', 'Technology', 'Core i5', '8GB', '256GB SSD', 'Onboard', '1GB', 'Customer Success Manager baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Support Engineer', 'Support', 'Mid-Level', 'Technology', 'Core i5', '16GB', '256GB SSD', 'Onboard', '2GB', 'Support Engineer baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Technical Support Specialist', 'Support', 'Junior', 'Technology', 'Core i5', '8GB', '256GB SSD', 'Onboard', '1GB', 'Technical Support Specialist baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Customer Service Rep', 'Support', 'Junior', 'Technology', 'Core i3', '8GB', '256GB SSD', 'Onboard', '1GB', 'Customer Service Rep baseline', false),

-- Additional Engineering Specializations
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Frontend Developer', 'Engineering', 'Mid-Level', 'Technology', 'Core i7', '16GB', '512GB SSD', 'Dedicated', '4GB', 'Frontend Developer baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Backend Developer', 'Engineering', 'Mid-Level', 'Technology', 'Core i7', '16GB', '512GB SSD', 'Onboard', '2GB', 'Backend Developer baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Full Stack Developer', 'Engineering', 'Mid-Level', 'Technology', 'Core i7', '16GB', '512GB SSD', 'Dedicated', '4GB', 'Full Stack Developer baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Mobile Developer', 'Engineering', 'Mid-Level', 'Technology', 'Core i7', '16GB', '512GB SSD', 'Dedicated', '4GB', 'Mobile Developer baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Machine Learning Engineer', 'Data Science', 'Senior', 'Technology', 'Core i9', '32GB', '1TB SSD', 'Dedicated', '16GB', 'Machine Learning Engineer baseline', false),

-- Specialized Technical Roles
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Database Administrator', 'Engineering', 'Senior', 'Technology', 'Core i7', '32GB', '1TB SSD', 'Onboard', '2GB', 'Database Administrator baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'System Administrator', 'IT', 'Mid-Level', 'Technology', 'Core i7', '16GB', '512GB SSD', 'Onboard', '2GB', 'System Administrator baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Network Administrator', 'IT', 'Mid-Level', 'Technology', 'Core i5', '16GB', '256GB SSD', 'Onboard', '1GB', 'Network Administrator baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Cloud Architect', 'Engineering', 'Senior', 'Technology', 'Core i9', '32GB', '1TB SSD', 'Dedicated', '8GB', 'Cloud Architect baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Security Analyst', 'Security', 'Mid-Level', 'Technology', 'Core i7', '16GB', '512GB SSD', 'Onboard', '2GB', 'Security Analyst baseline', false),

-- Additional Business Roles
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Business Analyst', 'Business Development', 'Mid-Level', 'Technology', 'Core i5', '16GB', '256GB SSD', 'Onboard', '2GB', 'Business Analyst baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Project Manager', 'Project Management', 'Mid-Level', 'Technology', 'Core i5', '16GB', '256GB SSD', 'Onboard', '2GB', 'Project Manager baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Scrum Master', 'Project Management', 'Mid-Level', 'Technology', 'Core i5', '8GB', '256GB SSD', 'Onboard', '1GB', 'Scrum Master baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Product Owner', 'Product', 'Mid-Level', 'Technology', 'Core i5', '16GB', '256GB SSD', 'Onboard', '2GB', 'Product Owner baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'UX Researcher', 'Design', 'Mid-Level', 'Technology', 'Core i5', '16GB', '256GB SSD', 'Onboard', '2GB', 'UX Researcher baseline', false),

-- Remote/Contractor Roles
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Remote Developer', 'Engineering', 'Mid-Level', 'Technology', 'Core i5', '16GB', '512GB SSD', 'Dedicated', '4GB', 'Remote Developer baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Freelance Designer', 'Design', 'Mid-Level', 'Technology', 'Core i7', '16GB', '512GB SSD', 'Dedicated', '4GB', 'Freelance Designer baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Contract Writer', 'Content', 'Junior', 'Technology', 'Core i5', '8GB', '256GB SSD', 'Onboard', '1GB', 'Contract Writer baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Consultant', 'Consulting', 'Senior', 'Technology', 'Core i7', '16GB', '512GB SSD', 'Onboard', '2GB', 'Consultant baseline', false),

-- Intern and Entry Level
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Software Engineering Intern', 'Engineering', 'Intern', 'Technology', 'Core i3', '8GB', '256GB SSD', 'Onboard', '1GB', 'Software Engineering Intern baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Marketing Intern', 'Marketing', 'Intern', 'Technology', 'Core i3', '8GB', '256GB SSD', 'Onboard', '1GB', 'Marketing Intern baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Design Intern', 'Design', 'Intern', 'Technology', 'Core i5', '8GB', '256GB SSD', 'Onboard', '1GB', 'Design Intern baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Data Science Intern', 'Data Science', 'Intern', 'Technology', 'Core i5', '16GB', '256GB SSD', 'Onboard', '2GB', 'Data Science Intern baseline', false),

-- Additional Specialized Roles
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Video Editor', 'Creative', 'Mid-Level', 'Media', 'Core i9', '32GB', '2TB SSD', 'Dedicated', '16GB', 'Video Editor baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', '3D Artist', 'Creative', 'Mid-Level', 'Media', 'Core i9', '64GB', '2TB SSD', 'Dedicated', '24GB', '3D Artist baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Game Developer', 'Engineering', 'Mid-Level', 'Gaming', 'Core i9', '32GB', '1TB SSD', 'Dedicated', '16GB', 'Game Developer baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Audio Engineer', 'Creative', 'Mid-Level', 'Media', 'Core i7', '32GB', '1TB SSD', 'Dedicated', '8GB', 'Audio Engineer baseline', false),

-- Manufacturing and Industrial Roles
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'CAD Designer', 'Engineering', 'Mid-Level', 'Manufacturing', 'Core i7', '32GB', '1TB SSD', 'Dedicated', '8GB', 'CAD Designer baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Process Engineer', 'Engineering', 'Senior', 'Manufacturing', 'Core i7', '16GB', '512GB SSD', 'Onboard', '2GB', 'Process Engineer baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Quality Control Inspector', 'Quality Assurance', 'Mid-Level', 'Manufacturing', 'Core i5', '8GB', '256GB SSD', 'Onboard', '1GB', 'Quality Control Inspector baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Plant Manager', 'Operations', 'Management', 'Manufacturing', 'Core i5', '16GB', '256GB SSD', 'Onboard', '2GB', 'Plant Manager baseline', false),

-- Healthcare Industry Roles
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Medical Records Specialist', 'Administration', 'Mid-Level', 'Healthcare', 'Core i5', '8GB', '256GB SSD', 'Onboard', '1GB', 'Medical Records Specialist baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Health IT Specialist', 'IT', 'Mid-Level', 'Healthcare', 'Core i7', '16GB', '512GB SSD', 'Onboard', '2GB', 'Health IT Specialist baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Medical Device Engineer', 'Engineering', 'Senior', 'Healthcare', 'Core i7', '32GB', '1TB SSD', 'Dedicated', '6GB', 'Medical Device Engineer baseline', false),

-- Financial Services Roles
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Investment Analyst', 'Finance', 'Mid-Level', 'Financial Services', 'Core i7', '32GB', '512GB SSD', 'Onboard', '2GB', 'Investment Analyst baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Risk Analyst', 'Risk Management', 'Mid-Level', 'Financial Services', 'Core i7', '16GB', '512GB SSD', 'Onboard', '2GB', 'Risk Analyst baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Compliance Officer', 'Compliance', 'Senior', 'Financial Services', 'Core i5', '16GB', '256GB SSD', 'Onboard', '2GB', 'Compliance Officer baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Trading Analyst', 'Trading', 'Mid-Level', 'Financial Services', 'Core i9', '32GB', '1TB SSD', 'Dedicated', '8GB', 'Trading Analyst baseline', false),

-- Education Sector Roles
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'IT Coordinator', 'IT', 'Mid-Level', 'Education', 'Core i5', '16GB', '512GB SSD', 'Onboard', '2GB', 'IT Coordinator baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Educational Technology Specialist', 'IT', 'Mid-Level', 'Education', 'Core i7', '16GB', '512GB SSD', 'Dedicated', '4GB', 'Educational Technology Specialist baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Research Assistant', 'Research', 'Junior', 'Education', 'Core i5', '16GB', '256GB SSD', 'Onboard', '2GB', 'Research Assistant baseline', false),

-- Government Roles
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Government IT Specialist', 'IT', 'Mid-Level', 'Government', 'Core i5', '16GB', '256GB SSD', 'Onboard', '2GB', 'Government IT Specialist baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Policy Analyst', 'Policy', 'Mid-Level', 'Government', 'Core i5', '8GB', '256GB SSD', 'Onboard', '1GB', 'Policy Analyst baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Data Administrator', 'Administration', 'Mid-Level', 'Government', 'Core i5', '16GB', '512GB SSD', 'Onboard', '2GB', 'Data Administrator baseline', false),

-- Retail Industry Roles
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'E-commerce Manager', 'E-commerce', 'Management', 'Retail', 'Core i5', '16GB', '256GB SSD', 'Onboard', '2GB', 'E-commerce Manager baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Inventory Analyst', 'Operations', 'Mid-Level', 'Retail', 'Core i5', '8GB', '256GB SSD', 'Onboard', '1GB', 'Inventory Analyst baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Merchandising Specialist', 'Merchandising', 'Mid-Level', 'Retail', 'Core i5', '8GB', '256GB SSD', 'Onboard', '1GB', 'Merchandising Specialist baseline', false),

-- Additional Technology Specialists
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Blockchain Developer', 'Engineering', 'Senior', 'Technology', 'Core i9', '32GB', '1TB SSD', 'Dedicated', '8GB', 'Blockchain Developer baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'AI Research Engineer', 'Research', 'Senior', 'Technology', 'Core i9', '64GB', '2TB SSD', 'Dedicated', '24GB', 'AI Research Engineer baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'IoT Developer', 'Engineering', 'Mid-Level', 'Technology', 'Core i7', '16GB', '512GB SSD', 'Onboard', '2GB', 'IoT Developer baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'AR/VR Developer', 'Engineering', 'Mid-Level', 'Technology', 'Core i9', '32GB', '1TB SSD', 'Dedicated', '16GB', 'AR/VR Developer baseline', false),

-- Final specialized roles to reach 100
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Technical Lead', 'Engineering', 'Senior', 'Technology', 'Core i9', '32GB', '1TB SSD', 'Dedicated', '8GB', 'Technical Lead baseline', false),
('2ab0618e-3cfb-43f5-8c50-956636cb8611', 'Solutions Architect', 'Engineering', 'Senior', 'Technology', 'Core i9', '32GB', '1TB SSD', 'Dedicated', '8GB', 'Solutions Architect baseline', false);