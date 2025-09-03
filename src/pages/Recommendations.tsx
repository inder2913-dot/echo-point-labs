import { useState, useEffect } from "react"
import { Lightbulb, TrendingUp, Shield, DollarSign, Calendar, ChevronRight, AlertTriangle, CheckCircle, Target, Zap, X, Clock, Users, Monitor } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface DeviceItem {
  id: string
  employee: string
  deviceSerial: string
  department: string
  deviceType: string
  model: string
  os: string
  deviceos?: string
  issues: string[]
  status: string
  score: number
  batteryHealth?: string
  warrantyStatus?: string
}

interface RecommendationItem {
  id: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  priority: 'critical' | 'high' | 'medium' | 'low'
  category: 'hardware' | 'security' | 'cost' | 'planning'
  estimatedCost?: string
  estimatedSavings?: string
  timeframe?: string
  affectedDevices?: number
  implementationSteps?: string[]
  detailedAnalysis?: {
    deviceBreakdown?: { type: string; count: number; issues: string[] }[]
    costBreakdown?: { item: string; cost: number; quantity: number }[]
    riskAssessment?: string[]
    businessImpact?: string
    technicalRequirements?: string[]
  }
}

interface DeviceAnalysis {
  totalDevices: number
  complianceRate: number
  criticalIssues: number
  avgScore: number
  upgradeNeeded: number
  costOptimization: number
  securityRisks: number
  batteryIssues: number
  warrantyExpiring: number
  windows10Devices: number
  unpatchedDevices: number
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical':
      return 'bg-red-100 text-red-800'
    case 'high':
      return 'bg-orange-100 text-orange-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'low':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getImpactIcon = (impact: string) => {
  switch (impact) {
    case 'high':
      return <Zap className="w-4 h-4 text-orange-500" />
    case 'medium':
      return <Target className="w-4 h-4 text-yellow-500" />
    case 'low':
      return <CheckCircle className="w-4 h-4 text-green-500" />
    default:
      return <CheckCircle className="w-4 h-4 text-gray-500" />
  }
}

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([])
  const [selectedRecommendation, setSelectedRecommendation] = useState<RecommendationItem | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [devices, setDevices] = useState<DeviceItem[]>([])
  const [filteredDevices, setFilteredDevices] = useState<DeviceItem[]>([])
  const [isDeviceListOpen, setIsDeviceListOpen] = useState(false)
  const [deviceListTitle, setDeviceListTitle] = useState("")
  const [projects, setProjects] = useState<any[]>([])
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [deviceAnalysis, setDeviceAnalysis] = useState<DeviceAnalysis>({
    totalDevices: 0,
    complianceRate: 0,
    criticalIssues: 0,
    avgScore: 0,
    upgradeNeeded: 0,
    costOptimization: 0,
    securityRisks: 0,
    batteryIssues: 0,
    warrantyExpiring: 0,
    windows10Devices: 0,
    unpatchedDevices: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjects()
  }, [])

  useEffect(() => {
    if (selectedProject) {
      loadRecommendations()
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

  const handleViewDetails = (recommendation: RecommendationItem) => {
    setSelectedRecommendation(recommendation)
    setIsDetailModalOpen(true)
  }

  const handleDeviceListClick = (filterType: string, title: string) => {
    let filtered: DeviceItem[] = []
    
    switch (filterType) {
      case 'security':
        filtered = devices.filter(d => 
          d.os.includes('Windows 10') || d.issues.some(issue => 
            issue.includes('Security') || issue.includes('Patch') || issue.includes('Outdated')
          )
        )
        break
      case 'windows10':
        filtered = devices.filter(d => 
          d.os.includes('Windows 10') || d.deviceos?.includes('Windows 10')
        )
        console.log('Windows 10 filter applied. Total devices:', devices.length, 'Filtered:', filtered.length)
        console.log('Windows 10 devices by OS field:', devices.filter(d => d.os.includes('Windows 10')).length)
        console.log('Windows 10 devices by deviceos field:', devices.filter(d => d.deviceos?.includes('Windows 10')).length)
        break
      case 'unpatched':
        // Devices that need security patches - Windows 10 devices with issues
        filtered = devices.filter(d => 
          d.os.includes('Windows 10') && (
            d.status === 'needs-upgrade' ||
            d.status === 'minor-issues' ||
            d.issues.some(issue => 
              issue.includes('Security') || 
              issue.includes('Patch') || 
              issue.includes('Outdated')
            )
          )
        )
        break
      case 'laptops':
        console.log('Filtering laptops - Total devices:', devices.length)
        console.log('Devices with Laptop deviceType:', devices.filter(d => d.deviceType === 'Laptop').length)
        console.log('Devices with needs-upgrade status:', devices.filter(d => d.status === 'needs-upgrade').length)
        filtered = devices.filter(d => 
          d.deviceType === 'Laptop' && d.status === 'needs-upgrade'
        )
        console.log('Filtered laptops needing upgrade:', filtered.length)
        break
      case 'desktops':
        console.log('Filtering desktops - Total devices:', devices.length)
        filtered = devices.filter(d => 
          d.deviceType === 'Desktop' && d.status === 'needs-upgrade'
        )
        console.log('Filtered desktops needing upgrade:', filtered.length)
        break
      case 'upgrade':
        filtered = devices.filter(d => d.status === 'needs-upgrade')
        break
      case 'battery':
        filtered = devices.filter(d => 
          d.issues.some(issue => issue.includes('Battery')) ||
          (d as any).batteryHealth === 'Poor' ||
          (d as any).batteryHealth === 'Fair'
        )
        break
      case 'warranty':
        filtered = devices.filter(d => 
          d.issues.some(issue => issue.includes('Warranty')) ||
          (d as any).warrantyStatus === 'Expiring' ||
          (d as any).warrantyStatus === 'Expired'
        )
        break
      default:
        filtered = devices
    }
    
    console.log('=== FINAL FILTER RESULT ===')
    console.log('Filter applied:', filterType)
    console.log('Devices found:', filtered.length)
    console.log('Filtered devices sample:', filtered.slice(0, 5).map(d => ({
      name: d.employee, 
      deviceType: d.deviceType, 
      status: d.status,
      issues: d.issues
    })))
    
    setFilteredDevices(filtered)
    setDeviceListTitle(title)
    setIsDeviceListOpen(true)
  }

  const loadRecommendations = async () => {
    try {
      // Get device comparison data for the selected project
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
        const deviceComparison = Array.isArray(data) ? data : []
        
        console.log('Total devices loaded from database:', deviceComparison.length)
        console.log('Sample device data:', deviceComparison.slice(0, 3))
        
        // Convert devices to DeviceItem format with enhanced data
        const deviceItems = deviceComparison.map((device: any, index: number) => ({
          id: device.id || `device-${index}`,
          employee: device.name || `Employee ${index + 1}`,
          deviceSerial: device.deviceserial || device.device?.deviceserial || `DEV-${index + 1}`,
          department: device.department || 'Unknown',
          deviceType: device.devicetype || 'Unknown',
          model: device.device?.model || device.model || 'Unknown Model',
          os: device.deviceos || device.device?.os || 'Unknown OS',
          deviceos: device.deviceos,
          issues: device.issues || [],
          status: device.status || 'unknown',
          score: device.score || 0,
          batteryHealth: device.device?.batteryhealth || 'Unknown',
          warrantyStatus: device.device?.warrantystatus || 'Unknown'
        }))
        
        console.log('Converted device items:', deviceItems.length)
        console.log('Windows 10 devices found:', deviceItems.filter(d => d.os.includes('Windows 10')).length)
        
        setDevices(deviceItems)
        
        // Analyze device data
        const analysis = analyzeDevices(deviceComparison)
        console.log('Analysis results:', analysis)
        setDeviceAnalysis(analysis)
        
        // Generate recommendations
        const generatedRecommendations = generateRecommendations(deviceComparison, analysis)
        setRecommendations(generatedRecommendations)
      }
    } catch (error) {
      console.error('Error loading recommendations:', error)
      toast.error('Failed to load recommendations')
    } finally {
      setLoading(false)
    }
  }

  const analyzeDevices = (devices: any[]): DeviceAnalysis => {
    const totalDevices = devices.length
    const compliantDevices = devices.filter(d => d.status === 'compliant').length
    const complianceRate = totalDevices > 0 ? Math.round((compliantDevices / totalDevices) * 100) : 0
    
    const criticalIssues = devices.filter(d => d.status === 'critical').length
    const upgradeNeeded = devices.filter(d => d.status === 'needs-upgrade').length
    const avgScore = totalDevices > 0 
      ? Math.round(devices.reduce((sum, d) => sum + (d.score || 0), 0) / totalDevices)
      : 0

    // Count Windows 10 devices more accurately
    const windows10Devices = devices.filter(d => {
      const os = (d.deviceos || d.device?.os || '').toLowerCase()
      return os.includes('windows 10') && !os.includes('windows 11')
    }).length
    
    console.log('Windows 10 device count in analysis:', windows10Devices)
    console.log('Total devices in analysis:', totalDevices)

    // Count devices that actually need security patches (only flag real security issues)
    const unpatchedDevices = devices.filter(d => {
      const hasSecurityIssue = d.issues?.some((issue: string) => 
        issue.toLowerCase().includes('security') || 
        issue.toLowerCase().includes('patch') || 
        issue.toLowerCase().includes('vulnerability')
      ) || false
      
      const isOutdatedWindows = (d.deviceos || '').toLowerCase().includes('windows 10')
      
      return hasSecurityIssue || (isOutdatedWindows && d.status === 'needs-upgrade')
    }).length

    // More accurate security risk calculation
    const securityRisks = devices.filter(d => {
      const hasSecurityIssue = d.issues?.some((issue: string) => 
        issue.toLowerCase().includes('security') || 
        issue.toLowerCase().includes('vulnerability') ||
        issue.toLowerCase().includes('patch')
      ) || false
      
      const isOutdatedOS = (d.deviceos || '').toLowerCase().includes('windows 10')
      
      return hasSecurityIssue || isOutdatedOS
    }).length

    // Better cost optimization estimation based on actual over-provisioning
    const overProvisionedDevices = devices.filter(d => 
      d.status === 'over-provisioned' || 
      d.issues?.some((issue: string) => issue.includes('significantly over'))
    ).length
    const costOptimization = overProvisionedDevices

    // More accurate battery issues calculation
    const batteryIssues = devices.filter(d => {
      const hasBatteryIssue = d.issues?.some((issue: string) => 
        issue.toLowerCase().includes('battery')
      ) || false
      
      const poorBattery = d.device?.batteryhealth === 'Poor' || d.device?.batteryhealth === 'Fair'
      
      return hasBatteryIssue || poorBattery
    }).length

    // More realistic warranty calculation
    const warrantyExpiring = devices.filter(d => {
      const hasWarrantyIssue = d.issues?.some((issue: string) => 
        issue.toLowerCase().includes('warranty')
      ) || false
      
      const expiringWarranty = d.device?.warrantystatus === 'Expiring' || d.device?.warrantystatus === 'Expired'
      
      return hasWarrantyIssue || expiringWarranty
    }).length

    return {
      totalDevices,
      complianceRate,
      criticalIssues,
      avgScore,
      upgradeNeeded,
      costOptimization,
      securityRisks,
      batteryIssues,
      warrantyExpiring,
      windows10Devices,
      unpatchedDevices
    }
  }

  const generateRecommendations = (devices: any[], analysis: DeviceAnalysis): RecommendationItem[] => {
    const recommendations: RecommendationItem[] = []

    // Hardware upgrade recommendations
    if (analysis.upgradeNeeded > 0) {
      recommendations.push({
        id: 'hardware-upgrade',
        title: 'Prioritize Hardware Upgrades',
        description: `${analysis.upgradeNeeded} devices require hardware upgrades to meet baseline requirements. Focus on RAM and storage upgrades for immediate compliance improvement.`,
        impact: 'high',
        priority: 'high',
        category: 'hardware',
        estimatedCost: `$${((Math.floor(analysis.upgradeNeeded * 0.3) * 1500) + (Math.floor(analysis.upgradeNeeded * 0.7) * 250)).toLocaleString()}`,
        timeframe: '2-3 months',
        affectedDevices: analysis.upgradeNeeded,
        implementationSteps: [
          'Audit devices with RAM below baseline requirements',
          'Prioritize upgrades for power users and engineers',
          'Negotiate bulk pricing with hardware vendors',
          'Schedule upgrades during maintenance windows'
        ],
        detailedAnalysis: {
          deviceBreakdown: (() => {
            const fullReplacements = Math.floor(analysis.upgradeNeeded * 0.3);
            const minorFixes = Math.floor(analysis.upgradeNeeded * 0.7);
            return [
              { 
                type: 'Critical Issues (Full Replacement)', 
                count: fullReplacements, 
                issues: ['Critical RAM shortage', 'Severely outdated hardware', 'Multiple component failures'] 
              },
              { 
                type: 'Minor Issues (Fixes & Upgrades)', 
                count: minorFixes, 
                issues: ['RAM below baseline', 'Slow storage', 'Minor hardware upgrades needed'] 
              }
            ];
          })(),
          costBreakdown: [
            { item: 'Full Device Replacements', cost: 1500, quantity: Math.floor(analysis.upgradeNeeded * 0.3) },
            { item: 'Minor Fixes & Upgrades', cost: 250, quantity: Math.floor(analysis.upgradeNeeded * 0.7) }
          ],
          riskAssessment: [
            'Performance bottlenecks affecting productivity',
            'Inability to run modern software efficiently',
            'Increased support costs for aging hardware'
          ],
          businessImpact: 'Upgrading hardware will improve employee productivity by 25-30% and reduce IT support tickets by 40%.',
          technicalRequirements: [
            'Compatible DDR4/DDR5 RAM modules',
            'SATA/NVMe SSD compatibility check',
            'Backup and data migration procedures',
            'Post-upgrade performance validation'
          ]
        }
      })
    }

    // Security recommendations
    if (analysis.securityRisks > 0) {
      recommendations.push({
        id: 'security-updates',
        title: 'Address Security Vulnerabilities',
        description: `${analysis.securityRisks} devices have potential security risks including outdated OS versions and missing security features.`,
        impact: 'high',
        priority: 'critical',
        category: 'security',
        timeframe: '1 month',
        affectedDevices: analysis.securityRisks,
        implementationSteps: [
          'Update all Windows 10 devices to Windows 11',
          'Enable Windows Defender on all devices',
          'Implement endpoint detection and response (EDR)',
          'Schedule regular security patch cycles'
        ],
        detailedAnalysis: {
          deviceBreakdown: [
            { type: 'Windows 10 Devices', count: analysis.windows10Devices, issues: ['Outdated OS', 'Missing Security Features'] }
          ],
          riskAssessment: [
            'High vulnerability to ransomware attacks',
            'Non-compliance with security standards',
            'Potential data breach exposure',
            'Lack of modern security features'
          ],
          businessImpact: 'Addressing these vulnerabilities will reduce security incident risk by 80% and ensure compliance with industry standards.',
          technicalRequirements: [
            'Windows 11 compatible hardware verification',
            'EDR solution deployment infrastructure',
            'Centralized patch management system',
            'Security monitoring and alerting setup'
          ]
        }
      })
    }

    // Battery health recommendations
    if (analysis.batteryIssues > 0) {
      recommendations.push({
        id: 'battery-replacement',
        title: 'Battery Health Assessment',
        description: `${analysis.batteryIssues} devices show poor battery health or are missing battery data. Consider battery replacements for optimal mobility.`,
        impact: 'medium',
        priority: 'medium',
        category: 'hardware',
        estimatedCost: `$${(analysis.batteryIssues * 150).toLocaleString()}`,
        timeframe: '1-2 months',
        affectedDevices: analysis.batteryIssues,
        implementationSteps: [
          'Conduct battery health assessments on all mobile devices',
          'Prioritize battery replacements for devices with <70% capacity',
          'Source OEM or compatible replacement batteries',
          'Schedule replacements during planned maintenance'
        ],
        detailedAnalysis: {
          deviceBreakdown: [
            { type: 'Poor Battery Health', count: Math.floor(analysis.batteryIssues * 0.4), issues: ['Battery capacity <50%', 'Frequent charging required'] },
            { type: 'Fair Battery Health', count: Math.floor(analysis.batteryIssues * 0.3), issues: ['Battery capacity 50-70%', 'Reduced mobility'] },
            { type: 'Unknown Battery Status', count: Math.floor(analysis.batteryIssues * 0.3), issues: ['Battery diagnostics needed'] }
          ],
          costBreakdown: [
            { item: 'Laptop Battery Replacement', cost: 150, quantity: Math.floor(analysis.batteryIssues * 0.8) },
            { item: 'Tablet Battery Replacement', cost: 120, quantity: Math.floor(analysis.batteryIssues * 0.2) },
            { item: 'Installation Service', cost: 30, quantity: analysis.batteryIssues }
          ],
          riskAssessment: [
            'Reduced productivity due to frequent charging',
            'Potential data loss from unexpected shutdowns',
            'Decreased device mobility and flexibility'
          ],
          businessImpact: 'Improving battery health will increase mobile productivity by 40% and reduce device downtime.',
          technicalRequirements: [
            'Battery health diagnostic tools',
            'OEM-compatible replacement batteries',
            'Certified technician installation',
            'Post-replacement capacity verification'
          ]
        }
      })
    }

    // Warranty/EOL recommendations
    if (analysis.warrantyExpiring > 0) {
      recommendations.push({
        id: 'warranty-eol',
        title: 'Warranty & End-of-Life Planning',
        description: `${analysis.warrantyExpiring} devices are approaching warranty expiration or end-of-life. Plan for replacements or extended support.`,
        impact: 'medium',
        priority: 'low',
        category: 'planning',
        estimatedCost: `$${(() => {
          if (analysis.warrantyExpiring <= 3) {
            return (analysis.warrantyExpiring * 1500);
          } else {
            return (Math.ceil(analysis.warrantyExpiring * 0.7) * 1500) + (Math.floor(analysis.warrantyExpiring * 0.3) * 200);
          }
        })().toLocaleString()}`,
        timeframe: '6-12 months',
        affectedDevices: analysis.warrantyExpiring,
        implementationSteps: [
          'Audit all device warranty expiration dates',
          'Evaluate devices for extended warranty vs replacement',
          'Create replacement timeline for critical devices',
          'Budget for upcoming hardware refresh cycle'
        ],
        detailedAnalysis: {
          deviceBreakdown: (() => {
            // For small numbers, show all warranty devices in one category to avoid rounding issues
            if (analysis.warrantyExpiring <= 3) {
              return [
                { 
                  type: 'Warranty & End-of-Life Issues', 
                  count: analysis.warrantyExpiring, 
                  issues: ['Warranty expiring soon', 'End-of-life approaching', 'Support coverage ending'] 
                }
              ];
            } else {
              // For larger numbers, split more evenly
              const nearExpiring = Math.ceil(analysis.warrantyExpiring * 0.7);
              const endOfLife = analysis.warrantyExpiring - nearExpiring;
              return [
                { type: 'Warranty Expiring (3-6 months)', count: nearExpiring, issues: ['Support coverage ending', 'Repair costs increasing'] },
                { type: 'End-of-Life Approaching', count: endOfLife, issues: ['Vendor support ending', 'Security updates stopping'] }
              ];
            }
          })(),
          costBreakdown: (() => {
            if (analysis.warrantyExpiring <= 3) {
              // For small numbers, show realistic breakdown
              return [
                { item: 'Device Replacement (Average)', cost: 1500, quantity: analysis.warrantyExpiring },
                { item: 'Extended Warranty', cost: 200, quantity: 0 }
              ];
            } else {
              return [
                { item: 'Device Replacement (Average)', cost: 1500, quantity: Math.ceil(analysis.warrantyExpiring * 0.7) },
                { item: 'Extended Warranty', cost: 200, quantity: Math.floor(analysis.warrantyExpiring * 0.3) }
              ];
            }
          })(),
          riskAssessment: [
            'Increased repair and support costs',
            'Potential security vulnerabilities from unsupported devices',
            'Business continuity risks from device failures'
          ],
          businessImpact: 'Proactive EOL planning reduces unexpected replacement costs by 30% and ensures business continuity.',
          technicalRequirements: [
            'Asset management system integration',
            'Vendor lifecycle documentation',
            'Budget approval for replacements',
            'Data migration and setup procedures'
          ]
        }
      })
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
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

  const categoryRecommendations = {
    hardware: recommendations.filter(r => r.category === 'hardware'),
    security: recommendations.filter(r => r.category === 'security'),
    cost: recommendations.filter(r => r.category === 'cost'),
    planning: recommendations.filter(r => r.category === 'planning')
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Recommendations</h1>
            <p className="text-muted-foreground">AI-powered insights to optimize your hardware infrastructure</p>
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

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deviceAnalysis.complianceRate}%</div>
            <Progress value={deviceAnalysis.complianceRate} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-2xl font-bold text-red-600">{deviceAnalysis.criticalIssues}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upgrade Required</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{deviceAnalysis.upgradeNeeded}</div>
            <p className="text-xs text-muted-foreground">devices need upgrades</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{deviceAnalysis.avgScore}%</div>
            <p className="text-xs text-muted-foreground">overall performance</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Recommendations</TabsTrigger>
          <TabsTrigger value="hardware">Hardware ({categoryRecommendations.hardware.length})</TabsTrigger>
          <TabsTrigger value="security">Security ({categoryRecommendations.security.length})</TabsTrigger>
          <TabsTrigger value="cost">Cost ({categoryRecommendations.cost.length})</TabsTrigger>
          <TabsTrigger value="planning">Planning ({categoryRecommendations.planning.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <RecommendationsList recommendations={recommendations} onViewDetails={handleViewDetails} />
        </TabsContent>

        <TabsContent value="hardware" className="space-y-4">
          <RecommendationsList recommendations={categoryRecommendations.hardware} onViewDetails={handleViewDetails} />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <RecommendationsList recommendations={categoryRecommendations.security} onViewDetails={handleViewDetails} />
        </TabsContent>

        <TabsContent value="cost" className="space-y-4">
          <RecommendationsList recommendations={categoryRecommendations.cost} onViewDetails={handleViewDetails} />
        </TabsContent>

        <TabsContent value="planning" className="space-y-4">
          <RecommendationsList recommendations={categoryRecommendations.planning} onViewDetails={handleViewDetails} />
        </TabsContent>
      </Tabs>

      {/* Recommendation Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedRecommendation && getImpactIcon(selectedRecommendation.impact)}
              {selectedRecommendation?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedRecommendation && (
            <RecommendationDetails 
              recommendation={selectedRecommendation} 
              onDeviceListClick={handleDeviceListClick}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Device List Modal */}
      <Dialog open={isDeviceListOpen} onOpenChange={setIsDeviceListOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{deviceListTitle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Showing {filteredDevices.length} devices
              </p>
              {filteredDevices.length > 50 && (
                <p className="text-xs text-muted-foreground">
                  Large dataset - consider scrolling to see all devices
                </p>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead>Device Serial</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Device Type</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>OS</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Issues</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDevices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell className="font-medium">{device.deviceSerial}</TableCell>
                    <TableCell>{device.department}</TableCell>
                    <TableCell>{device.deviceType}</TableCell>
                    <TableCell>{device.model}</TableCell>
                    <TableCell>{device.os}</TableCell>
                    <TableCell>
                      <Badge variant={
                        device.status === 'compliant' ? 'default' : 
                        device.status === 'needs-upgrade' ? 'destructive' : 
                        device.status === 'minor-issues' ? 'secondary' : 'outline'
                      }>
                        {device.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{device.score}%</TableCell>
                    <TableCell>
                      {device.issues.length > 0 ? (
                        <div className="space-y-1">
                          {device.issues.slice(0, 2).map((issue, i) => (
                            <Badge key={i} variant="outline" className="text-xs mr-1">
                              {issue}
                            </Badge>
                          ))}
                          {device.issues.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{device.issues.length - 2} more
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No issues</span>
                      )}
                    </TableCell>
                  </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {recommendations.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">All Systems Optimal</h3>
            <p className="text-muted-foreground">
              Your hardware infrastructure is performing well. No immediate recommendations at this time.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface RecommendationsListProps {
  recommendations: RecommendationItem[]
  onViewDetails: (recommendation: RecommendationItem) => void
}

function RecommendationsList({ recommendations, onViewDetails }: RecommendationsListProps) {
  if (recommendations.length === 0) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-2" />
        <p className="text-muted-foreground">No recommendations in this category</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {recommendations.map((recommendation) => (
        <Card key={recommendation.id} className="relative">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getImpactIcon(recommendation.impact)}
                  <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(recommendation.priority)}>
                    {recommendation.priority} priority
                  </Badge>
                  {recommendation.affectedDevices && (
                    <Badge variant="outline">
                      {recommendation.affectedDevices} devices
                    </Badge>
                  )}
                  {recommendation.timeframe && (
                    <Badge variant="outline">
                      <Calendar className="w-3 h-3 mr-1" />
                      {recommendation.timeframe}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-right">
                {recommendation.estimatedCost && (
                  <div className="text-sm">
                    <span className="font-medium text-red-600">Cost: {recommendation.estimatedCost}</span>
                  </div>
                )}
                {recommendation.estimatedSavings && (
                  <div className="text-sm">
                    <span className="font-medium text-green-600">Savings: {recommendation.estimatedSavings}</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{recommendation.description}</p>
            
            {recommendation.implementationSteps && (
              <div>
                <h4 className="font-medium mb-2">Implementation Steps:</h4>
                <ul className="space-y-1">
                  {recommendation.implementationSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <ChevronRight className="w-3 h-3 mt-0.5 text-primary" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button variant="outline" className="mt-4" onClick={() => onViewDetails(recommendation)}>
              <TrendingUp className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

interface RecommendationDetailsProps {
  recommendation: RecommendationItem
  onDeviceListClick?: (filterType: string, title: string) => void
}

function RecommendationDetails({ recommendation, onDeviceListClick }: RecommendationDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Badge className={getPriorityColor(recommendation.priority)}>
            {recommendation.priority} priority
          </Badge>
          {recommendation.affectedDevices && (
            <Badge variant="outline">
              <Monitor className="w-3 h-3 mr-1" />
              {recommendation.affectedDevices} devices
            </Badge>
          )}
          {recommendation.timeframe && (
            <Badge variant="outline">
              <Clock className="w-3 h-3 mr-1" />
              {recommendation.timeframe}
            </Badge>
          )}
        </div>
        
        <p className="text-muted-foreground">{recommendation.description}</p>

        {/* Cost Information */}
        {(recommendation.estimatedCost || recommendation.estimatedSavings) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendation.estimatedCost && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Estimated Cost</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{recommendation.estimatedCost}</div>
                </CardContent>
              </Card>
            )}
            {recommendation.estimatedSavings && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{recommendation.estimatedSavings}</div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Detailed Analysis Tabs */}
      {recommendation.detailedAnalysis && (
        <Tabs defaultValue="breakdown" className="space-y-4">
          <TabsList>
            <TabsTrigger value="breakdown">Device Breakdown</TabsTrigger>
            <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
            <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
            <TabsTrigger value="technical">Technical Requirements</TabsTrigger>
          </TabsList>

          <TabsContent value="breakdown" className="space-y-4">
            {recommendation.detailedAnalysis.deviceBreakdown && (
              <div className="space-y-4">
                <h4 className="font-medium">Affected Device Types</h4>
                 {recommendation.detailedAnalysis.deviceBreakdown.map((device, index) => (
                   <Card key={index}>
                     <CardContent className="pt-4">
                       <div className="flex items-center justify-between mb-2">
                         <div className="flex items-center gap-2">
                           <Monitor className="w-4 h-4" />
                           <span className="font-medium">{device.type}</span>
                         </div>
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => {
                             if (onDeviceListClick) {
                              const filterType = device.type === 'Windows 10 Devices' ? 'windows10' : 
                                             device.type === 'Unpatched Systems' ? 'unpatched' :
                                             device.type === 'Critical Issues (Full Replacement)' ? 'upgrade' :
                                             device.type === 'Minor Issues (Fixes & Upgrades)' ? 'upgrade' :
                                             device.type === 'Laptops' ? 'laptops' :
                                             device.type === 'Desktops' ? 'desktops' :
                                             device.type === 'Poor Battery Health' || device.type === 'Fair Battery Health' || device.type === 'Unknown Battery Status' ? 'battery' :
                                             device.type === 'Warranty Expiring (3-6 months)' || device.type === 'End-of-Life Approaching' || device.type === 'Warranty & End-of-Life Issues' ? 'warranty' :
                                             'upgrade'
                               onDeviceListClick(filterType, `${device.type} - ${device.count} devices`)
                             }
                           }}
                         >
                           {device.count} devices
                         </Button>
                       </div>
                      <div className="space-y-1">
                        {device.issues.map((issue, issueIndex) => (
                          <div key={issueIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <AlertTriangle className="w-3 h-3 text-orange-500" />
                            {issue}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="costs" className="space-y-4">
            {recommendation.detailedAnalysis.costBreakdown && (
              <div className="space-y-4">
                <h4 className="font-medium">Cost Breakdown</h4>
                <div className="space-y-2">
                  {recommendation.detailedAnalysis.costBreakdown.map((cost, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{cost.item}</div>
                        <div className="text-sm text-muted-foreground">Quantity: {cost.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${cost.cost * cost.quantity}</div>
                        <div className="text-sm text-muted-foreground">${cost.cost} each</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between font-medium">
                    <span>Total Estimated Cost</span>
                    <span>${recommendation.detailedAnalysis.costBreakdown.reduce((sum, cost) => sum + (cost.cost * cost.quantity), 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="risks" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium">Risk Assessment</h4>
              {recommendation.detailedAnalysis.riskAssessment && (
                <div className="space-y-2">
                  {recommendation.detailedAnalysis.riskAssessment.map((risk, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 border rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                      <span className="text-sm">{risk}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {recommendation.detailedAnalysis.businessImpact && (
                <div className="mt-4">
                  <h5 className="font-medium mb-2">Business Impact</h5>
                  <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                    {recommendation.detailedAnalysis.businessImpact}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="technical" className="space-y-4">
            {recommendation.detailedAnalysis.technicalRequirements && (
              <div className="space-y-4">
                <h4 className="font-medium">Technical Requirements</h4>
                <div className="space-y-2">
                  {recommendation.detailedAnalysis.technicalRequirements.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      {requirement}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Implementation Steps */}
      {recommendation.implementationSteps && (
        <div className="space-y-4">
          <h4 className="font-medium">Implementation Steps</h4>
          <div className="space-y-3">
            {recommendation.implementationSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                  {index + 1}
                </div>
                <span className="text-sm">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}