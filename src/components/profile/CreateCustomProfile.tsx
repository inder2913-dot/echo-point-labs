import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Cpu, Monitor, HardDrive, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateCustomProfileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProfileCreated: () => void;
}

const LEVELS = ['Staff', 'Support', 'Technical', 'Professional', 'Management', 'Executive'];

interface Baseline {
  id: string;
  role: string;
  hardware_cpu: string;
  hardware_ram: string;
  hardware_storage: string;
  hardware_graphics: string;
  hardware_graphics_capacity?: string;
  department: string;
  level: string;
}

export function CreateCustomProfile({ open, onOpenChange, onProfileCreated }: CreateCustomProfileProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [baselines, setBaselines] = useState<Baseline[]>([]);
  const [selectedBaseline, setSelectedBaseline] = useState<Baseline | null>(null);
  const [formData, setFormData] = useState({
    role: '',
    department: '',
    level: '',
    industry: '',
    description: '',
    baseline_id: ''
  });
  const { toast } = useToast();

  // Fetch available baselines
  const fetchBaselines = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, role, hardware_cpu, hardware_ram, hardware_storage, hardware_graphics, hardware_graphics_capacity, department, level, is_custom')
        .or(`is_custom.eq.false,and(is_custom.eq.true,baseline_id.is.null,user_id.eq.${user?.id || 'null'})`)
        .order('role', { ascending: true });

      if (error) throw error;
      setBaselines(data || []);
    } catch (error) {
      console.error('Error fetching baselines:', error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchBaselines();
    }
  }, [open]);

  const handleBaselineSelect = (baselineId: string) => {
    const baseline = baselines.find(b => b.id === baselineId);
    setSelectedBaseline(baseline || null);
    setFormData({ ...formData, baseline_id: baselineId });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.role || !formData.department || !formData.level || !formData.baseline_id) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including selecting a baseline.",
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
          baseline_id: formData.baseline_id,
          is_custom: true
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
        baseline_id: ''
      });
      setSelectedBaseline(null);

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
            Define a new user profile and attach a baseline hardware configuration for your organization.
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
              <Label htmlFor="industry">Custom Industry</Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="e.g., Custom Manufacturing, My Organization"
              />
              <p className="text-sm text-muted-foreground">
                Optional custom industry category for your profile.
              </p>
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

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Hardware Baseline *</Label>
              <Select value={formData.baseline_id} onValueChange={handleBaselineSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a hardware baseline" />
                </SelectTrigger>
                <SelectContent>
                  {baselines.map(baseline => (
                    <SelectItem key={baseline.id} value={baseline.id}>
                      {baseline.role} ({baseline.level} - {baseline.department})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedBaseline && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Monitor className="h-4 w-4" />
                    <h4 className="font-medium">Selected Baseline Hardware</h4>
                    <Badge variant="outline">{selectedBaseline.role}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">CPU:</span>
                      <span>{selectedBaseline.hardware_cpu}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Monitor className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">RAM:</span>
                      <span>{selectedBaseline.hardware_ram}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Storage:</span>
                      <span>{selectedBaseline.hardware_storage}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Zap className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Graphics:</span>
                      <span>
                        {selectedBaseline.hardware_graphics}
                        {selectedBaseline.hardware_graphics_capacity && ` (${selectedBaseline.hardware_graphics_capacity})`}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

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