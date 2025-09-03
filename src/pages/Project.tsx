import { useState } from "react"
import { 
  Building2, 
  Upload, 
  Monitor, 
  Users, 
  BarChart3, 
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { OrganizationSetup } from "@/components/project/OrganizationSetup"
import { EmployeeDataUpload } from "@/components/project/EmployeeDataUpload"
import { DeviceInventoryUpload } from "@/components/project/DeviceInventoryUpload"
import { UserProfilingBaselines } from "@/components/project/UserProfilingBaselines"
import { DeviceComparison } from "@/components/project/DeviceComparison"
import { RecommendationEngine } from "@/components/project/RecommendationEngine"

const WORKFLOW_STEPS = [
  { id: 1, title: "Organization Setup", icon: Building2, description: "Select organization and industry type" },
  { id: 2, title: "Employee Data", icon: Users, description: "Upload employee information" },
  { id: 3, title: "Device Inventory", icon: Monitor, description: "Upload current device data" },
  { id: 4, title: "User Profiling", icon: BarChart3, description: "Create profiles and set baselines" },
  { id: 5, title: "Device Analysis", icon: Upload, description: "Compare devices with baselines" },
  { id: 6, title: "Recommendations", icon: CheckCircle, description: "Generate upgrade/downgrade recommendations" }
]

export default function Project() {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [projectData, setProjectData] = useState({
    organization: null,
    industry: null,
    employeeData: [],
    deviceData: [],
    userProfiles: [],
    baselines: {},
    recommendations: []
  })

  const handleStepComplete = (stepId: number, data: any) => {
    setCompletedSteps(prev => [...prev.filter(id => id !== stepId), stepId])
    setProjectData(prev => ({ ...prev, ...data }))
    
    // Auto-advance to next step if not at the end
    if (stepId < WORKFLOW_STEPS.length) {
      setCurrentStep(stepId + 1)
    }
  }

  const handleStepChange = (stepId: number) => {
    // Only allow navigation to completed steps or the next step
    if (completedSteps.includes(stepId) || stepId === Math.max(...completedSteps, 0) + 1) {
      setCurrentStep(stepId)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <OrganizationSetup 
            onComplete={(data) => handleStepComplete(1, data)}
            initialData={projectData}
          />
        )
      case 2:
        return (
          <EmployeeDataUpload 
            onComplete={(data) => handleStepComplete(2, data)}
            initialData={projectData}
          />
        )
      case 3:
        return (
          <DeviceInventoryUpload 
            onComplete={(data) => handleStepComplete(3, data)}
            initialData={projectData}
          />
        )
      case 4:
        return (
          <UserProfilingBaselines 
            onComplete={(data) => handleStepComplete(4, data)}
            initialData={projectData}
          />
        )
      case 5:
        return (
          <DeviceComparison 
            onComplete={(data) => handleStepComplete(5, data)}
            initialData={projectData}
          />
        )
      case 6:
        return (
          <RecommendationEngine 
            onComplete={(data) => handleStepComplete(6, data)}
            initialData={projectData}
          />
        )
      default:
        return null
    }
  }

  const currentStepData = WORKFLOW_STEPS.find(step => step.id === currentStep)
  const progressPercentage = (completedSteps.length / WORKFLOW_STEPS.length) * 100

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Project</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Profiling Project</h1>
            <p className="text-muted-foreground">
              Create user profiles and optimize device allocation based on organizational needs
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            Step {currentStep} of {WORKFLOW_STEPS.length}
          </Badge>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Project Progress</CardTitle>
            <span className="text-sm text-muted-foreground">
              {completedSteps.length}/{WORKFLOW_STEPS.length} completed
            </span>
          </div>
          <Progress value={progressPercentage} className="w-full" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-4">
            {WORKFLOW_STEPS.map((step) => {
              const isCompleted = completedSteps.includes(step.id)
              const isCurrent = currentStep === step.id
              const isAccessible = completedSteps.includes(step.id) || step.id === Math.max(...completedSteps, 0) + 1
              
              return (
                <Card 
                  key={step.id} 
                  className={`cursor-pointer transition-all ${
                    isCurrent ? 'ring-2 ring-primary bg-primary/5' : 
                    isCompleted ? 'bg-success/5 border-success/20' : 
                    isAccessible ? 'hover:bg-accent' : 'opacity-50 cursor-not-allowed'
                  }`}
                  onClick={() => handleStepChange(step.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-success text-success-foreground' :
                      isCurrent ? 'bg-primary text-primary-foreground' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {isCompleted ? <CheckCircle className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                    </div>
                    <h3 className="font-medium text-sm mb-1">{step.title}</h3>
                    <p className="text-xs text-muted-foreground leading-tight">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Step Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            {currentStepData && <currentStepData.icon className="w-6 h-6 text-primary" />}
            <div>
              <CardTitle className="text-xl">{currentStepData?.title}</CardTitle>
              <p className="text-muted-foreground">{currentStepData?.description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <Button
          onClick={() => setCurrentStep(Math.min(WORKFLOW_STEPS.length, currentStep + 1))}
          disabled={currentStep === WORKFLOW_STEPS.length || !completedSteps.includes(currentStep)}
          className="flex items-center gap-2"
        >
          Next
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}