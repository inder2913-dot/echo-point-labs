import { useState, useEffect } from "react"
import { Activity, Monitor, Smartphone, Tablet, Laptop, Shield, AlertTriangle, CheckCircle, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface Device {
  id: string
  name: string
  deviceType: string
  deviceSerial: string
  deviceOS: string
  osVersion?: string
  deviceMake?: string
  deviceModel?: string
  lastSeen?: string
  status: 'compliant' | 'needs-upgrade' | 'minor-issues' | 'critical'
  score: number
  department: string
  location: string
  issues: string[]
  device?: any
  cpu?: string
  ram?: string
  graphics?: string
  storage?: string
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'compliant':
      return <CheckCircle className="w-4 h-4 text-green-600" />
    case 'needs-upgrade':
      return <AlertTriangle className="w-4 h-4 text-red-600" />
    case 'minor-issues':
      return <AlertTriangle className="w-4 h-4 text-yellow-600" />
    case 'critical':
      return <Shield className="w-4 h-4 text-red-700" />
    default:
      return <Monitor className="w-4 h-4" />
  }
}

const getDeviceIcon = (deviceType: string) => {
  switch (deviceType?.toLowerCase()) {
    case 'laptop':
      return <Laptop className="w-5 h-5" />
    case 'desktop':
      return <Monitor className="w-5 h-5" />
    case 'tablet':
      return <Tablet className="w-5 h-5" />
    case 'mobile':
    case 'phone':
      return <Smartphone className="w-5 h-5" />
    default:
      return <Monitor className="w-5 h-5" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'compliant':
      return 'bg-green-100 text-green-800'
    case 'needs-upgrade':
      return 'bg-red-100 text-red-800'
    case 'minor-issues':
      return 'bg-yellow-100 text-yellow-800'
    case 'critical':
      return 'bg-red-200 text-red-900'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function Endpoints() {
  const [devices, setDevices] = useState<Device[]>([])
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<any[]>([])
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedDeviceType, setSelectedDeviceType] = useState<string>("all")
  const [selectedCpu, setSelectedCpu] = useState<string>("all")
  const [selectedRam, setSelectedRam] = useState<string>("all")
  const [selectedGraphics, setSelectedGraphics] = useState<string>("all")
  const [selectedStorage, setSelectedStorage] = useState<string>("all")
  const [selectedOS, setSelectedOS] = useState<string>("all")

  useEffect(() => {
    loadProjects()
  }, [])

  useEffect(() => {
    if (selectedProject) {
      loadEndpointsData()
    }
  }, [selectedProject])

  const loadProjects = async () => {
    try {
      const { data: projectsData, error } = await supabase
        .from('projects')
        .select('id, name, created_at')
        .order('created_at', { ascending: false })

      if (error) throw error

      if (projectsData && projectsData.length > 0) {
        setProjects(projectsData)
        // Auto-select the most recent project
        setSelectedProject(projectsData[0].id)
      }
    } catch (error) {
      console.error('Error loading projects:', error)
      toast.error('Failed to load projects')
    }
  }

  const loadEndpointsData = async () => {
    if (!selectedProject) return
    
    try {
      // Get the most recent device comparison data for the selected project
      const { data: projectData, error } = await supabase
        .from('project_data')
        .select('*')
        .eq('step_name', 'deviceComparison')
        .eq('project_id', selectedProject)
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) throw error

      if (projectData && projectData.length > 0) {
        const data = projectData[0].data as any
        console.log('Raw project data:', projectData[0])
        console.log('Data field:', data)
        
        // The data field IS the array of devices, not nested under deviceComparison
        const deviceComparison = Array.isArray(data) ? data : []
        console.log('Device comparison array:', deviceComparison)
        
        // Filter to only show devices that were successfully mapped to users
        const mappedDevices = deviceComparison.filter((item: any) => {
          // Device is mapped if it has user information (name, firstName/lastName, or department)
          const hasUserInfo = item.name || (item.firstName && item.lastName) || item.department
          return hasUserInfo && item.device // Also ensure there's actual device data
        })

        const transformedDevices: Device[] = mappedDevices.map((item: any, index: number) => ({
          id: item.id?.toString() || index.toString(),
          name: item.name || `${item.firstName} ${item.lastName}`,
          deviceType: item.devicetype || item.device?.deviceType || 'Unknown',
          deviceSerial: item.deviceserial || item.device?.deviceserial || 'N/A',
          deviceOS: item.deviceos || item.device?.os || 'Unknown',
          osVersion: item.device?.osversion,
          deviceMake: item.device?.devicemake,
          deviceModel: item.device?.devicemodel || item.device?.model,
          lastSeen: item.device?.lastseen,
          status: item.status || 'unknown',
          score: item.score || 0,
          department: item.department || 'Unknown',
          location: item.location || 'Unknown',
          issues: item.issues || [],
          device: item.device,
          cpu: item.device?.cputype || item.device?.cpu || item.device?.cpucapacity || item.cputype || 'Unknown',
          ram: item.device?.ramcapacity || item.device?.ram || item.ramcapacity || 'Unknown',
          graphics: item.device?.graphicscard || item.device?.graphicstype || item.device?.graphicscapacity || 'Unknown', 
          storage: item.device?.diskcapacity || item.device?.storage || item.diskcapacity || 'Unknown'
        }))

        console.log('Total devices in inventory:', deviceComparison.length)
        console.log('Mapped devices to users:', mappedDevices.length)
        console.log('Transformed devices:', transformedDevices)
        setDevices(transformedDevices)
        setFilteredDevices(transformedDevices)
      } else {
        console.log('No project data found')
      }
    } catch (error) {
      console.error('Error loading endpoints data:', error)
      toast.error('Failed to load endpoints data')
    } finally {
      setLoading(false)
    }
  }

  // Filter devices based on selected filters
  useEffect(() => {
    let filtered = devices

    if (selectedDepartment !== "all") {
      filtered = filtered.filter(device => device.department === selectedDepartment)
    }
    if (selectedLocation !== "all") {
      filtered = filtered.filter(device => device.location === selectedLocation)
    }
    if (selectedStatus !== "all") {
      filtered = filtered.filter(device => device.status === selectedStatus)
    }
    if (selectedDeviceType !== "all") {
      filtered = filtered.filter(device => device.deviceType?.toLowerCase() === selectedDeviceType.toLowerCase())
    }
    if (selectedCpu !== "all") {
      filtered = filtered.filter(device => device.cpu && device.cpu.toLowerCase().includes(selectedCpu.toLowerCase()))
    }
    if (selectedRam !== "all") {
      filtered = filtered.filter(device => device.ram && device.ram.includes(selectedRam))
    }
    if (selectedGraphics !== "all") {
      filtered = filtered.filter(device => device.graphics && device.graphics.toLowerCase().includes(selectedGraphics.toLowerCase()))
    }
    if (selectedStorage !== "all") {
      filtered = filtered.filter(device => device.storage && device.storage.includes(selectedStorage))
    }
    if (selectedOS !== "all") {
      filtered = filtered.filter(device => device.deviceOS && device.deviceOS.toLowerCase().includes(selectedOS.toLowerCase()))
    }

    setFilteredDevices(filtered)
  }, [devices, selectedDepartment, selectedLocation, selectedStatus, selectedDeviceType, selectedCpu, selectedRam, selectedGraphics, selectedStorage, selectedOS])

  // Get unique values for filters
  const departments = [...new Set(devices.map(d => d.department).filter(Boolean))]
  const locations = [...new Set(devices.map(d => d.location).filter(Boolean))]
  const deviceTypes = [...new Set(devices.map(d => d.deviceType).filter(Boolean))]
  const cpuTypes = [...new Set(devices.map(d => d.cpu).filter(Boolean))].sort()
  const ramTypes = [...new Set(devices.map(d => {
    const ram = d.ram?.toString() || ''
    if (ram === 'Unknown') return ram
    // Add GB suffix if not present
    const formattedRam = ram.includes('GB') ? ram : `${ram}GB`
    return formattedRam
  }).filter(Boolean))].sort((a, b) => {
    if (a === 'Unknown') return 1
    if (b === 'Unknown') return -1
    const numA = parseInt(a.toString())
    const numB = parseInt(b.toString())
    return numA - numB
  })
  const graphicsTypes = [...new Set(devices.map(d => d.graphics).filter(Boolean))].sort()
  const storageTypes = [...new Set(devices.map(d => {
    const storage = d.storage?.toString() || ''
    if (storage === 'Unknown') return storage
    // Add GB suffix if not present
    const formattedStorage = storage.includes('GB') ? storage : `${storage}GB`
    return formattedStorage
  }).filter(Boolean))].sort((a, b) => {
    if (a === 'Unknown') return 1
    if (b === 'Unknown') return -1
    const numA = parseInt(a.toString())
    const numB = parseInt(b.toString())
    return numA - numB
  })
  const osTypes = [...new Set(devices.map(d => d.deviceOS).filter(d => d && d !== 'Unknown'))].sort()
  
  console.log('Filter options - CPU Types:', cpuTypes)
  console.log('Filter options - RAM Types:', ramTypes)
  console.log('Filter options - Graphics Types:', graphicsTypes)  
  console.log('Filter options - Storage Types:', storageTypes)
  console.log('Filter options - OS Types:', osTypes)
  console.log('Total devices:', devices.length)
  console.log('Unique CPU count:', cpuTypes.length)
  console.log('Unique RAM count:', ramTypes.length)
  console.log('Unique Storage count:', storageTypes.length)

  // Statistics
  const stats = {
    total: devices.length,
    compliant: devices.filter(d => d.status === 'compliant').length,
    needsUpgrade: devices.filter(d => d.status === 'needs-upgrade').length,
    minorIssues: devices.filter(d => d.status === 'minor-issues').length,
    critical: devices.filter(d => d.status === 'critical').length,
    byType: deviceTypes.reduce((acc, type) => {
      acc[type] = devices.filter(d => d.deviceType === type).length
      return acc
    }, {} as Record<string, number>),
    byDepartment: departments.reduce((acc, dept) => {
      acc[dept] = devices.filter(d => d.department === dept).length
      return acc
    }, {} as Record<string, number>)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Device Endpoints</h1>
            <p className="text-muted-foreground">Monitor and manage user-assigned devices ({filteredDevices.length} of {devices.length})</p>
          </div>
        </div>
        
        {/* Project Selector */}
        <div className="w-64">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              {projects.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Compliant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{stats.compliant}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Needs Upgrade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-2xl font-bold text-red-600">{stats.needsUpgrade}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Minor Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-600">{stats.minorIssues}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-700" />
              <span className="text-2xl font-bold text-red-700">{stats.critical}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all-devices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all-devices">All Devices</TabsTrigger>
          <TabsTrigger value="by-type">By Device Type</TabsTrigger>
          <TabsTrigger value="by-department">By Department</TabsTrigger>
          <TabsTrigger value="by-status">By Status</TabsTrigger>
        </TabsList>

        <TabsContent value="all-devices" className="space-y-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <h3 className="font-medium">Filters</h3>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSelectedDepartment("all")
                  setSelectedLocation("all")
                  setSelectedDeviceType("all")
                  setSelectedStatus("all")
                  setSelectedCpu("all")
                  setSelectedRam("all")
                  setSelectedGraphics("all")
                  setSelectedStorage("all")
                  setSelectedOS("all")
                }}
              >
                Clear All Filters
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
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
                <label className="text-sm font-medium">Location</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Device Type</label>
                <Select value={selectedDeviceType} onValueChange={setSelectedDeviceType}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="all">All Types</SelectItem>
                    {deviceTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="compliant">Compliant</SelectItem>
                    <SelectItem value="needs-upgrade">Needs Upgrade</SelectItem>
                    <SelectItem value="minor-issues">Minor Issues</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">CPU</label>
                <Select value={selectedCpu} onValueChange={setSelectedCpu}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All CPUs" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="all">All CPUs</SelectItem>
                    {cpuTypes.map(cpu => (
                      <SelectItem key={cpu} value={cpu}>{cpu}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">RAM</label>
                <Select value={selectedRam} onValueChange={setSelectedRam}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All RAM" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="all">All RAM</SelectItem>
                    {ramTypes.map(ram => (
                      <SelectItem key={ram} value={ram}>{ram}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Graphics</label>
                <Select value={selectedGraphics} onValueChange={setSelectedGraphics}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Graphics" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="all">All Graphics</SelectItem>
                    {graphicsTypes.map(graphics => (
                      <SelectItem key={graphics} value={graphics}>{graphics}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Storage</label>
                <Select value={selectedStorage} onValueChange={setSelectedStorage}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Storage" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="all">All Storage</SelectItem>
                    {storageTypes.map(storage => (
                      <SelectItem key={storage} value={storage}>{storage}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Operating System</label>
                <Select value={selectedOS} onValueChange={setSelectedOS}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All OS" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="all">All Operating Systems</SelectItem>
                    {osTypes.map(os => (
                      <SelectItem key={os} value={os}>{os}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Device List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDevices.map((device) => (
              <Card key={device.id} className="relative">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(device.deviceType)}
                      <div>
                        <CardTitle className="text-lg">{device.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{device.deviceSerial}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(device.status)}
                      <Badge className={getStatusColor(device.status)}>
                        {device.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Type:</span>
                      <p className="text-muted-foreground">{device.deviceType}</p>
                    </div>
                    <div>
                      <span className="font-medium">OS:</span>
                      <p className="text-muted-foreground">{device.deviceOS}</p>
                    </div>
                    <div>
                      <span className="font-medium">Department:</span>
                      <p className="text-muted-foreground">{device.department}</p>
                    </div>
                    <div>
                      <span className="font-medium">Location:</span>
                      <p className="text-muted-foreground">{device.location}</p>
                    </div>
                  </div>

                  {device.deviceMake && device.deviceModel && (
                    <div className="text-sm">
                      <span className="font-medium">Device:</span>
                      <p className="text-muted-foreground">{device.deviceMake} {device.deviceModel}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">CPU:</span>
                      <p className="text-muted-foreground">{device.cpu}</p>
                    </div>
                    <div>
                      <span className="font-medium">RAM:</span>
                      <p className="text-muted-foreground">{device.ram}GB</p>
                    </div>
                    <div>
                      <span className="font-medium">Graphics:</span>
                      <p className="text-muted-foreground">{device.graphics}</p>
                    </div>
                    <div>
                      <span className="font-medium">Storage:</span>
                      <p className="text-muted-foreground">{device.storage}GB</p>
                    </div>
                  </div>

                  <div className="text-sm">
                    <span className="font-medium">Compliance Score:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            device.score >= 80 ? 'bg-green-500' : 
                            device.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${device.score}%` }}
                        />
                      </div>
                      <span className="text-muted-foreground">{device.score}%</span>
                    </div>
                  </div>

                  {device.issues && device.issues.length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium text-red-600">Issues:</span>
                      <ul className="list-disc list-inside text-muted-foreground mt-1">
                        {device.issues.map((issue, index) => (
                          <li key={index} className="text-xs">{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {device.lastSeen && (
                    <div className="text-xs text-muted-foreground">
                      Last seen: {new Date(device.lastSeen).toLocaleDateString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="by-type" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats.byType).map(([type, count]) => (
              <Card key={type}>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    {getDeviceIcon(type)}
                    <CardTitle>{type}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{count}</div>
                  <p className="text-sm text-muted-foreground">
                    {((count / stats.total) * 100).toFixed(1)}% of total devices
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="by-department" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats.byDepartment).map(([dept, count]) => (
              <Card key={dept}>
                <CardHeader className="pb-4">
                  <CardTitle>{dept}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{count}</div>
                  <p className="text-sm text-muted-foreground">
                    {((count / stats.total) * 100).toFixed(1)}% of total devices
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="by-status" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { status: 'compliant', label: 'Compliant', count: stats.compliant, color: 'text-green-600' },
              { status: 'needs-upgrade', label: 'Needs Upgrade', count: stats.needsUpgrade, color: 'text-red-600' },
              { status: 'minor-issues', label: 'Minor Issues', count: stats.minorIssues, color: 'text-yellow-600' },
              { status: 'critical', label: 'Critical', count: stats.critical, color: 'text-red-700' }
            ].map(({ status, label, count, color }) => (
              <Card key={status}>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status)}
                    <CardTitle>{label}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${color}`}>{count}</div>
                  <p className="text-sm text-muted-foreground">
                    {((count / stats.total) * 100).toFixed(1)}% of total devices
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}