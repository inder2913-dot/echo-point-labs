import { useState, useEffect } from "react"
import { Settings, Edit, Check, Plus, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

const DEFAULT_PROFILES = [
  {
    name: "Power User",
    description: "High-performance users requiring premium hardware",
    baseline: {
      deviceType: "Laptop",
      ram: "32GB",
      cpu: "Intel i7 / AMD Ryzen 7",
      storage: "1TB SSD",
      graphics: "Dedicated",
      graphicsCapacity: "8GB"
    },
    color: "bg-red-100 text-red-800"
  },
  {
    name: "Mobile User", 
    description: "Users who work primarily on-the-go",
    baseline: {
      deviceType: "Laptop",
      ram: "16GB",
      cpu: "Intel i5 / AMD Ryzen 5", 
      storage: "512GB SSD",
      graphics: "Onboard",
      graphicsCapacity: null
    },
    color: "bg-blue-100 text-blue-800"
  },
  {
    name: "Office Worker",
    description: "Standard office productivity tasks", 
    baseline: {
      deviceType: "Desktop or Laptop",
      ram: "16GB",
      cpu: "Intel i5 / AMD Ryzen 5",
      storage: "256GB SSD", 
      graphics: "Onboard",
      graphicsCapacity: null
    },
    color: "bg-green-100 text-green-800"
  },
  {
    name: "Task Worker",
    description: "Basic computing needs for routine tasks",
    baseline: {
      deviceType: "Desktop",
      ram: "8GB", 
      cpu: "Intel i3 / AMD Ryzen 3",
      storage: "256GB SSD",
      graphics: "Onboard",
      graphicsCapacity: null
    },
    color: "bg-yellow-100 text-yellow-800"
  }
]

function CreateBaselineForm({ onSave, onCancel }: any) {
  const [newProfile, setNewProfile] = useState({
    name: '',
    description: '',
    department: 'General',
    level: 'Standard',
    industry: 'Technology',
    baseline: {
      deviceType: "Laptop",
      ram: "16GB",
      cpu: "Intel i5 / AMD Ryzen 5",
      storage: "512GB SSD",
      graphics: "Onboard",
      graphicsCapacity: null
    }
  })

  const handleSave = () => {
    if (!newProfile.name.trim()) {
      toast.error('Profile name is required')
      return
    }
    onSave(newProfile)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Profile Name</Label>
        <Input
          value={newProfile.name}
          onChange={(e) => setNewProfile(prev => ({
            ...prev,
            name: e.target.value
          }))}
          placeholder="e.g., CAD Designer, Data Analyst"
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Input
          value={newProfile.description}
          onChange={(e) => setNewProfile(prev => ({
            ...prev,
            description: e.target.value
          }))}
          placeholder="Brief description of this profile"
        />
      </div>

      <div className="space-y-2">
        <Label>Department</Label>
        <Input
          value={newProfile.department}
          onChange={(e) => setNewProfile(prev => ({
            ...prev,
            department: e.target.value
          }))}
          placeholder="e.g., Engineering, Marketing"
        />
      </div>

      <div className="space-y-2">
        <Label>Level</Label>
        <Select 
          value={newProfile.level} 
          onValueChange={(value) => setNewProfile(prev => ({
            ...prev,
            level: value
          }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-background border shadow-lg z-50">
            <SelectItem value="Entry">Entry</SelectItem>
            <SelectItem value="Junior">Junior</SelectItem>
            <SelectItem value="Standard">Standard</SelectItem>
            <SelectItem value="Senior">Senior</SelectItem>
            <SelectItem value="Executive">Executive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>RAM</Label>
        <Select 
          value={newProfile.baseline.ram} 
          onValueChange={(value) => setNewProfile(prev => ({
            ...prev,
            baseline: { ...prev.baseline, ram: value }
          }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-background border shadow-lg z-50">
            <SelectItem value="8GB">8GB</SelectItem>
            <SelectItem value="16GB">16GB</SelectItem>
            <SelectItem value="32GB">32GB</SelectItem>
            <SelectItem value="64GB">64GB</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>CPU</Label>
        <Input
          value={newProfile.baseline.cpu}
          onChange={(e) => setNewProfile(prev => ({
            ...prev,
            baseline: { ...prev.baseline, cpu: e.target.value }
          }))}
        />
      </div>

      <div className="space-y-2">
        <Label>Storage</Label>
        <Select 
          value={newProfile.baseline.storage} 
          onValueChange={(value) => setNewProfile(prev => ({
            ...prev,
            baseline: { ...prev.baseline, storage: value }
          }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-background border shadow-lg z-50">
            <SelectItem value="256GB SSD">256GB SSD</SelectItem>
            <SelectItem value="512GB SSD">512GB SSD</SelectItem>
            <SelectItem value="1TB SSD">1TB SSD</SelectItem>
            <SelectItem value="2TB SSD">2TB SSD</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Graphics</Label>
        <Select 
          value={newProfile.baseline.graphics} 
          onValueChange={(value) => setNewProfile(prev => ({
            ...prev,
            baseline: { 
              ...prev.baseline, 
              graphics: value,
              graphicsCapacity: value === "Onboard" ? null : prev.baseline.graphicsCapacity
            }
          }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-background border shadow-lg z-50">
            <SelectItem value="Onboard">Onboard</SelectItem>
            <SelectItem value="Dedicated">Dedicated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {newProfile.baseline.graphics === "Dedicated" && (
        <div className="space-y-2">
          <Label>Graphics Capacity</Label>
          <Select 
            value={newProfile.baseline.graphicsCapacity || ""} 
            onValueChange={(value) => setNewProfile(prev => ({
              ...prev,
              baseline: { ...prev.baseline, graphicsCapacity: value }
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select capacity" />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              <SelectItem value="2GB">2GB</SelectItem>
              <SelectItem value="4GB">4GB</SelectItem>
              <SelectItem value="6GB">6GB</SelectItem>
              <SelectItem value="8GB">8GB</SelectItem>
              <SelectItem value="16GB">16GB</SelectItem>
              <SelectItem value="24GB">24GB</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Plus className="w-4 h-4 mr-2" />
          Create Baseline
        </Button>
      </div>
    </div>
  )
}

export default function Baselines() {
  const [userProfiles, setUserProfiles] = useState<any[]>([])
  const [customBaselines, setCustomBaselines] = useState<any[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<any[]>([])
  const [filteredCustomBaselines, setFilteredCustomBaselines] = useState<any[]>([])
  const [editingProfile, setEditingProfile] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // Filter states
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [industryFilter, setIndustryFilter] = useState<string>("all")
  const [graphicsFilter, setGraphicsFilter] = useState<string>("all")
  const [cpuFilter, setCpuFilter] = useState<string>("all")
  const [ramFilter, setRamFilter] = useState<string>("all")
  const [storageFilter, setStorageFilter] = useState<string>("all")

  useEffect(() => {
    loadUserProfiles()
  }, [])

  const loadUserProfiles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      // Load built-in baselines (is_custom = false)
      const { data: builtInProfiles, error: builtInError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('is_custom', false)
        .order('role', { ascending: true })

      if (builtInError) throw builtInError

      // Load custom baselines (is_custom = true, baseline_id = null, user_id = current user)
      const { data: customBaselines, error: customError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('is_custom', true)
        .is('baseline_id', null)
        .eq('user_id', user?.id || '')
        .order('role', { ascending: true })

      if (customError) throw customError

      // Transform built-in profiles
      const builtInTransformed = (builtInProfiles || []).map(profile => ({
        id: profile.id,
        name: profile.role,
        description: profile.description || `${profile.level} ${profile.role} in ${profile.department}`,
        baseline: {
          deviceType: "Laptop", // Default
          ram: profile.hardware_ram,
          cpu: profile.hardware_cpu,
          storage: profile.hardware_storage,
          graphics: profile.hardware_graphics,
          graphicsCapacity: profile.hardware_graphics_capacity
        },
        color: "bg-blue-100 text-blue-800",
        isCustom: false,
        level: profile.level,
        department: profile.department
      }))

      // Transform custom baselines
      const customTransformed = (customBaselines || []).map(profile => ({
        id: profile.id,
        name: profile.role,
        description: profile.description || `${profile.level} ${profile.role} in ${profile.department}`,
        baseline: {
          deviceType: "Laptop", // Default
          ram: profile.hardware_ram,
          cpu: profile.hardware_cpu,
          storage: profile.hardware_storage,
          graphics: profile.hardware_graphics,
          graphicsCapacity: profile.hardware_graphics_capacity
        },
        color: "bg-purple-100 text-purple-800",
        isCustom: true,
        level: profile.level,
        department: profile.department
      }))

      setCustomBaselines(customTransformed)
      setUserProfiles(builtInTransformed)
      setFilteredCustomBaselines(customTransformed)
      setFilteredProfiles(builtInTransformed)
    } catch (error) {
      console.error('Error loading profiles:', error)
      toast.error('Failed to load user profiles')
      // Fall back to default profiles
      setUserProfiles(DEFAULT_PROFILES)
      setFilteredProfiles(DEFAULT_PROFILES)
      setCustomBaselines([])
      setFilteredCustomBaselines([])
    } finally {
      setLoading(false)
    }
  }

  // Filter profiles based on selected filters
  useEffect(() => {
    // Filter built-in profiles
    let filteredBuiltIn = userProfiles

    if (departmentFilter && departmentFilter !== "all") {
      filteredBuiltIn = filteredBuiltIn.filter(profile => profile.department === departmentFilter)
    }
    if (levelFilter && levelFilter !== "all") {
      filteredBuiltIn = filteredBuiltIn.filter(profile => profile.level === levelFilter)
    }
    if (industryFilter && industryFilter !== "all") {
      filteredBuiltIn = filteredBuiltIn.filter(profile => profile.industry === industryFilter)
    }
    if (graphicsFilter && graphicsFilter !== "all") {
      filteredBuiltIn = filteredBuiltIn.filter(profile => profile.baseline.graphics === graphicsFilter)
    }
    if (cpuFilter && cpuFilter !== "all") {
      filteredBuiltIn = filteredBuiltIn.filter(profile => profile.baseline.cpu === cpuFilter)
    }
    if (ramFilter && ramFilter !== "all") {
      filteredBuiltIn = filteredBuiltIn.filter(profile => profile.baseline.ram === ramFilter)
    }
    if (storageFilter && storageFilter !== "all") {
      filteredBuiltIn = filteredBuiltIn.filter(profile => profile.baseline.storage === storageFilter)
    }

    // Filter custom baselines
    let filteredCustom = customBaselines

    if (departmentFilter && departmentFilter !== "all") {
      filteredCustom = filteredCustom.filter(profile => profile.department === departmentFilter)
    }
    if (levelFilter && levelFilter !== "all") {
      filteredCustom = filteredCustom.filter(profile => profile.level === levelFilter)
    }
    if (industryFilter && industryFilter !== "all") {
      filteredCustom = filteredCustom.filter(profile => profile.industry === industryFilter)
    }
    if (graphicsFilter && graphicsFilter !== "all") {
      filteredCustom = filteredCustom.filter(profile => profile.baseline.graphics === graphicsFilter)
    }
    if (cpuFilter && cpuFilter !== "all") {
      filteredCustom = filteredCustom.filter(profile => profile.baseline.cpu === cpuFilter)
    }
    if (ramFilter && ramFilter !== "all") {
      filteredCustom = filteredCustom.filter(profile => profile.baseline.ram === ramFilter)
    }
    if (storageFilter && storageFilter !== "all") {
      filteredCustom = filteredCustom.filter(profile => profile.baseline.storage === storageFilter)
    }

    setFilteredProfiles(filteredBuiltIn)
    setFilteredCustomBaselines(filteredCustom)
  }, [userProfiles, customBaselines, departmentFilter, levelFilter, industryFilter, graphicsFilter, cpuFilter, ramFilter, storageFilter])

  // Get unique values for filter options (combining both arrays)
  const allProfiles = [...customBaselines, ...userProfiles]
  const departments = [...new Set(allProfiles.map(p => p.department).filter(Boolean))]
  const levels = [...new Set(allProfiles.map(p => p.level).filter(Boolean))]
  const industries = [...new Set(allProfiles.map(p => p.industry).filter(Boolean))]
  const graphicsOptions = [...new Set(allProfiles.map(p => p.baseline.graphics).filter(Boolean))]
  const cpuOptions = [...new Set(allProfiles.map(p => p.baseline.cpu).filter(Boolean))]
  const ramOptions = [...new Set(allProfiles.map(p => p.baseline.ram).filter(Boolean))]
  const storageOptions = [...new Set(allProfiles.map(p => p.baseline.storage).filter(Boolean))]

  const clearFilters = () => {
    setDepartmentFilter("all")
    setLevelFilter("all")
    setIndustryFilter("all")
    setGraphicsFilter("all")
    setCpuFilter("all")
    setRamFilter("all")
    setStorageFilter("all")
  }

  const updateProfile = async (updatedProfile: any) => {
    try {
      if (updatedProfile.isCustom) {
        // Update custom profile in database
        const { error } = await supabase
          .from('user_profiles')
          .update({
            hardware_ram: updatedProfile.baseline.ram,
            hardware_cpu: updatedProfile.baseline.cpu,
            hardware_storage: updatedProfile.baseline.storage,
            hardware_graphics: updatedProfile.baseline.graphics,
            hardware_graphics_capacity: updatedProfile.baseline.graphicsCapacity
          })
          .eq('id', updatedProfile.id)

        if (error) throw error
        toast.success('Custom baseline updated successfully')

        // Update in custom baselines array
        setCustomBaselines(prev => 
          prev.map(profile => 
            profile.id === updatedProfile.id 
              ? updatedProfile 
              : profile
          )
        )
      } else {
        toast.success('Default profile baseline updated')
        
        // Update in built-in profiles array
        setUserProfiles(prev => 
          prev.map(profile => 
            profile.id === updatedProfile.id || profile.name === updatedProfile.name 
              ? updatedProfile 
              : profile
          )
        )
      }

      setEditingProfile(null)
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  }

  const createProfile = async (newProfile: any) => {
    try {
      const { data: currentUser } = await supabase.auth.getUser()
      if (!currentUser.user) {
        throw new Error('User not authenticated')
      }

      const { data: createdProfile, error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: currentUser.user.id,
          role: newProfile.name,
          description: newProfile.description,
          department: newProfile.department || 'General',
          level: newProfile.level || 'Standard',
          industry: newProfile.industry || 'Technology',
          hardware_ram: newProfile.baseline.ram,
          hardware_cpu: newProfile.baseline.cpu,
          hardware_storage: newProfile.baseline.storage,
          hardware_graphics: newProfile.baseline.graphics,
          hardware_graphics_capacity: newProfile.baseline.graphicsCapacity,
          is_custom: true,
          baseline_id: null // This makes it a custom baseline, not a custom profile
        })
        .select()
        .single()

      if (error) throw error
      
      // Create the profile object in the same format as the existing ones
      const profileToAdd = {
        id: createdProfile.id,
        name: createdProfile.role,
        description: createdProfile.description || `${createdProfile.level} ${createdProfile.role} in ${createdProfile.department}`,
        baseline: {
          deviceType: "Laptop", // Default
          ram: createdProfile.hardware_ram,
          cpu: createdProfile.hardware_cpu,
          storage: createdProfile.hardware_storage,
          graphics: createdProfile.hardware_graphics,
          graphicsCapacity: createdProfile.hardware_graphics_capacity
        },
        color: "bg-purple-100 text-purple-800",
        isCustom: true,
        level: createdProfile.level,
        department: createdProfile.department
      }

      setCustomBaselines(prev => [...prev, profileToAdd])
      setIsCreateDialogOpen(false)
      toast.success('Custom baseline created successfully')
    } catch (error) {
      console.error('Error creating profile:', error)
      toast.error('Failed to create baseline')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Device Baselines</h1>
          <p className="text-muted-foreground">Manage hardware baselines for all user profiles ({filteredCustomBaselines.length + filteredProfiles.length} of {customBaselines.length + userProfiles.length})</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Baseline
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Baseline</DialogTitle>
            </DialogHeader>
            <CreateBaselineForm 
              onSave={createProfile}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters Section */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4" />
          <h3 className="font-medium">Filters</h3>
          <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto">
            Clear All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          <div className="space-y-2">
            <Label>Department</Label>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Level</Label>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="all">All Levels</SelectItem>
                {levels.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Industry</Label>
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All Industries" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map(industry => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Graphics</Label>
            <Select value={graphicsFilter} onValueChange={setGraphicsFilter}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All Graphics" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="all">All Graphics</SelectItem>
                {graphicsOptions.map(graphics => (
                  <SelectItem key={graphics} value={graphics}>{graphics}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>CPU</Label>
            <Select value={cpuFilter} onValueChange={setCpuFilter}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All CPUs" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="all">All CPUs</SelectItem>
                {cpuOptions.map(cpu => (
                  <SelectItem key={cpu} value={cpu}>{cpu}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>RAM</Label>
            <Select value={ramFilter} onValueChange={setRamFilter}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All RAM" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="all">All RAM</SelectItem>
                {ramOptions.map(ram => (
                  <SelectItem key={ram} value={ram}>{ram}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Storage</Label>
            <Select value={storageFilter} onValueChange={setStorageFilter}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All Storage" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="all">All Storage</SelectItem>
                {storageOptions.map(storage => (
                  <SelectItem key={storage} value={storage}>{storage}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Custom Baselines Section */}
      {filteredCustomBaselines.length > 0 && (
        <>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-primary mb-2">Your Custom Baselines</h2>
            <p className="text-sm text-muted-foreground">Baselines you've created for your organization</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredCustomBaselines.map((profile, index) => (
              <Card key={profile.id || index} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <Badge className={profile.color}>
                        {profile.name}
                      </Badge>
                      <Badge variant="secondary">Custom</Badge>
                    </div>
                    <Dialog open={isDialogOpen && editingProfile?.name === profile.name} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setEditingProfile(profile)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit Baseline: {profile.name}</DialogTitle>
                        </DialogHeader>
                        <BaselineEditor 
                          profile={profile} 
                          onSave={updateProfile}
                          onCancel={() => {
                            setEditingProfile(null)
                            setIsDialogOpen(false)
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                  <CardTitle className="text-lg">{profile.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{profile.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Device Type</span>
                      <span className="text-sm text-muted-foreground">{profile.baseline.deviceType}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">RAM</span>
                      <span className="text-sm text-muted-foreground">{profile.baseline.ram}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">CPU</span>
                      <span className="text-sm text-muted-foreground">{profile.baseline.cpu}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Storage</span>
                      <span className="text-sm text-muted-foreground">{profile.baseline.storage}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Graphics</span>
                      <span className="text-sm text-muted-foreground">
                        {profile.baseline.graphics}
                        {profile.baseline.graphicsCapacity && ` (${profile.baseline.graphicsCapacity})`}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Built-in Baselines Section */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-primary mb-2">Built-in Baselines</h2>
        <p className="text-sm text-muted-foreground">Standard job role baselines</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfiles.map((profile, index) => (
          <Card key={profile.id || index} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Badge className={profile.color}>
                    {profile.name}
                  </Badge>
                </div>
                <Dialog open={isDialogOpen && editingProfile?.name === profile.name} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setEditingProfile(profile)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Baseline: {profile.name}</DialogTitle>
                    </DialogHeader>
                    <BaselineEditor 
                      profile={profile} 
                      onSave={updateProfile}
                      onCancel={() => {
                        setEditingProfile(null)
                        setIsDialogOpen(false)
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              <CardTitle className="text-lg">{profile.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{profile.description}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Device Type</span>
                  <span className="text-sm text-muted-foreground">{profile.baseline.deviceType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">RAM</span>
                  <span className="text-sm text-muted-foreground">{profile.baseline.ram}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">CPU</span>
                  <span className="text-sm text-muted-foreground">{profile.baseline.cpu}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Storage</span>
                  <span className="text-sm text-muted-foreground">{profile.baseline.storage}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Graphics</span>
                  <span className="text-sm text-muted-foreground">
                    {profile.baseline.graphics}
                    {profile.baseline.graphicsCapacity && ` (${profile.baseline.graphicsCapacity})`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function BaselineEditor({ profile, onSave, onCancel }: any) {
  const [editedProfile, setEditedProfile] = useState(profile)

  const handleSave = () => {
    onSave(editedProfile)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Device Type</Label>
        <Select 
          value={editedProfile.baseline.deviceType} 
          onValueChange={(value) => setEditedProfile(prev => ({
            ...prev,
            baseline: { ...prev.baseline, deviceType: value }
          }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              <SelectItem value="Desktop">Desktop</SelectItem>
              <SelectItem value="Laptop">Laptop</SelectItem>
              <SelectItem value="Desktop or Laptop">Desktop or Laptop</SelectItem>
            </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>RAM</Label>
        <Select 
          value={editedProfile.baseline.ram} 
          onValueChange={(value) => setEditedProfile(prev => ({
            ...prev,
            baseline: { ...prev.baseline, ram: value }
          }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-background border shadow-lg z-50">
            <SelectItem value="8GB">8GB</SelectItem>
            <SelectItem value="16GB">16GB</SelectItem>
            <SelectItem value="32GB">32GB</SelectItem>
            <SelectItem value="64GB">64GB</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>CPU</Label>
        <Input
          value={editedProfile.baseline.cpu}
          onChange={(e) => setEditedProfile(prev => ({
            ...prev,
            baseline: { ...prev.baseline, cpu: e.target.value }
          }))}
        />
      </div>

      <div className="space-y-2">
        <Label>Storage</Label>
        <Select 
          value={editedProfile.baseline.storage} 
          onValueChange={(value) => setEditedProfile(prev => ({
            ...prev,
            baseline: { ...prev.baseline, storage: value }
          }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-background border shadow-lg z-50">
            <SelectItem value="256GB SSD">256GB SSD</SelectItem>
            <SelectItem value="512GB SSD">512GB SSD</SelectItem>
            <SelectItem value="1TB SSD">1TB SSD</SelectItem>
            <SelectItem value="2TB SSD">2TB SSD</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Graphics</Label>
        <Select 
          value={editedProfile.baseline.graphics} 
          onValueChange={(value) => setEditedProfile(prev => ({
            ...prev,
            baseline: { 
              ...prev.baseline, 
              graphics: value,
              graphicsCapacity: value === "Onboard" ? null : prev.baseline.graphicsCapacity
            }
          }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-background border shadow-lg z-50">
            <SelectItem value="Onboard">Onboard</SelectItem>
            <SelectItem value="Dedicated">Dedicated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {editedProfile.baseline.graphics === "Dedicated" && (
        <div className="space-y-2">
          <Label>Graphics Capacity</Label>
          <Select 
            value={editedProfile.baseline.graphicsCapacity || ""} 
            onValueChange={(value) => setEditedProfile(prev => ({
              ...prev,
              baseline: { ...prev.baseline, graphicsCapacity: value }
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select capacity" />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              <SelectItem value="2GB">2GB</SelectItem>
              <SelectItem value="4GB">4GB</SelectItem>
              <SelectItem value="6GB">6GB</SelectItem>
              <SelectItem value="8GB">8GB</SelectItem>
              <SelectItem value="16GB">16GB</SelectItem>
              <SelectItem value="24GB">24GB</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Check className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}