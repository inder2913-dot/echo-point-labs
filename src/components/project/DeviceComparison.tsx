import { useState, useEffect } from "react"
import { BarChart3, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from "@/integrations/supabase/client"

interface DeviceComparisonProps {
  onComplete: (data: any) => void
  initialData: any
}

export function DeviceComparison({ onComplete, initialData }: DeviceComparisonProps) {
  const [comparisonResults, setComparisonResults] = useState<any[]>([])
  const [filterStatus, setFilterStatus] = useState("all")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeDevices = async () => {
    setIsAnalyzing(true)
    
    try {
      // Get the real device data from database instead of mock data
      const { data: deviceInventoryData, error: deviceError } = await supabase
        .from('project_data')
        .select('*')
        .eq('step_name', 'deviceInventory')
        .order('created_at', { ascending: false })
        .limit(1)

      let devices: any[] = []
      if (deviceInventoryData && deviceInventoryData.length > 0) {
        const rawData = deviceInventoryData[0].data
        devices = Array.isArray(rawData) ? rawData : []
        console.log('Loaded real device inventory:', devices.length, 'devices')
        console.log('Sample devices with RAM:', devices.slice(0, 5).map((d: any) => ({ 
          computername: d.computername, 
          ram: d.ram || d.ramcapacity, 
          deviceserial: d.deviceserial 
        })))
      }

      const employees = initialData.userAssignments || []
      const profiles = initialData.userProfiles || []
      
      console.log('Device Analysis - Employees:', employees.length)
      console.log('Device Analysis - Devices loaded:', devices.length)
      console.log('Device Analysis - Profiles:', profiles.length)
      
      const results = employees.map(employee => {
        // Try multiple ways to match employee with device
        let userDevice = null
        
        console.log(`Trying to match employee: ${employee.name} (ID: ${employee.id})`)
        
        // First try matching by computername containing employee first name
        if (!userDevice && employee.name) {
          const employeeFirstName = (employee.firstName || employee.name.split(' ')[0] || '').toLowerCase()
          
          userDevice = devices.find(d => {
            const computerName = (d.computername || '').toLowerCase()
            // Match patterns like "John-LTP", "Wei-PC", etc.
            return computerName.includes(employeeFirstName) && employeeFirstName
          })
          
          if (userDevice) {
            console.log(`Matched ${employee.name} with device via computername: ${userDevice.computername}`)
          }
        }
        
        // Try matching by deviceserial from employee data
        if (!userDevice && employee.deviceSerial) {
          userDevice = devices.find(d => d.deviceserial === employee.deviceSerial)
          if (userDevice) {
            console.log(`Matched ${employee.name} with device via deviceserial: ${userDevice.deviceserial}`)
          }
        }
        
        // Try matching by various ID fields
        if (!userDevice) {
          userDevice = devices.find(d => {
            const matches = [
              d.userId === employee.id,
              d.user_id === employee.id,
              d.employeeId === employee.id,
              d.employee_id === employee.id,
              d.emp_id === employee.id,
              d.id === employee.id
            ]
            return matches.some(match => match)
          })
        }
        
        // If no direct ID match, try matching by name (more flexible)
        if (!userDevice && employee.name) {
          userDevice = devices.find(d => {
            const deviceUserName = d.userName || d.user_name || d.employeeName || d.employee_name || d.name || ''
            const employeeName = employee.name || ''
            
            // Try exact match first
            if (deviceUserName.toLowerCase() === employeeName.toLowerCase()) {
              return true
            }
            
            // Try partial matches
            const deviceNameParts = deviceUserName.toLowerCase().split(' ')
            const employeeNameParts = employeeName.toLowerCase().split(' ')
            
            // Check if all parts of employee name are in device name
            return employeeNameParts.every(part => 
              deviceNameParts.some(devicePart => devicePart.includes(part) || part.includes(devicePart))
            )
          })
        }
        
        console.log(`Employee ${employee.name} matched with device:`, userDevice)
        
        const userProfile = profiles.find(p => p.id === employee.profileId)
        
        if (!userDevice) {
          return {
            ...employee,
            device: null,
            profile: userProfile,
            status: 'no-device',
            issues: ['No device assigned'],
            score: 0
          }
        }
        
        if (!userProfile) {
          return {
            ...employee,
            device: userDevice,
            profile: null,
            status: 'no-profile',
            issues: ['No profile assigned'],
            score: 0
          }
        }
        
        // Compare device specs with baseline using real device data
        const issues = []
        let score = 100
        
        // RAM comparison - use actual RAM values from device inventory
        const deviceRam = parseInt(userDevice.ram || userDevice.ramcapacity) || 0
        const requiredRam = parseInt(userProfile.baseline.minRam) || 0
        if (deviceRam < requiredRam) {
          issues.push(`RAM below baseline (${deviceRam}GB < ${userProfile.baseline.minRam})`)
          score -= 30
        } else if (deviceRam > requiredRam * 2) {
          issues.push(`RAM significantly over baseline (${deviceRam}GB > ${userProfile.baseline.minRam})`)
          score -= 10
        }
        
        // Device type match
        const profileDeviceType = userProfile.baseline.deviceType.toLowerCase()
        const actualDeviceType = (userDevice.deviceType || userDevice.device_type || 'unknown').toLowerCase()
        if (profileDeviceType !== 'desktop or laptop' && !profileDeviceType.includes(actualDeviceType)) {
          issues.push(`Device type mismatch (has ${actualDeviceType}, needs ${userProfile.baseline.deviceType})`)
          score -= 25
        }
        
        // Storage comparison
        const deviceStorage = parseInt(userDevice.storage || userDevice.diskcapacity) || 0
        const requiredStorage = parseInt(userProfile.baseline.minStorage) || 0
        if (deviceStorage < requiredStorage) {
          issues.push(`Storage below baseline (${deviceStorage}GB < ${userProfile.baseline.minStorage})`)
          score -= 20
        }
        
        // Determine status
        let status = 'compliant'
        if (score < 70) status = 'needs-upgrade'
        else if (score < 85) status = 'minor-issues'
        else if (issues.some(i => i.includes('significantly over'))) status = 'over-provisioned'
        
        return {
          ...employee,
          device: userDevice,
          profile: userProfile,
          status,
          issues,
          score
        }
      })
      
      setComparisonResults(results)
      setIsAnalyzing(false)
    } catch (error) {
      console.error('Error analyzing devices:', error)
      setIsAnalyzing(false)
    }
  }

  useEffect(() => {
    if (initialData.userAssignments?.length > 0) {
      analyzeDevices()
    }
  }, [])

  const handleContinue = () => {
    onComplete({
      deviceComparison: comparisonResults,
      analysisComplete: true
    })
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'compliant':
        return { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Compliant' }
      case 'minor-issues':
        return { icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-800', label: 'Minor Issues' }
      case 'needs-upgrade':
        return { icon: TrendingUp, color: 'bg-red-100 text-red-800', label: 'Needs Upgrade' }
      case 'over-provisioned':
        return { icon: TrendingDown, color: 'bg-blue-100 text-blue-800', label: 'Over-provisioned' }
      case 'no-device':
        return { icon: Minus, color: 'bg-gray-100 text-gray-800', label: 'No Device' }
      default:
        return { icon: Minus, color: 'bg-gray-100 text-gray-800', label: 'Unknown' }
    }
  }

  const getStatusCounts = () => {
    return {
      compliant: comparisonResults.filter(r => r.status === 'compliant').length,
      needsUpgrade: comparisonResults.filter(r => r.status === 'needs-upgrade').length,
      overProvisioned: comparisonResults.filter(r => r.status === 'over-provisioned').length,
      minorIssues: comparisonResults.filter(r => r.status === 'minor-issues').length,
      noDevice: comparisonResults.filter(r => r.status === 'no-device').length
    }
  }

  const filteredResults = comparisonResults.filter(result => 
    filterStatus === 'all' || result.status === filterStatus
  )

  const statusCounts = getStatusCounts()
  const totalDevices = comparisonResults.length
  const complianceRate = totalDevices > 0 ? (statusCounts.compliant / totalDevices) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Analysis Status */}
      {isAnalyzing && (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <div>
                <h3 className="text-lg font-medium">Analyzing Device Compliance</h3>
                <p className="text-muted-foreground">Comparing current devices with user profile baselines...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      {comparisonResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Compliance Rate</p>
                  <p className="text-2xl font-bold">{complianceRate.toFixed(1)}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <Progress value={complianceRate} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Need Upgrades</p>
                  <p className="text-2xl font-bold">{statusCounts.needsUpgrade}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Over-provisioned</p>
                  <p className="text-2xl font-bold">{statusCounts.overProvisioned}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Minor Issues</p>
                  <p className="text-2xl font-bold">{statusCounts.minorIssues}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Analysis */}
      {comparisonResults.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Device-Baseline Comparison
              </CardTitle>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Devices</SelectItem>
                  <SelectItem value="compliant">Compliant</SelectItem>
                  <SelectItem value="needs-upgrade">Needs Upgrade</SelectItem>
                  <SelectItem value="over-provisioned">Over-provisioned</SelectItem>
                  <SelectItem value="minor-issues">Minor Issues</SelectItem>
                  <SelectItem value="no-device">No Device</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Profile</TableHead>
                  <TableHead>Current Device</TableHead>
                  <TableHead>Baseline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Issues</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.slice(0, 10).map((result, index) => {
                  const statusInfo = getStatusInfo(result.status)
                  const StatusIcon = statusInfo.icon
                  
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{result.name}</p>
                          <p className="text-xs text-muted-foreground">{result.department}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={result.profile?.color}>
                          {result.profile?.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {result.device ? (
                          <div className="text-xs">
                            <p className="font-medium">{result.device.model}</p>
                            <p>{result.device.ram} RAM, {result.device.cpu}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No device</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {result.profile && (
                          <div className="text-xs">
                            <p>{result.profile.baseline.deviceType}</p>
                            <p>{result.profile.baseline.minRam} RAM, {result.profile.baseline.minCpu}</p>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusInfo.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{result.score}/100</span>
                          <Progress value={result.score} className="w-16 h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {result.issues.slice(0, 2).map((issue, i) => (
                            <p key={i} className="text-xs text-muted-foreground">{issue}</p>
                          ))}
                          {result.issues.length > 2 && (
                            <p className="text-xs text-muted-foreground">+{result.issues.length - 2} more</p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            
            {filteredResults.length > 10 && (
              <p className="text-sm text-muted-foreground text-center mt-4">
                Showing 10 of {filteredResults.length} results
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Continue Button */}
      {comparisonResults.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={handleContinue}>
            Continue to Recommendations
          </Button>
        </div>
      )}
    </div>
  )
}