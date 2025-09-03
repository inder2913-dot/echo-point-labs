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

const INDUSTRY_PROFILES = {
  retail: [
    {
      id: "store-manager",
      name: "Store Manager",
      description: "Store managers requiring robust systems for operations",
      criteria: ["Store Manager", "Assistant Manager", "Operations Manager"],
      baseline: {
        deviceType: "Desktop or Laptop",
        minRam: "16GB",
        minCpu: "Intel i5 / AMD Ryzen 5",
        minStorage: "512GB SSD",
        mobility: "Medium",
        specialRequirements: "Dual monitor support, POS integration"
      },
      color: "bg-purple-100 text-purple-800"
    },
    {
      id: "sales-associate",
      name: "Sales Associate",
      description: "Front-line sales staff with customer interaction needs",
      criteria: ["Sales Associate", "Cashier", "Sales Representative"],
      baseline: {
        deviceType: "Tablet or Desktop",
        minRam: "8GB",
        minCpu: "Intel i3 / AMD Ryzen 3",
        minStorage: "256GB SSD",
        mobility: "High",
        specialRequirements: "Touch screen, POS terminal access"
      },
      color: "bg-green-100 text-green-800"
    },
    {
      id: "inventory-specialist",
      name: "Inventory Specialist",
      description: "Warehouse and inventory management staff",
      criteria: ["Inventory Specialist", "Warehouse Manager", "Stock Clerk"],
      baseline: {
        deviceType: "Laptop or Tablet",
        minRam: "16GB",
        minCpu: "Intel i5 / AMD Ryzen 5",
        minStorage: "512GB SSD",
        mobility: "High",
        specialRequirements: "Barcode scanner integration, rugged design"
      },
      color: "bg-blue-100 text-blue-800"
    },
    {
      id: "customer-service",
      name: "Customer Service",
      description: "Customer support and service desk operations",
      criteria: ["Customer Service", "Support Representative", "Help Desk"],
      baseline: {
        deviceType: "Desktop",
        minRam: "8GB",
        minCpu: "Intel i3 / AMD Ryzen 3",
        minStorage: "256GB SSD",
        mobility: "Low",
        specialRequirements: "Headset support, CRM system access"
      },
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      id: "department-manager",
      name: "Department Manager",
      description: "Department heads overseeing specific retail areas",
      criteria: ["Department Manager", "Section Manager", "Area Manager"],
      baseline: {
        deviceType: "Laptop",
        minRam: "16GB",
        minCpu: "Intel i5 / AMD Ryzen 5",
        minStorage: "512GB SSD",
        mobility: "Medium",
        specialRequirements: "Mobile reporting, analytics software"
      },
      color: "bg-indigo-100 text-indigo-800"
    },
    {
      id: "visual-merchandiser",
      name: "Visual Merchandiser",
      description: "Design and layout specialists for store displays",
      criteria: ["Visual Merchandiser", "Display Coordinator", "Design Specialist"],
      baseline: {
        deviceType: "Laptop",
        minRam: "16GB",
        minCpu: "Intel i5 / AMD Ryzen 5",
        minStorage: "512GB SSD",
        mobility: "High",
        specialRequirements: "Graphics software, design tools"
      },
      color: "bg-pink-100 text-pink-800"
    },
    {
      id: "loss-prevention",
      name: "Loss Prevention",
      description: "Security and loss prevention specialists",
      criteria: ["Loss Prevention", "Security Officer", "Asset Protection"],
      baseline: {
        deviceType: "Laptop or Tablet",
        minRam: "8GB",
        minCpu: "Intel i3 / AMD Ryzen 3",
        minStorage: "256GB SSD",
        mobility: "High",
        specialRequirements: "Security software, mobile monitoring"
      },
      color: "bg-red-100 text-red-800"
    },
    {
      id: "buyer-merchandiser",
      name: "Buyer/Merchandiser",
      description: "Product buyers and merchandising professionals",
      criteria: ["Buyer", "Merchandiser", "Product Manager", "Procurement"],
      baseline: {
        deviceType: "Laptop",
        minRam: "16GB",
        minCpu: "Intel i5 / AMD Ryzen 5",
        minStorage: "512GB SSD",
        mobility: "Medium",
        specialRequirements: "Analytics software, vendor portals"
      },
      color: "bg-orange-100 text-orange-800"
    },
    {
      id: "cashier",
      name: "Cashier",
      description: "Point-of-sale operators and checkout staff",
      criteria: ["Cashier", "Checkout Operator", "POS Operator"],
      baseline: {
        deviceType: "Desktop or Tablet",
        minRam: "4GB",
        minCpu: "Intel i3 / AMD Ryzen 3",
        minStorage: "128GB SSD",
        mobility: "Low",
        specialRequirements: "POS system integration, receipt printers"
      },
      color: "bg-teal-100 text-teal-800"
    },
    {
      id: "district-manager",
      name: "District Manager",
      description: "Multi-store management and oversight",
      criteria: ["District Manager", "Regional Manager", "Area Director"],
      baseline: {
        deviceType: "Laptop",
        minRam: "32GB",
        minCpu: "Intel i7 / AMD Ryzen 7",
        minStorage: "1TB SSD",
        mobility: "High",
        specialRequirements: "Advanced analytics, VPN access, mobile office"
      },
      color: "bg-violet-100 text-violet-800"
    }
  ],
  manufacturing: [
    {
      id: "production-engineer",
      name: "Production Engineer",
      description: "Engineering staff requiring high-performance systems",
      criteria: ["Engineer", "Production Engineer", "Process Engineer"],
      baseline: {
        deviceType: "Laptop",
        minRam: "32GB",
        minCpu: "Intel i7 / AMD Ryzen 7",
        minStorage: "1TB SSD",
        mobility: "Medium",
        specialRequirements: "CAD software support, dedicated GPU"
      },
      color: "bg-red-100 text-red-800"
    },
    {
      id: "production-worker",
      name: "Production Worker",
      description: "Factory floor workers with basic computing needs",
      criteria: ["Production Worker", "Operator", "Technician"],
      baseline: {
        deviceType: "Desktop or Tablet",
        minRam: "8GB",
        minCpu: "Intel i3 / AMD Ryzen 3",
        minStorage: "256GB SSD",
        mobility: "Low",
        specialRequirements: "Industrial-grade, touch interface"
      },
      color: "bg-blue-100 text-blue-800"
    },
    {
      id: "quality-control",
      name: "Quality Control",
      description: "Quality assurance and testing personnel",
      criteria: ["Quality Control", "QA Technician", "Inspector"],
      baseline: {
        deviceType: "Laptop or Tablet",
        minRam: "16GB",
        minCpu: "Intel i5 / AMD Ryzen 5",
        minStorage: "512GB SSD",
        mobility: "High",
        specialRequirements: "Testing software, measurement tools integration"
      },
      color: "bg-green-100 text-green-800"
    },
    {
      id: "supervisor",
      name: "Supervisor",
      description: "Production supervisors and team leads",
      criteria: ["Supervisor", "Team Lead", "Production Manager"],
      baseline: {
        deviceType: "Laptop",
        minRam: "16GB",
        minCpu: "Intel i5 / AMD Ryzen 5",
        minStorage: "512GB SSD",
        mobility: "Medium",
        specialRequirements: "Management software, reporting tools"
      },
      color: "bg-purple-100 text-purple-800"
    }
  ],
  // Default generic profiles for other industries
  default: [
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
}

interface UserProfilingBaselinesProps {
  onComplete: (data: any) => void
  initialData: any
}

export function UserProfilingBaselines({ onComplete, initialData }: UserProfilingBaselinesProps) {
  // Get industry-specific profiles based on organization setup
  // The data structure should be: initialData.organizationType (from step 1)
  const selectedIndustry = (initialData?.organizationType || 'default').toLowerCase()
  const industryProfiles = INDUSTRY_PROFILES[selectedIndustry as keyof typeof INDUSTRY_PROFILES] || INDUSTRY_PROFILES.default
  
  const [userProfiles, setUserProfiles] = useState(industryProfiles)
  const [editingProfile, setEditingProfile] = useState<any>(null)
  const [userAssignments, setUserAssignments] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  console.log('Full InitialData:', JSON.stringify(initialData, null, 2))
  console.log('Organization Type:', initialData?.organizationType)
  console.log('Selected industry:', selectedIndustry)
  console.log('Available profiles:', Object.keys(INDUSTRY_PROFILES))
  console.log('Using profiles:', industryProfiles.map(p => p.name))

  console.log('Selected industry:', selectedIndustry)
  console.log('Using profiles:', industryProfiles)

  // Auto-assign users to profiles based on their department/role and industry
  const autoAssignUsers = () => {
    const employees = initialData.employeeData || []
    console.log('Auto-assigning users:', employees) // Debug log
    
    const assignments = employees.map((employee: any) => {
      let assignedProfile = userProfiles[0].id // default to first profile
      
      // Get department and role, handling various data structures
      const dept = (employee.department || employee.dept || employee.Department || "").toLowerCase()
      const role = (employee.role || employee.title || employee.job_title || employee.position || employee.Role || employee.Title || "").toLowerCase()
      
      console.log(`Employee: ${employee.name}, Dept: "${dept}", Role: "${role}"`) // Debug log
      
      // Industry-specific assignment logic
      if (selectedIndustry === 'retail') {
        // District/Regional Manager
        if (role.includes("district") || role.includes("regional") || role.includes("area director")) {
          assignedProfile = "district-manager"
        }
        // Store Manager (includes assistant managers)
        else if (
          (role.includes("store") && role.includes("manager")) ||
          role.includes("assistant store manager") ||
          (dept.includes("store") && dept.includes("management"))
        ) {
          assignedProfile = "store-manager"
        }
        // Department Manager
        else if (
          (role.includes("department") && role.includes("manager")) ||
          (role.includes("section") && role.includes("manager")) ||
          role.includes("area manager") ||
          (role.includes("manager") && (dept.includes("sales") || dept.includes("inventory") || dept.includes("customer")))
        ) {
          assignedProfile = "department-manager"
        }
        // Visual Merchandiser
        else if (
          role.includes("visual merchandiser") || role.includes("merchandiser") ||
          role.includes("display") || role.includes("product manager") ||
          dept.includes("merchandising") || dept.includes("visual")
        ) {
          assignedProfile = "visual-merchandiser"
        }
        // Loss Prevention
        else if (
          role.includes("loss prevention") || role.includes("security") ||
          role.includes("asset protection") || dept.includes("loss prevention")
        ) {
          assignedProfile = "loss-prevention"
        }
        // Buyer/Merchandiser
        else if (
          role.includes("buyer") || role.includes("procurement") ||
          (role.includes("specialist") && dept.includes("marketing"))
        ) {
          assignedProfile = "buyer-merchandiser"
        }
        // Cashier
        else if (
          role.includes("cashier") || role.includes("checkout") || 
          role.includes("pos operator")
        ) {
          assignedProfile = "cashier"
        }
        // Sales Associate
        else if (
          role.includes("sales") || role.includes("associate") ||
          dept.includes("sales") || role.includes("representative")
        ) {
          assignedProfile = "sales-associate"
        }
        // Inventory Specialist
        else if (
          role.includes("inventory") || role.includes("warehouse") || role.includes("stock") ||
          dept.includes("inventory") || dept.includes("warehouse")
        ) {
          assignedProfile = "inventory-specialist"
        }
        // Customer Service
        else if (
          role.includes("customer") || role.includes("support") || role.includes("service") ||
          dept.includes("customer") || dept.includes("support")
        ) {
          assignedProfile = "customer-service"
        }
        // Default for any manager not caught above
        else if (role.includes("manager") || role.includes("supervisor") || role.includes("lead")) {
          assignedProfile = "store-manager"
        }
      } else if (selectedIndustry === 'manufacturing') {
        if (
          role.includes("engineer") || role.includes("designer") || role.includes("developer") ||
          dept.includes("engineering") || dept.includes("design")
        ) {
          assignedProfile = "production-engineer"
        } else if (
          role.includes("operator") || role.includes("worker") || role.includes("technician") ||
          dept.includes("production") || dept.includes("manufacturing")
        ) {
          assignedProfile = "production-worker"
        } else if (
          role.includes("quality") || role.includes("inspector") || role.includes("qa") ||
          dept.includes("quality")
        ) {
          assignedProfile = "quality-control"
        } else if (
          role.includes("supervisor") || role.includes("manager") || role.includes("lead") ||
          dept.includes("management")
        ) {
          assignedProfile = "supervisor"
        }
      } else {
        // Default generic assignment logic
        if (
          // Engineering/Development
          dept.includes("engineering") || dept.includes("development") || dept.includes("tech") || dept.includes("it") ||
          role.includes("developer") || role.includes("engineer") || role.includes("architect") || 
          role.includes("programmer") || role.includes("software") || role.includes("technical")
        ) {
          assignedProfile = "power-user"
        } else if (
          // Sales/Marketing/Field workers
          dept.includes("sales") || dept.includes("marketing") || dept.includes("business") ||
          role.includes("sales") || role.includes("marketing") || role.includes("consultant") ||
          role.includes("representative") || role.includes("account") || role.includes("business")
        ) {
          assignedProfile = "mobile-user"
        } else if (
          // Support/Operations/Administrative
          dept.includes("support") || dept.includes("operations") || dept.includes("admin") ||
          dept.includes("hr") || dept.includes("finance") || dept.includes("customer") ||
          role.includes("support") || role.includes("service") || role.includes("clerk") ||
          role.includes("assistant") || role.includes("coordinator") || role.includes("admin")
        ) {
          assignedProfile = "task-worker"
        } else if (
          // Management/Analysis stays office worker
          role.includes("manager") || role.includes("director") || role.includes("analyst") ||
          role.includes("lead") || role.includes("supervisor") || role.includes("officer")
        ) {
          assignedProfile = "office-user"
        }
      }
      
      console.log(`Assigned ${employee.name} to ${assignedProfile}`) // Debug log
      
      return {
        ...employee,
        profileId: assignedProfile,
        profileName: userProfiles.find(p => p.id === assignedProfile)?.name || userProfiles[0].name
      }
    })
    
    console.log('Final assignments:', assignments) // Debug log
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