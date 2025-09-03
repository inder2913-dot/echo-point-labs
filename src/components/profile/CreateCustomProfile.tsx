import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Cpu, Monitor, HardDrive } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateCustomProfileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProfileCreated: () => void;
}

const LEVELS = ['Staff', 'Support', 'Technical', 'Professional', 'Management', 'Executive'];
const INDUSTRIES = ['Healthcare', 'Manufacturing', 'Technology', 'Financial Services', 'Education', 'Government', 'Retail', 'Professional Services', 'Other'];
const CPU_OPTIONS = ['Core i3', 'Core i5', 'Core i7', 'Core i9', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9'];
const RAM_OPTIONS = ['4GB', '8GB', '16GB', '32GB', '64GB'];
const STORAGE_OPTIONS = ['128GB SSD', '256GB SSD', '512GB SSD', '1TB SSD', '2TB SSD', '1TB HDD', '2TB HDD'];

export function CreateCustomProfile({ open, onOpenChange, onProfileCreated }: CreateCustomProfileProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: '',
    department: '',
    level: '',
    industry: '',
    description: '',
    hardware_cpu: 'Core i5',
    hardware_ram: '8GB',
    hardware_storage: '256GB SSD'
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.role || !formData.department || !formData.level) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          role: formData.role,
          department: formData.department,
          level: formData.level,
          industry: formData.industry || null,
          description: formData.description || null,
          hardware_cpu: formData.hardware_cpu,
          hardware_ram: formData.hardware_ram,
          hardware_storage: formData.hardware_storage
        });

      if (error) throw error;

      toast({
        title: "Profile Created",
        description: "Your custom profile has been created successfully."
      });

      // Reset form
      setFormData({
        role: '',
        department: '',
        level: '',
        industry: '',
        description: '',
        hardware_cpu: 'Core i5',
        hardware_ram: '8GB',
        hardware_storage: '256GB SSD'
      });

      onProfileCreated();
      onOpenChange(false);

    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Custom Profile</DialogTitle>
          <DialogDescription>
            Define a new user profile with specific hardware requirements for your organization.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role Title *</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g., Senior Developer"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g., Engineering"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Level *</Label>
              <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map(industry => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the role and its responsibilities..."
              rows={3}
            />
          </div>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-4 flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Hardware Requirements
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Cpu className="h-3 w-3" />
                    CPU
                  </Label>
                  <Select value={formData.hardware_cpu} onValueChange={(value) => setFormData({ ...formData, hardware_cpu: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CPU_OPTIONS.map(cpu => (
                        <SelectItem key={cpu} value={cpu}>{cpu}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Monitor className="h-3 w-3" />
                    RAM
                  </Label>
                  <Select value={formData.hardware_ram} onValueChange={(value) => setFormData({ ...formData, hardware_ram: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RAM_OPTIONS.map(ram => (
                        <SelectItem key={ram} value={ram}>{ram}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <HardDrive className="h-3 w-3" />
                    Storage
                  </Label>
                  <Select value={formData.hardware_storage} onValueChange={(value) => setFormData({ ...formData, hardware_storage: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STORAGE_OPTIONS.map(storage => (
                        <SelectItem key={storage} value={storage}>{storage}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Profile
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}