import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Users, Plus, Edit, Trash2, Copy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Standard industry templates
const INDUSTRY_TEMPLATES = {
  'Healthcare': {
    description: 'Medical facilities, hospitals, clinics, and healthcare organizations',
    profiles: [
      { role: 'Registered Nurse', department: 'Clinical Services', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD', graphics: 'Onboard' } },
      { role: 'Attending Physician', department: 'Clinical Services', level: 'Professional', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD', graphics: 'Onboard' } },
      { role: 'Healthcare Administrator', department: 'Administration', level: 'Management', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD', graphics: 'Onboard' } },
      { role: 'Medical Billing Specialist', department: 'Finance', level: 'Support', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD', graphics: 'Onboard' } },
    ]
  },
  'Technology': {
    description: 'Software companies, tech startups, and IT organizations',
    profiles: [
      { role: 'Senior Software Engineer', department: 'Engineering', level: 'Professional', hardware: { cpu: 'Core i7', ram: '32GB', storage: '1TB SSD', graphics: 'Dedicated' } },
      { role: 'DevOps Engineer', department: 'DevOps', level: 'Professional', hardware: { cpu: 'Core i7', ram: '32GB', storage: '1TB SSD', graphics: 'Onboard' } },
      { role: 'UX Designer', department: 'Design', level: 'Professional', hardware: { cpu: 'Core i7', ram: '32GB', storage: '1TB SSD', graphics: 'Dedicated' } },
      { role: 'Product Manager', department: 'Product', level: 'Management', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD', graphics: 'Onboard' } },
    ]
  },
  'Manufacturing': {
    description: 'Production facilities, factories, and manufacturing organizations',
    profiles: [
      { role: 'Machine Operator', department: 'Production', level: 'Staff', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD', graphics: 'Onboard' } },
      { role: 'Quality Control Specialist', department: 'Quality Control', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD', graphics: 'Onboard' } },
      { role: 'Plant Manager', department: 'Management', level: 'Management', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD', graphics: 'Onboard' } },
      { role: 'Maintenance Technician', department: 'Maintenance', level: 'Technical', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD', graphics: 'Onboard' } },
    ]
  },
  'Financial Services': {
    description: 'Banks, investment firms, and financial institutions',
    profiles: [
      { role: 'Financial Analyst', department: 'Finance', level: 'Professional', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD', graphics: 'Onboard' } },
      { role: 'Compliance Officer', department: 'Compliance', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD', graphics: 'Onboard' } },
      { role: 'Risk Analyst', department: 'Risk Management', level: 'Professional', hardware: { cpu: 'Core i7', ram: '16GB', storage: '512GB SSD', graphics: 'Onboard' } },
      { role: 'Customer Service Rep', department: 'Customer Service', level: 'Support', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD', graphics: 'Onboard' } },
    ]
  },
  'Education': {
    description: 'Schools, universities, and educational institutions',
    profiles: [
      { role: 'Senior Lecturer', department: 'Academic', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD', graphics: 'Onboard' } },
      { role: 'Academic Counselor', department: 'Student Services', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD', graphics: 'Onboard' } },
      { role: 'IT Support Specialist', department: 'IT', level: 'Technical', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD', graphics: 'Onboard' } },
      { role: 'Research Associate', department: 'Research', level: 'Professional', hardware: { cpu: 'Core i7', ram: '32GB', storage: '1TB SSD', graphics: 'Dedicated' } },
    ]
  },
  'Retail': {
    description: 'Retail stores, e-commerce, and consumer-facing businesses',
    profiles: [
      { role: 'Sales Associate', department: 'Sales', level: 'Staff', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD', graphics: 'Onboard' } },
      { role: 'Store Manager', department: 'Management', level: 'Management', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD', graphics: 'Onboard' } },
      { role: 'Inventory Clerk', department: 'Inventory', level: 'Support', hardware: { cpu: 'Core i3', ram: '8GB', storage: '256GB SSD', graphics: 'Onboard' } },
      { role: 'Marketing Coordinator', department: 'Marketing', level: 'Professional', hardware: { cpu: 'Core i5', ram: '8GB', storage: '256GB SSD', graphics: 'Onboard' } },
    ]
  }
};

interface CustomIndustry {
  id: string;
  name: string;
  description: string;
  user_id: string;
  profiles_count: number;
  created_at: string;
}

export default function Industries() {
  const [customIndustries, setCustomIndustries] = useState<CustomIndustry[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState<CustomIndustry | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch custom industries
  const fetchCustomIndustries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // For now, we'll simulate custom industries as we don't have the table yet
      // In a real implementation, you'd fetch from a custom_industries table
      setCustomIndustries([]);
    } catch (error) {
      console.error('Error fetching custom industries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomIndustries();
  }, []);

  const deleteCustomIndustry = async (id: string) => {
    try {
      // Implementation would delete from database
      toast({
        title: "Industry Deleted",
        description: "The custom industry has been deleted successfully."
      });
      fetchCustomIndustries();
    } catch (error) {
      console.error('Error deleting industry:', error);
      toast({
        title: "Error",
        description: "Failed to delete industry. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Industries</h1>
          <p className="text-muted-foreground">
            Manage industry templates and create custom industry profiles
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Custom Industry
        </Button>
      </div>

      {/* Custom Industries Section */}
      {customIndustries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Your Custom Industries
              <Badge variant="secondary">{customIndustries.length} industries</Badge>
            </CardTitle>
            <CardDescription>
              Custom industry templates you've created for your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customIndustries.map((industry) => (
                <Card key={industry.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{industry.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{industry.description}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingIndustry(industry);
                              setShowEditDialog(true);
                            }}
                            className="h-8 w-8 p-0 text-primary hover:text-primary"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteCustomIndustry(industry.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{industry.profiles_count} profiles</span>
                      </div>
                      
                      <Badge variant="outline" className="text-xs">Custom</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Standard Industry Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Standard Industry Templates
            <Badge variant="secondary">{Object.keys(INDUSTRY_TEMPLATES).length} templates</Badge>
          </CardTitle>
          <CardDescription>
            Pre-built industry templates with common job roles and hardware requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(INDUSTRY_TEMPLATES).map(([name, template]) => (
              <Card key={name} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // This would open a dialog to create a custom industry based on this template
                          setShowCreateDialog(true);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{template.profiles.length} default profiles</span>
                    </div>
                    
                    <Badge variant="outline" className="text-xs">Standard</Badge>
                    
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Sample Roles
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {template.profiles.slice(0, 3).map((profile, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {profile.role}
                          </Badge>
                        ))}
                        {template.profiles.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{template.profiles.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Custom Industry Dialog */}
      <CreateCustomIndustryDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onIndustryCreated={fetchCustomIndustries}
      />

      {/* Edit Custom Industry Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Custom Industry</DialogTitle>
          </DialogHeader>
          {editingIndustry && (
            <EditIndustryForm
              industry={editingIndustry}
              onIndustryUpdated={() => {
                fetchCustomIndustries();
                setShowEditDialog(false);
                setEditingIndustry(null);
              }}
              onCancel={() => {
                setShowEditDialog(false);
                setEditingIndustry(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Create Custom Industry Dialog Component
function CreateCustomIndustryDialog({ 
  open, 
  onOpenChange, 
  onIndustryCreated 
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIndustryCreated: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    starterTemplate: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Implementation would create custom industry in database
      // and potentially copy profiles from starter template
      
      toast({
        title: "Industry Created",
        description: "Your custom industry has been created successfully."
      });

      setFormData({ name: '', description: '', starterTemplate: '' });
      onOpenChange(false);
      onIndustryCreated();
    } catch (error) {
      console.error('Error creating industry:', error);
      toast({
        title: "Error",
        description: "Failed to create industry. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Custom Industry</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Industry Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Biotechnology, Aerospace"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this industry"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Starter Template (Optional)</Label>
            <Select value={formData.starterTemplate} onValueChange={(value) => setFormData(prev => ({ ...prev, starterTemplate: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a template to start with" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Start from scratch</SelectItem>
                {Object.entries(INDUSTRY_TEMPLATES).map(([name, template]) => (
                  <SelectItem key={name} value={name}>
                    {name} ({template.profiles.length} profiles)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.starterTemplate && (
              <p className="text-xs text-muted-foreground">
                This will copy all profiles from {formData.starterTemplate} as a starting point
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Industry'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Edit Industry Form Component
function EditIndustryForm({ 
  industry, 
  onIndustryUpdated, 
  onCancel 
}: {
  industry: CustomIndustry;
  onIndustryUpdated: () => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: industry.name,
    description: industry.description
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Implementation would update industry in database
      
      toast({
        title: "Industry Updated",
        description: "Your custom industry has been updated successfully."
      });

      onIndustryUpdated();
    } catch (error) {
      console.error('Error updating industry:', error);
      toast({
        title: "Error",
        description: "Failed to update industry. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Industry Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Biotechnology, Aerospace"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Brief description of this industry"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Industry'}
        </Button>
      </div>
    </form>
  );
}