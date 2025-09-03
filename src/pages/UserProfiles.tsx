import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users, Building2, Plus, Filter, Monitor, Cpu, HardDrive, Trash2, Edit } from 'lucide-react';
import { CreateCustomProfile } from '@/components/profile/CreateCustomProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const INDUSTRY_PROFILES = {
  'Healthcare': [
    { role: 'Registered Nurse', designation: 'Registered Nurse', department: 'Clinical Services', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Attending Physician', designation: 'Attending Physician', department: 'Clinical Services', level: 'Professional', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Healthcare Administrator', designation: 'Healthcare Administrator', department: 'Administration', level: 'Management', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Senior Lab Technician', designation: 'Senior Lab Technician', department: 'Laboratory', level: 'Technical', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Certified Medical Assistant', designation: 'Certified Medical Assistant', department: 'Support Services', level: 'Support', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Lead Pharmacist', designation: 'Lead Pharmacist', department: 'Pharmacy', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Patient Care Coordinator', designation: 'Patient Care Coordinator', department: 'Patient Care', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Medical Billing Specialist', designation: 'Medical Billing Specialist', department: 'Finance', level: 'Support', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD' } },
    { role: 'IT Support Specialist', designation: 'IT Support Specialist', department: 'IT', level: 'Technical', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Human Resources Manager', designation: 'Human Resources Manager', department: 'HR', level: 'Management', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } }
  ],
  'Manufacturing': [
    { role: 'Machine Operator', designation: 'Machine Operator', department: 'Production', level: 'Staff', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Maintenance Technician', designation: 'Maintenance Technician', department: 'Production', level: 'Technical', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Quality Control Specialist', designation: 'Quality Control Specialist', department: 'Quality Control', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Supply Chain Coordinator', designation: 'Supply Chain Coordinator', department: 'Supply Chain', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Plant Manager', designation: 'Plant Manager', department: 'Plant Management', level: 'Management', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Administrative Assistant', designation: 'Administrative Assistant', department: 'Administration', level: 'Support', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Safety Compliance Officer', designation: 'Safety Compliance Officer', department: 'Safety', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Logistics Supervisor', designation: 'Logistics Supervisor', department: 'Logistics', level: 'Management', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Network Administrator', designation: 'Network Administrator', department: 'IT', level: 'Technical', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Human Resources Specialist', designation: 'Human Resources Specialist', department: 'HR', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } }
  ],
  'Financial Services': [
    { role: 'Financial Analyst', designation: 'Financial Analyst', department: 'Finance', level: 'Professional', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Finance Manager', designation: 'Finance Manager', department: 'Finance', level: 'Management', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Compliance Officer', designation: 'Compliance Officer', department: 'Compliance', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Risk Analyst', designation: 'Risk Analyst', department: 'Risk Management', level: 'Professional', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Operations Coordinator', designation: 'Operations Coordinator', department: 'Operations', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Customer Service Rep', designation: 'Customer Service Rep', department: 'Customer Service', level: 'Support', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD' } },
    { role: 'IT Support Technician', designation: 'IT Support Technician', department: 'IT', level: 'Technical', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Marketing Specialist', designation: 'Marketing Specialist', department: 'Marketing', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Sales Executive', designation: 'Sales Executive', department: 'Sales', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Talent Acquisition Manager', designation: 'Talent Acquisition Manager', department: 'HR', level: 'Management', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } }
  ],
  'Technology': [
    { role: 'Senior Software Engineer', designation: 'Senior Software Engineer', department: 'Engineering', level: 'Professional', hardware: { cpu: 'Core i7', ram: '32GB', storage: '1TB SSD' } },
    { role: 'Product Owner', designation: 'Product Owner', department: 'Product', level: 'Management', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Network Engineer', designation: 'Network Engineer', department: 'IT', level: 'Technical', hardware: { cpu: 'Core i5', ram: '16GB', storage: '512GB SSD' } },
    { role: 'DevOps Engineer', designation: 'DevOps Engineer', department: 'DevOps', level: 'Professional', hardware: { cpu: 'Core i7', ram: '32GB', storage: '1TB SSD' } },
    { role: 'QA Analyst', designation: 'QA Analyst', department: 'Quality Assurance', level: 'Professional', hardware: { cpu: 'Core i5', ram: '16GB', storage: '512GB SSD' } },
    { role: 'UX Designer', designation: 'UX Designer', department: 'UX/UI', level: 'Professional', hardware: { cpu: 'Core i7', ram: '32GB', storage: '1TB SSD' } },
    { role: 'Account Manager', designation: 'Account Manager', department: 'Sales', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Digital Marketing Manager', designation: 'Digital Marketing Manager', department: 'Marketing', level: 'Management', hardware: { cpu: 'Core i5', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Technical Recruiter', designation: 'Technical Recruiter', department: 'HR', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Office Assistant', designation: 'Office Assistant', department: 'Administration', level: 'Support', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD' } }
  ],
  'Education': [
    { role: 'Senior Lecturer', designation: 'Senior Lecturer', department: 'Academic', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Registrar', designation: 'Registrar', department: 'Administration', level: 'Management', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Academic Counselor', designation: 'Academic Counselor', department: 'Student Services', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'IT Support Specialist', designation: 'IT Support Specialist', department: 'IT', level: 'Technical', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Senior Librarian', designation: 'Senior Librarian', department: 'Library Services', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Facilities Manager', designation: 'Facilities Manager', department: 'Facilities', level: 'Management', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Budget Analyst', designation: 'Budget Analyst', department: 'Finance', level: 'Professional', hardware: { cpu: 'Core i5', ram: '16GB', storage: '512GB SSD' } },
    { role: 'HR Manager', designation: 'HR Manager', department: 'Human Resources', level: 'Management', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Research Associate', designation: 'Research Associate', department: 'Research', level: 'Professional', hardware: { cpu: 'Core i7', ram: '32GB', storage: '1TB SSD' } },
    { role: 'Admissions Officer', designation: 'Admissions Officer', department: 'Admissions', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } }
  ],
  'Government': [
    { role: 'Administrative Clerk', designation: 'Administrative Clerk', department: 'Administration', level: 'Support', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Policy Analyst', designation: 'Policy Analyst', department: 'Policy & Planning', level: 'Professional', hardware: { cpu: 'Core i5', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Police Officer', designation: 'Police Officer', department: 'Public Safety', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Social Worker', designation: 'Social Worker', department: 'Social Services', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Systems Administrator', designation: 'Systems Administrator', department: 'IT', level: 'Technical', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Financial Analyst', designation: 'Financial Analyst', department: 'Finance', level: 'Professional', hardware: { cpu: 'Core i5', ram: '16GB', storage: '512GB SSD' } },
    { role: 'HR Specialist', designation: 'HR Specialist', department: 'HR', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Public Relations Officer', designation: 'Public Relations Officer', department: 'Communications', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Legal Counsel', designation: 'Legal Counsel', department: 'Legal', level: 'Professional', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Call Center Agent', designation: 'Call Center Agent', department: 'Customer Service', level: 'Support', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD' } }
  ],
  'Retail': [
    { role: 'Sales Associate', designation: 'Sales Associate', department: 'Sales', level: 'Staff', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Store Manager', designation: 'Store Manager', department: 'Store Management', level: 'Management', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Inventory Clerk', designation: 'Inventory Clerk', department: 'Inventory', level: 'Support', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Customer Service Rep', designation: 'Customer Service Rep', department: 'Customer Service', level: 'Support', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Marketing Coordinator', designation: 'Marketing Coordinator', department: 'Marketing', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Logistics Coordinator', designation: 'Logistics Coordinator', department: 'Logistics', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'IT Technician', designation: 'IT Technician', department: 'IT', level: 'Technical', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'HR Specialist', designation: 'HR Specialist', department: 'HR', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Payroll Analyst', designation: 'Payroll Analyst', department: 'Finance', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Merchandising Specialist', designation: 'Merchandising Specialist', department: 'Visual Merchandising', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } }
  ],
  'Professional Services': [
    { role: 'Management Consultant', designation: 'Management Consultant', department: 'Consulting', level: 'Professional', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Associate Attorney', designation: 'Associate Attorney', department: 'Legal', level: 'Professional', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD' } },
    { role: 'CPA', designation: 'CPA', department: 'Accounting', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'HR Business Partner', designation: 'HR Business Partner', department: 'Human Resources', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'System Engineer', designation: 'System Engineer', department: 'IT', level: 'Technical', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Marketing Director', designation: 'Marketing Director', department: 'Marketing', level: 'Management', hardware: { cpu: 'Core i5', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Project Manager', designation: 'Project Manager', department: 'Project Management', level: 'Management', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Financial Analyst', designation: 'Financial Analyst', department: 'Finance', level: 'Professional', hardware: { cpu: 'Core i5', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Sales Director', designation: 'Sales Director', department: 'Sales', level: 'Management', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Office Manager', designation: 'Office Manager', department: 'Administration', level: 'Management', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } }
  ],
  'Non-Profit': [
    { role: 'Program Coordinator', designation: 'Program Coordinator', department: 'Program Management', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Fundraising Manager', designation: 'Fundraising Manager', department: 'Fundraising', level: 'Management', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Volunteer Coordinator', designation: 'Volunteer Coordinator', department: 'Volunteer Services', level: 'Professional', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Grants Analyst', designation: 'Grants Analyst', department: 'Finance', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Communications Specialist', designation: 'Communications Specialist', department: 'Communications', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Community Trainer', designation: 'Community Trainer', department: 'Education', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Administrative Assistant', designation: 'Administrative Assistant', department: 'Administration', level: 'Support', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD' } },
    { role: 'HR Manager', designation: 'HR Manager', department: 'HR', level: 'Management', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'IT Support Specialist', designation: 'IT Support Specialist', department: 'IT', level: 'Technical', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Outreach Coordinator', designation: 'Outreach Coordinator', department: 'Outreach', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } }
  ],
  'Other': [
    { role: 'Operations Manager', designation: 'Operations Manager', department: 'Operations', level: 'Management', hardware: { cpu: 'Core i5', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Administrative Clerk', designation: 'Administrative Clerk', department: 'Administration', level: 'Support', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Customer Service Rep', designation: 'Customer Service Rep', department: 'Customer Service', level: 'Support', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Technical Support Specialist', designation: 'Technical Support Specialist', department: 'IT', level: 'Technical', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Marketing Specialist', designation: 'Marketing Specialist', department: 'Marketing', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Financial Analyst', designation: 'Financial Analyst', department: 'Finance', level: 'Professional', hardware: { cpu: 'Core i5', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Sales Executive', designation: 'Sales Executive', department: 'Sales', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'HR Coordinator', designation: 'HR Coordinator', department: 'Human Resources', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Legal Advisor', designation: 'Legal Advisor', department: 'Legal', level: 'Professional', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Managing Director', designation: 'Managing Director', department: 'Management', level: 'Executive', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD' } }
  ]
};

const LEVEL_COLORS = {
  'Staff': 'bg-blue-100 text-blue-800',
  'Support': 'bg-green-100 text-green-800',
  'Technical': 'bg-yellow-100 text-yellow-800',
  'Professional': 'bg-purple-100 text-purple-800',
  'Management': 'bg-orange-100 text-orange-800',
  'Executive': 'bg-red-100 text-red-800'
};

export default function UserProfiles() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [customProfiles, setCustomProfiles] = useState<any[]>([]);
  const { toast } = useToast();

  // Fetch custom profiles
  const fetchCustomProfiles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomProfiles(data || []);
    } catch (error) {
      console.error('Error fetching custom profiles:', error);
    }
  };

  useEffect(() => {
    fetchCustomProfiles();
  }, []);

  const deleteCustomProfile = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Profile Deleted",
        description: "The custom profile has been deleted successfully."
      });

      fetchCustomProfiles();
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast({
        title: "Error",
        description: "Failed to delete profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Combine default and custom profiles
  const allProfiles = [
    ...Object.entries(INDUSTRY_PROFILES).flatMap(([industry, profiles]) =>
      profiles.map(profile => ({ ...profile, industry, isCustom: false }))
    ),
    ...customProfiles.map(profile => ({
      role: profile.role,
      department: profile.department,
      level: profile.level,
      industry: profile.industry || 'Custom',
      hardware: {
        cpu: profile.hardware_cpu,
        ram: profile.hardware_ram,
        storage: profile.hardware_storage
      },
      description: profile.description,
      isCustom: true,
      id: profile.id
    }))
  ];

  // Get unique values for filters
  const departments = [...new Set(allProfiles.map(p => p.department))];
  const levels = [...new Set(allProfiles.map(p => p.level))];

  // Filter profiles
  const filteredProfiles = allProfiles.filter(profile => {
    const matchesSearch = profile.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'All' || profile.industry === selectedIndustry;
    const matchesLevel = selectedLevel === 'All' || profile.level === selectedLevel;
    const matchesDepartment = selectedDepartment === 'All' || profile.department === selectedDepartment;
    
    return matchesSearch && matchesIndustry && matchesLevel && matchesDepartment;
  });

  // Group by industry for display
  const groupedProfiles = filteredProfiles.reduce((acc, profile) => {
    if (!acc[profile.industry]) {
      acc[profile.industry] = [];
    }
    acc[profile.industry].push(profile);
    return acc;
  }, {} as Record<string, typeof filteredProfiles>);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Profiles</h1>
          <p className="text-muted-foreground">
            Comprehensive role profiles across different industries with hardware requirements
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Custom Profile
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search roles, departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Industries</SelectItem>
                {Object.keys(INDUSTRY_PROFILES).map(industry => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Levels</SelectItem>
                {levels.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Departments</SelectItem>
                {departments.map(department => (
                  <SelectItem key={department} value={department}>{department}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              {filteredProfiles.length} profiles
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Profiles Section */}
      {customProfiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Your Custom Profiles
              <Badge variant="secondary">{customProfiles.length} profiles</Badge>
            </CardTitle>
            <CardDescription>
              Custom profiles you've created for your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customProfiles.map((profile) => (
                <Card key={profile.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{profile.role}</h4>
                          <p className="text-sm text-muted-foreground">{profile.department}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteCustomProfile(profile.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <Badge className={LEVEL_COLORS[profile.level as keyof typeof LEVEL_COLORS]}>
                        {profile.level}
                      </Badge>
                      
                      {profile.industry && (
                        <Badge variant="outline">{profile.industry}</Badge>
                      )}
                      
                      {profile.description && (
                        <p className="text-xs text-muted-foreground">{profile.description}</p>
                      )}
                      
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Hardware Requirements
                        </p>
                        <div className="grid grid-cols-1 gap-1 text-xs">
                          <div className="flex items-center gap-2">
                            <Cpu className="h-3 w-3 text-muted-foreground" />
                            <span>{profile.hardware_cpu}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Monitor className="h-3 w-3 text-muted-foreground" />
                            <span>{profile.hardware_ram}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <HardDrive className="h-3 w-3 text-muted-foreground" />
                            <span>{profile.hardware_storage}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Standard Profiles */}
      <div className="space-y-6">
        {Object.entries(groupedProfiles).map(([industry, profiles]) => (
          <Card key={industry}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {industry}
                <Badge variant="secondary">{profiles.length} roles</Badge>
              </CardTitle>
              <CardDescription>
                Industry-specific roles with standardized hardware requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profiles.map((profile, index) => (
                  <Card key={`${profile.role}-${index}`} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold">{profile.role}</h4>
                          <p className="text-sm text-muted-foreground">{profile.department}</p>
                        </div>
                        
                        <Badge className={LEVEL_COLORS[profile.level as keyof typeof LEVEL_COLORS]}>
                          {profile.level}
                        </Badge>
                        
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Hardware Requirements
                          </p>
                          <div className="grid grid-cols-1 gap-1 text-xs">
                            <div className="flex items-center gap-2">
                              <Cpu className="h-3 w-3 text-muted-foreground" />
                              <span>{profile.hardware.cpu}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Monitor className="h-3 w-3 text-muted-foreground" />
                              <span>{profile.hardware.ram}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <HardDrive className="h-3 w-3 text-muted-foreground" />
                              <span>{profile.hardware.storage}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProfiles.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No profiles found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search terms to find relevant user profiles.
            </p>
          </CardContent>
        </Card>
      )}

      <CreateCustomProfile
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onProfileCreated={fetchCustomProfiles}
      />
    </div>
  );
}