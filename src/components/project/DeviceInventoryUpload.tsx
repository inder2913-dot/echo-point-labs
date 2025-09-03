import { useState, useRef } from "react"
import { Monitor, Upload, FileText, CheckCircle, AlertCircle, Download, Laptop, MonitorSpeaker } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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

const DEVICE_INTEGRATION_OPTIONS = [
  { 
    id: "systrack", 
    name: "Systrack Integration", 
    description: "Import device data from Systrack",
    available: false
  },
  { 
    id: "nexthink", 
    name: "Nexthink Integration", 
    description: "Connect to Nexthink for device insights",
    available: false
  },
  { 
    id: "csv", 
    name: "CSV Upload", 
    description: "Upload device inventory via CSV file",
    available: true
  }
]

const SAMPLE_DEVICE_DATA = [
  { 
    deviceId: "DEV001", 
    userId: "EMP001", 
    userName: "John Smith",
    deviceType: "Laptop", 
    model: "Dell Latitude 7420", 
    cpu: "Intel i7-1185G7", 
    ram: "16GB", 
    storage: "512GB SSD",
    os: "Windows 11",
    age: "2 years"
  },
  { 
    deviceId: "DEV002", 
    userId: "EMP002", 
    userName: "Sarah Johnson",
    deviceType: "Desktop", 
    model: "HP EliteDesk 800", 
    cpu: "Intel i5-10500", 
    ram: "8GB", 
    storage: "256GB SSD",
    os: "Windows 10",
    age: "3 years"
  },
  { 
    deviceId: "DEV003", 
    userId: "EMP003", 
    userName: "Mike Wilson",
    deviceType: "Laptop", 
    model: "MacBook Pro 14", 
    cpu: "Apple M1 Pro", 
    ram: "32GB", 
    storage: "1TB SSD",
    os: "macOS Monterey",
    age: "1 year"
  }
]

interface DeviceInventoryUploadProps {
  onComplete: (data: any) => void
  initialData: any
}

