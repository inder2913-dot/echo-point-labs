import { useState } from "react"
import { Building2, Factory } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const ORGANIZATION_TYPES = [
  "Small Business (1-50 employees)",
  "Medium Business (51-250 employees)", 
  "Large Enterprise (251-1000 employees)",
  "Global Enterprise (1000+ employees)",
  "Government/Public Sector",
  "Non-Profit Organization"
]

const INDUSTRY_TYPES = [
  "Technology & Software",
  "Financial Services",
  "Healthcare & Life Sciences",
  "Manufacturing",
  "Retail & E-commerce",
  "Education",
  "Government & Public Sector",
  "Media & Entertainment",
  "Professional Services",
  "Energy & Utilities",
  "Transportation & Logistics",
  "Real Estate",
  "Other"
]

interface OrganizationSetupProps {
  onComplete: (data: any) => void
  initialData: any
}

export function OrganizationSetup({ onComplete, initialData }: OrganizationSetupProps) {
  const [formData, setFormData] = useState({
    organizationName: initialData.organizationName || "",
    organizationType: initialData.organizationType || "",
    industry: initialData.industry || "",
    description: initialData.description || "",
    employeeCount: initialData.employeeCount || "",
    locations: initialData.locations || ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete({
      organization: formData.organizationType,
      industry: formData.industry,
      organizationDetails: formData
    })
  }

  const isFormValid = formData.organizationName && formData.organizationType && formData.industry

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Organization Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Organization Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name</Label>
              <Input
                id="orgName"
                placeholder="Enter your organization name"
                value={formData.organizationName}
                onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orgType">Organization Type</Label>
              <Select 
                value={formData.organizationType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, organizationType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select organization type" />
                </SelectTrigger>
                <SelectContent>
                  {ORGANIZATION_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeCount">Employee Count</Label>
              <Input
                id="employeeCount"
                placeholder="e.g., 150"
                value={formData.employeeCount}
                onChange={(e) => setFormData(prev => ({ ...prev, employeeCount: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Industry & Business Context */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Factory className="w-5 h-5 text-primary" />
              Industry & Context
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Primary Industry</Label>
              <Select 
                value={formData.industry} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRY_TYPES.map((industry) => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="locations">Primary Locations</Label>
              <Input
                id="locations"
                placeholder="e.g., New York, London, Remote"
                value={formData.locations}
                onChange={(e) => setFormData(prev => ({ ...prev, locations: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Business Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of your business and key requirements..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview & Continue */}
      <Card>
        <CardHeader>
          <CardTitle>Project Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Organization</p>
              <p className="text-sm">{formData.organizationName || "Not specified"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Type</p>
              <p className="text-sm">{formData.organizationType || "Not selected"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Industry</p>
              <p className="text-sm">{formData.industry || "Not selected"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Employee Count</p>
              <p className="text-sm">{formData.employeeCount || "Not specified"}</p>
            </div>
          </div>
          
          <Button 
            onClick={handleSubmit} 
            disabled={!isFormValid}
            className="w-full md:w-auto"
          >
            Continue to Employee Data Upload
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}