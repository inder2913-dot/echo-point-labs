import { useState } from "react"
import { Building2, Users, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface OrganizationSetupProps {
  onComplete: (data: any) => void
  initialData: any
}

export function OrganizationSetup({ onComplete, initialData }: OrganizationSetupProps) {
  const [formData, setFormData] = useState({
    projectName: initialData.projectName || "",
    organizationType: initialData.organizationType || "",
    companySize: initialData.companySize || "",
    description: initialData.description || ""
  })

  const organizationTypes = [
    "Healthcare",
    "Financial Services", 
    "Technology",
    "Manufacturing",
    "Education",
    "Government",
    "Retail",
    "Professional Services",
    "Non-Profit",
    "Other"
  ]

  const companySizes = [
    "1-50 employees",
    "51-200 employees", 
    "201-1000 employees",
    "1001-5000 employees",
    "5000+ employees"
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.projectName || !formData.organizationType) {
      return
    }
    
    onComplete({
      projectName: formData.projectName,
      organizationType: formData.organizationType,
      companySize: formData.companySize,
      description: formData.description
    })
  }

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const isFormValid = formData.projectName && formData.organizationType

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Project & Organization Setup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name *</Label>
              <Input
                id="projectName"
                placeholder="Enter a name for this project (e.g., 'Q4 2024 Device Optimization')"
                value={formData.projectName}
                onChange={(e) => updateFormData("projectName", e.target.value)}
                required
              />
            </div>

            {/* Organization Type */}
            <div className="space-y-2">
              <Label htmlFor="organizationType">Organization Type *</Label>
              <Select 
                value={formData.organizationType} 
                onValueChange={(value) => updateFormData("organizationType", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select organization type" />
                </SelectTrigger>
                <SelectContent>
                  {organizationTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Company Size */}
            <div className="space-y-2">
              <Label htmlFor="companySize">Company Size</Label>
              <Select 
                value={formData.companySize} 
                onValueChange={(value) => updateFormData("companySize", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  {companySizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the goals and scope of this analysis project..."
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full md:w-auto"
              disabled={!isFormValid}
            >
              Continue to Employee Data
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-medium text-blue-900">Employee Profiling</h3>
                <p className="text-sm text-blue-700">Create user profiles based on roles and departments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-medium text-green-900">Baseline Setting</h3>
                <p className="text-sm text-green-700">Establish hardware standards for each user type</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-purple-600" />
              <div>
                <h3 className="font-medium text-purple-900">Optimization</h3>
                <p className="text-sm text-purple-700">Generate recommendations for device allocation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}