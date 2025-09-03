import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users, Building2, Plus, Filter, Monitor, Cpu, HardDrive } from 'lucide-react';

const INDUSTRY_PROFILES = {
  'Healthcare': [
    { role: 'Registered Nurse', department: 'Clinical', level: 'Staff', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Medical Assistant', department: 'Clinical', level: 'Support', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Physician', department: 'Clinical', level: 'Professional', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Laboratory Technician', department: 'Lab', level: 'Technical', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Healthcare Administrator', department: 'Administration', level: 'Management', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Radiologic Technologist', department: 'Radiology', level: 'Technical', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Clinical Manager', department: 'Clinical', level: 'Management', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Pharmacy Technician', department: 'Pharmacy', level: 'Technical', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Health Information Manager', department: 'IT', level: 'Professional', hardware: { cpu: 'Core i5', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Medical Receptionist', department: 'Administration', level: 'Support', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD' } }
  ],
  'Manufacturing': [
    { role: 'Production Worker', department: 'Production', level: 'Staff', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Machine Operator', department: 'Production', level: 'Technical', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Quality Control Specialist', department: 'Quality', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Maintenance Technician', department: 'Maintenance', level: 'Technical', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Plant Manager', department: 'Operations', level: 'Executive', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Supply Chain Coordinator', department: 'Logistics', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Safety Officer', department: 'Safety', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Assembly Line Worker', department: 'Production', level: 'Staff', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Logistics Coordinator', department: 'Logistics', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Equipment Operator', department: 'Production', level: 'Technical', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD' } }
  ],
  'Technology': [
    { role: 'Software Engineer', department: 'Engineering', level: 'Professional', hardware: { cpu: 'Core i7', ram: '32GB', storage: '1TB SSD' } },
    { role: 'Systems Administrator', department: 'IT', level: 'Technical', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Data Scientist', department: 'Data', level: 'Professional', hardware: { cpu: 'Core i9', ram: '32GB', storage: '1TB SSD' } },
    { role: 'DevOps Engineer', department: 'Engineering', level: 'Professional', hardware: { cpu: 'Core i7', ram: '32GB', storage: '1TB SSD' } },
    { role: 'Product Manager', department: 'Product', level: 'Management', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Network Engineer', department: 'IT', level: 'Technical', hardware: { cpu: 'Core i5', ram: '16GB', storage: '512GB SSD' } },
    { role: 'UX/UI Designer', department: 'Design', level: 'Professional', hardware: { cpu: 'Core i7', ram: '32GB', storage: '1TB SSD' } },
    { role: 'Software Tester', department: 'QA', level: 'Technical', hardware: { cpu: 'Core i5', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Cybersecurity Analyst', department: 'Security', level: 'Professional', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Cloud Engineer', department: 'IT', level: 'Professional', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD' } }
  ],
  'Financial Services': [
    { role: 'Financial Analyst', department: 'Finance', level: 'Professional', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Compliance Officer', department: 'Compliance', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Risk Manager', department: 'Risk', level: 'Management', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Investment Banker', department: 'Investment', level: 'Professional', hardware: { cpu: 'Core i7', ram: '32GB', storage: '1TB SSD' } },
    { role: 'Portfolio Manager', department: 'Investment', level: 'Management', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Fraud Investigator', department: 'Security', level: 'Professional', hardware: { cpu: 'Core i5', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Financial Advisor', department: 'Advisory', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Treasury Analyst', department: 'Treasury', level: 'Professional', hardware: { cpu: 'Core i5', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Loan Officer', department: 'Lending', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } }
  ],
  'Education': [
    { role: 'Teacher', department: 'Academic', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Professor', department: 'Academic', level: 'Professional', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Administrator', department: 'Administration', level: 'Management', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Librarian', department: 'Library', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Counselor', department: 'Student Services', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Researcher', department: 'Research', level: 'Professional', hardware: { cpu: 'Core i7', ram: '32GB', storage: '1TB SSD' } },
    { role: 'Academic Advisor', department: 'Student Services', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Admissions Officer', department: 'Admissions', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Student Services Coordinator', department: 'Student Services', level: 'Support', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Dean', department: 'Academic', level: 'Executive', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD' } }
  ],
  'Government': [
    { role: 'Policy Analyst', department: 'Policy', level: 'Professional', hardware: { cpu: 'Core i5', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Public Administrator', department: 'Administration', level: 'Management', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Law Enforcement', department: 'Public Safety', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Social Worker', department: 'Social Services', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Program Manager', department: 'Programs', level: 'Management', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Emergency Planner', department: 'Emergency Management', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Government Executive', department: 'Executive', level: 'Executive', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Policy Advisor', department: 'Policy', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Public Relations Officer', department: 'Communications', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Administrative Assistant', department: 'Administration', level: 'Support', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD' } }
  ],
  'Retail': [
    { role: 'Store Manager', department: 'Operations', level: 'Management', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Cashier', department: 'Sales', level: 'Staff', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Sales Associate', department: 'Sales', level: 'Staff', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Visual Merchandiser', department: 'Marketing', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Customer Service Rep', department: 'Customer Service', level: 'Support', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Inventory Analyst', department: 'Operations', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Warehouse Worker', department: 'Logistics', level: 'Staff', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Store Clerk', department: 'Operations', level: 'Staff', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Delivery Driver', department: 'Logistics', level: 'Staff', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Regional Manager', department: 'Operations', level: 'Executive', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD' } }
  ],
  'Professional Services': [
    { role: 'Consultant', department: 'Consulting', level: 'Professional', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Accountant', department: 'Accounting', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Legal Advisor', department: 'Legal', level: 'Professional', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Project Manager', department: 'Project Management', level: 'Management', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Human Resources Manager', department: 'HR', level: 'Management', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'IT Support Technician', department: 'IT', level: 'Technical', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Marketing Specialist', department: 'Marketing', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Business Analyst', department: 'Analysis', level: 'Professional', hardware: { cpu: 'Core i5', ram: '16GB', storage: '512GB SSD' } },
    { role: 'Tax Consultant', department: 'Tax', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD' } },
    { role: 'Strategy Consultant', department: 'Strategy', level: 'Professional', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD' } }
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

  // Flatten all profiles for filtering
  const allProfiles = Object.entries(INDUSTRY_PROFILES).flatMap(([industry, profiles]) =>
    profiles.map(profile => ({ ...profile, industry }))
  );

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
        <Button>
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

      {/* Results */}
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
    </div>
  );
}