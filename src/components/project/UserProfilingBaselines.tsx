import { useState } from "react"
import { Users, Target, Settings, Plus, Edit, Check } from "lucide-react"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const DEFAULT_PROFILES = [
  {
    id: "power-user",
    name: "Power User",
    description: "High-performance users requiring premium hardware",
    criteria: ["Engineering", "Design", "Video Production"],
    baseline: {
      deviceType: "Laptop",
      minRam: "32GB",
      minCpu: "Intel i7 / AMD Ryzen 7",
      minStorage: "1TB SSD",
      mobility: "High",
      specialRequirements: "Dedicated GPU"
    },
    color: "bg-red-100 text-red-800"
  },
  {
    id: "mobile-user",
    name: "Mobile User",
    description: "Users who work primarily on-the-go",
    criteria: ["Sales", "Consulting", "Field Service"],
    baseline: {
      deviceType: "Laptop",
      minRam: "16GB",
      minCpu: "Intel i5 / AMD Ryzen 5",
      minStorage: "512GB SSD",
      mobility: "High",
      specialRequirements: "Long battery life, lightweight"
    },
    color: "bg-blue-100 text-blue-800"
  },
  {
    id: "office-user",
    name: "Office Worker",
    description: "Standard office productivity tasks",
    criteria: ["HR", "Finance", "Administration"],
    baseline: {
      deviceType: "Desktop or Laptop",
      minRam: "16GB",
      minCpu: "Intel i5 / AMD Ryzen 5",
      minStorage: "256GB SSD",
      mobility: "Low",
      specialRequirements: "Dual monitor support"
    },
    color: "bg-green-100 text-green-800"
  },
  {
    id: "task-worker",
    name: "Task Worker",
    description: "Basic computing needs for routine tasks",
    criteria: ["Customer Service", "Data Entry", "Reception"],
    baseline: {
      deviceType: "Desktop",
      minRam: "8GB",
      minCpu: "Intel i3 / AMD Ryzen 3",
      minStorage: "256GB SSD",
      mobility: "Low",
      specialRequirements: "Basic peripherals"
    },
    color: "bg-yellow-100 text-yellow-800"
  }
]

interface UserProfilingBaselinesProps {
  onComplete: (data: any) => void
  initialData: any
}

export function UserProfilingBaselines({ onComplete, initialData }: UserProfilingBaselinesProps) {
  const [userProfiles, setUserProfiles] = useState(DEFAULT_PROFILES)
  const [editingProfile, setEditingProfile] = useState<any>(null)
  const [userAssignments, setUserAssignments] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Auto-assign users to profiles based on their department/role
  const autoAssignUsers = () => {
    const employees = initialData.employeeData || []
    const assignments = employees.map((employee: any) => {
      let assignedProfile = "office-user" // default
      
      // Simple rule-based assignment based on department/role
      const dept = employee.department?.toLowerCase() || ""
      const role = employee.role?.toLowerCase() || ""
      
      if (dept.includes("engineering") || dept.includes("development") || role.includes("developer")) {
        assignedProfile = "power-user"
      } else if (dept.includes("sales") || dept.includes("marketing") || role.includes("sales")) {
        assignedProfile = "mobile-user"
      } else if (role.includes("manager") || role.includes("analyst")) {
        assignedProfile = "office-user"
      } else if (role.includes("support") || role.includes("service")) {
        assignedProfile = "task-worker"
      }
      
      return {
        ...employee,
        profileId: assignedProfile,
        profileName: userProfiles.find(p => p.id === assignedProfile)?.name || "Office Worker"
      }
    })
    
    setUserAssignments(assignments)
  }

  const updateProfile = (updatedProfile: any) => {
    setUserProfiles(prev => 
      prev.map(profile => 
        profile.id === updatedProfile.id ? updatedProfile : profile
      )
    )
    setEditingProfile(null)
    setIsDialogOpen(false)
  }

  const handleContinue = () => {
    onComplete({
      userProfiles: userProfiles,
      baselines: userProfiles.reduce((acc, profile) => ({
        ...acc,
        [profile.id]: profile.baseline
      }), {}),
      userAssignments: userAssignments
    })
  }

  const getProfileStats = (profileId: string) => {
    return userAssignments.filter(user => user.profileId === profileId).length
  }

  return (
    <div className="space-y-6">
      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              User Profiles & Baselines
            </CardTitle>
            <Button onClick={autoAssignUsers} variant="outline">
              <Target className="w-4 h-4 mr-2" />
              Auto-Assign Users
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {userProfiles.map((profile) => (
              <Card key={profile.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={profile.color}>
                      {profile.name}
                    </Badge>
                    <Dialog open={isDialogOpen && editingProfile?.id === profile.id} onOpenChange={setIsDialogOpen}>
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
                          <DialogTitle>Edit Profile: {profile.name}</DialogTitle>
                        </DialogHeader>
                        <ProfileEditor 
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
                  
                  <p className="text-sm text-muted-foreground mb-3">{profile.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Assigned Users</span>
                      <span className="font-medium">{getProfileStats(profile.id)}</span>
                    </div>
                    <div className="text-xs">
                      <p><strong>Device:</strong> {profile.baseline.deviceType}</p>
                      <p><strong>RAM:</strong> {profile.baseline.minRam}</p>
                      <p><strong>CPU:</strong> {profile.baseline.minCpu}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Assignments Preview */}
      {userAssignments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              User Profile Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Assigned Profile</TableHead>
                  <TableHead>Device Baseline</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userAssignments.slice(0, 5).map((user, index) => {
                  const profile = userProfiles.find(p => p.id === user.profileId)
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Badge className={profile?.color}>
                          {user.profileName}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        <p>{profile?.baseline.deviceType}</p>
                        <p>{profile?.baseline.minRam} RAM</p>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            
            {userAssignments.length > 5 && (
              <p className="text-sm text-muted-foreground text-center mt-4">
                ... and {userAssignments.length - 5} more user assignments
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Continue Button */}
      {userAssignments.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={handleContinue}>
            Continue to Device Analysis
          </Button>
        </div>
      )}
    </div>
  )
}

function ProfileEditor({ profile, onSave, onCancel }: any) {
  const [editedProfile, setEditedProfile] = useState(profile)

  const handleSave = () => {
    onSave(editedProfile)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Minimum RAM</Label>
        <Select 
          value={editedProfile.baseline.minRam} 
          onValueChange={(value) => setEditedProfile(prev => ({
            ...prev,
            baseline: { ...prev.baseline, minRam: value }
          }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="8GB">8GB</SelectItem>
            <SelectItem value="16GB">16GB</SelectItem>
            <SelectItem value="32GB">32GB</SelectItem>
            <SelectItem value="64GB">64GB</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Minimum CPU</Label>
        <Input
          value={editedProfile.baseline.minCpu}
          onChange={(e) => setEditedProfile(prev => ({
            ...prev,
            baseline: { ...prev.baseline, minCpu: e.target.value }
          }))}
        />
      </div>

      <div className="space-y-2">
        <Label>Minimum Storage</Label>
        <Select 
          value={editedProfile.baseline.minStorage} 
          onValueChange={(value) => setEditedProfile(prev => ({
            ...prev,
            baseline: { ...prev.baseline, minStorage: value }
          }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="256GB SSD">256GB SSD</SelectItem>
            <SelectItem value="512GB SSD">512GB SSD</SelectItem>
            <SelectItem value="1TB SSD">1TB SSD</SelectItem>
            <SelectItem value="2TB SSD">2TB SSD</SelectItem>
          </SelectContent>
        </Select>
      </div>

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