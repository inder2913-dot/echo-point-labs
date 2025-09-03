import { useState, useRef } from "react"
import { Upload, FileText, Users, CheckCircle, AlertCircle, Download } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const INTEGRATION_OPTIONS = [
  { 
    id: "workday", 
    name: "Workday Integration", 
    description: "Connect directly to your Workday HRIS",
    available: false
  },
  { 
    id: "dynamics365", 
    name: "Dynamics 365 HR", 
    description: "Import from Microsoft Dynamics 365",
    available: false
  },
  { 
    id: "csv", 
    name: "CSV Upload", 
    description: "Upload employee data via CSV file",
    available: true
  }
]

const SAMPLE_DATA = [
  { id: "EMP001", name: "John Smith", department: "Engineering", role: "Senior Developer", location: "New York" },
  { id: "EMP002", name: "Sarah Johnson", department: "Marketing", role: "Marketing Manager", location: "San Francisco" },
  { id: "EMP003", name: "Mike Wilson", department: "Sales", role: "Sales Representative", location: "Chicago" }
]

interface EmployeeDataUploadProps {
  onComplete: (data: any) => void
  initialData: any
}

export function EmployeeDataUpload({ onComplete, initialData }: EmployeeDataUploadProps) {
  const [selectedIntegration, setSelectedIntegration] = useState("")
  const [uploadedData, setUploadedData] = useState<any[]>(initialData.employeeData || [])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadStatus("idle")

    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      
      if (lines.length < 2) {
        setUploadStatus("error")
        setIsUploading(false)
        return
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
        const employee: any = {}
        
        headers.forEach((header, index) => {
          const value = values[index] || ''
          // Map common header variations to standard keys
          if (header.toLowerCase().includes('id') || header.toLowerCase().includes('emp')) {
            employee.id = value
          } else if (header.toLowerCase().includes('name') && !header.toLowerCase().includes('user')) {
            employee.name = value
          } else if (header.toLowerCase().includes('department') || header.toLowerCase().includes('dept')) {
            employee.department = value
          } else if (header.toLowerCase().includes('title') || header.toLowerCase().includes('role') || header.toLowerCase().includes('job')) {
            employee.role = value
          } else if (header.toLowerCase().includes('location') || header.toLowerCase().includes('office')) {
            employee.location = value
          } else {
            // Use the header name as-is for unmapped fields
            employee[header.toLowerCase().replace(/\s+/g, '_')] = value
          }
        })
        
        return employee
      }).filter(emp => emp.id) // Only include rows with an ID

      setUploadedData(data)
      setUploadStatus("success")
    } catch (error) {
      console.error('Error parsing CSV:', error)
      setUploadStatus("error")
    } finally {
      setIsUploading(false)
    }
  }

  const handleContinue = () => {
    onComplete({
      employeeData: uploadedData,
      uploadMethod: selectedIntegration
    })
  }

  const downloadTemplate = () => {
    const csvContent = "Employee ID,Full Name,Department,Job Title,Location\nEMP001,John Doe,Engineering,Software Engineer,New York\nEMP002,Jane Smith,Marketing,Marketing Specialist,San Francisco"
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'employee_data_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Integration Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Employee Data Source
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {INTEGRATION_OPTIONS.map((option) => (
              <Card 
                key={option.id}
                className={`cursor-pointer transition-all ${
                  selectedIntegration === option.id ? 'ring-2 ring-primary bg-primary/5' : 
                  option.available ? 'hover:bg-accent' : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={() => option.available && setSelectedIntegration(option.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">{option.name}</h3>
                    {!option.available && <Badge variant="secondary">Coming Soon</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upload Interface */}
      {selectedIntegration === "csv" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              CSV File Upload
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                Upload a CSV file with employee information. Required columns: Employee ID, Full Name, Department, Job Title, Location.
                <Button variant="link" onClick={downloadTemplate} className="ml-2 p-0 h-auto">
                  <Download className="w-4 h-4 mr-1" />
                  Download Template
                </Button>
              </AlertDescription>
            </Alert>

            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              {!isUploading && uploadStatus === "idle" && (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-medium">Upload Employee Data</h3>
                    <p className="text-muted-foreground">Drag and drop your CSV file here, or click to browse</p>
                  </div>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    Select CSV File
                  </Button>
                </div>
              )}

              {isUploading && (
                <div className="space-y-4">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-muted-foreground">Processing your file...</p>
                </div>
              )}

              {uploadStatus === "success" && (
                <div className="space-y-4">
                  <CheckCircle className="w-12 h-12 mx-auto text-success" />
                  <div>
                    <h3 className="text-lg font-medium text-success">Upload Successful</h3>
                    <p className="text-muted-foreground">
                      {uploadedData.length} employee records imported successfully
                    </p>
                  </div>
                </div>
              )}

              {uploadStatus === "error" && (
                <div className="space-y-4">
                  <AlertCircle className="w-12 h-12 mx-auto text-destructive" />
                  <div>
                    <h3 className="text-lg font-medium text-destructive">Upload Failed</h3>
                    <p className="text-muted-foreground">Please check your file format and try again</p>
                  </div>
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Preview */}
      {uploadedData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Data Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline">{uploadedData.length} employees imported</Badge>
                <Button variant="outline" size="sm">
                  Edit Mappings
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uploadedData.slice(0, 3).map((employee, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{employee.id}</TableCell>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.role}</TableCell>
                      <TableCell>{employee.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {uploadedData.length > 3 && (
                <p className="text-sm text-muted-foreground text-center">
                  ... and {uploadedData.length - 3} more employees
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Continue Button */}
      {uploadedData.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={handleContinue}>
            Continue to Device Inventory
          </Button>
        </div>
      )}
    </div>
  )
}