export function DeviceInventoryUpload({ onComplete, initialData }: DeviceInventoryUploadProps) {
  const [selectedIntegration, setSelectedIntegration] = useState("")
  const [uploadedDevices, setUploadedDevices] = useState<any[]>(initialData.deviceData || [])
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
      console.log('Raw CSV text:', text.substring(0, 200)) // Debug log
      
      const lines = text.split('\n').filter(line => line.trim())
      console.log('Lines count:', lines.length) // Debug log
      
      if (lines.length < 2) {
        setUploadStatus("error")
        setIsUploading(false)
        return
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
      console.log('Headers:', headers) // Debug log
      
      const data = lines.slice(1).map((line, lineIndex) => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
        console.log(`Line ${lineIndex + 1} values:`, values) // Debug log
        
        const device: any = {}
        
        headers.forEach((header, index) => {
          const value = values[index] || ''
          const headerLower = header.toLowerCase()
          
          // Store all fields first
          device[header.toLowerCase().replace(/\s+/g, '_')] = value
          
          // Then map to standard fields
          if (headerLower.includes('device') && (headerLower.includes('id') || headerLower.includes('name'))) {
            device.deviceId = value
          } else if (headerLower === 'id' && !headerLower.includes('user')) {
            device.deviceId = value
          } else if (headerLower.includes('asset') && headerLower.includes('tag')) {
            device.deviceId = value
          } else if (headerLower.includes('serial') && headerLower.includes('number')) {
            device.deviceId = value
          } else if (headerLower.includes('user') && headerLower.includes('id')) {
            device.userId = value
          } else if (headerLower.includes('employee') && headerLower.includes('id')) {
            device.userId = value
          } else if (headerLower.includes('user') && headerLower.includes('name')) {
            device.userName = value
          } else if (headerLower.includes('employee') && headerLower.includes('name')) {
            device.userName = value
          } else if (headerLower === 'name' && !headerLower.includes('device')) {
            device.userName = value
          } else if (headerLower.includes('type') || headerLower.includes('category')) {
            device.deviceType = value
          } else if (headerLower.includes('model') || headerLower.includes('brand')) {
            device.model = value
          } else if (headerLower.includes('cpu') || headerLower.includes('processor')) {
            device.cpu = value
          } else if (headerLower.includes('ram') || headerLower.includes('memory')) {
            device.ram = value
          } else if (headerLower.includes('storage') || headerLower.includes('disk') || headerLower.includes('hdd') || headerLower.includes('ssd')) {
            device.storage = value
          } else if (headerLower.includes('os') || headerLower.includes('operating')) {
            device.os = value
          } else if (headerLower.includes('age') || headerLower.includes('year')) {
            device.age = value
          }
        })
        
        console.log(`Parsed device ${lineIndex + 1}:`, device) // Debug log
        
        // Generate device ID if missing but we have some device info
        if (!device.deviceId && (device.model || device.userName)) {
          device.deviceId = `DEV${Math.random().toString(36).substr(2, 3).toUpperCase()}`
        }
        
        // Default device type if missing
        if (!device.deviceType && device.model) {
          if (device.model.toLowerCase().includes('laptop') || device.model.toLowerCase().includes('macbook')) {
            device.deviceType = 'Laptop'
          } else if (device.model.toLowerCase().includes('desktop') || device.model.toLowerCase().includes('tower')) {
            device.deviceType = 'Desktop'
          } else {
            device.deviceType = 'Computer'
          }
        }
        
        return device
      })

      // Very lenient filtering - include any row that has at least one non-empty value
      const filteredData = data.filter(dev => {
        const hasData = Object.values(dev).some(value => value && value.toString().trim() !== '')
        console.log('Device has data:', hasData, dev) // Debug log
        return hasData
      })

      console.log('Final filtered data:', filteredData) // Debug log
      setUploadedDevices(filteredData)
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
      deviceData: uploadedDevices,
      deviceUploadMethod: selectedIntegration
    })
  }

  const downloadTemplate = () => {
    const csvContent = "Device ID,User ID,User Name,Device Type,Model,CPU,RAM,Storage,Operating System,Device Age\nDEV001,EMP001,John Doe,Laptop,Dell Latitude 7420,Intel i7-1185G7,16GB,512GB SSD,Windows 11,2 years"
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'device_inventory_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getDeviceIcon = (type: string) => {
    return type.toLowerCase() === 'laptop' ? Laptop : MonitorSpeaker
  }

  const getDeviceTypeColor = (type: string) => {
    return type.toLowerCase() === 'laptop' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
  }

  return (
    <div className="space-y-6">
      {/* Integration Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-primary" />
            Device Data Source
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DEVICE_INTEGRATION_OPTIONS.map((option) => (
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
              Device CSV Upload
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                Upload a CSV file with device information. Required columns: Device ID, User ID, Device Type, Model, CPU, RAM, Storage, OS.
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
                  <Monitor className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-medium">Upload Device Inventory</h3>
                    <p className="text-muted-foreground">Upload your current device assignments and specifications</p>
                  </div>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    Select CSV File
                  </Button>
                </div>
              )}

              {isUploading && (
                <div className="space-y-4">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-muted-foreground">Processing device data...</p>
                </div>
              )}

              {uploadStatus === "success" && (
                <div className="space-y-4">
                  <CheckCircle className="w-12 h-12 mx-auto text-success" />
                  <div>
                    <h3 className="text-lg font-medium text-success">Upload Successful</h3>
                    <p className="text-muted-foreground">
                      {uploadedDevices.length} device records imported successfully
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Device Summary */}
      {uploadedDevices.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Devices</p>
                  <p className="text-2xl font-bold">{uploadedDevices.length}</p>
                </div>
                <Monitor className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Laptops</p>
                  <p className="text-2xl font-bold">
                    {uploadedDevices.filter(d => d.deviceType.toLowerCase() === 'laptop').length}
                  </p>
                </div>
                <Laptop className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Desktops</p>
                  <p className="text-2xl font-bold">
                    {uploadedDevices.filter(d => d.deviceType.toLowerCase() === 'desktop').length}
                  </p>
                </div>
                <MonitorSpeaker className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Data Preview */}
      {uploadedDevices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Device Inventory Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Specs</TableHead>
                    <TableHead>Age</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uploadedDevices.slice(0, 3).map((device, index) => {
                    const DeviceIcon = getDeviceIcon(device.deviceType)
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <DeviceIcon className="w-4 h-4" />
                            {device.deviceId}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{device.userName}</p>
                            <p className="text-xs text-muted-foreground">{device.userId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getDeviceTypeColor(device.deviceType)}>
                            {device.deviceType}
                          </Badge>
                        </TableCell>
                        <TableCell>{device.model}</TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <p>{device.cpu}</p>
                            <p>{device.ram} RAM, {device.storage}</p>
                          </div>
                        </TableCell>
                        <TableCell>{device.age}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              
              {uploadedDevices.length > 3 && (
                <p className="text-sm text-muted-foreground text-center">
                  ... and {uploadedDevices.length - 3} more devices
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Continue Button */}
      {uploadedDevices.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={handleContinue}>
            Continue to User Profiling
          </Button>
        </div>
      )}
    </div>
  )
}