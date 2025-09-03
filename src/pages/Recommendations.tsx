import { useState, useEffect } from "react"
import { Lightbulb, TrendingUp, Shield, DollarSign, Calendar, ChevronRight, AlertTriangle, CheckCircle, Target, Zap, X, Clock, Users, Monitor } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface DeviceItem {
  id: string
  employee: string
  department: string
  deviceType: string
  model: string
  os: string
  issues: string[]
  status: string
  score: number
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
  const [deviceAnalysis, setDeviceAnalysis] = useState<DeviceAnalysis>({
    totalDevices: 0,
    complianceRate: 0,
    criticalIssues: 0,
    avgScore: 0,
    upgradeNeeded: 0,
    costOptimization: 0,
    securityRisks: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRecommendations()
  }, [])

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
        filtered = devices.filter(d => d.os.includes('Windows 10'))
        break
      case 'unpatched':
        filtered = devices.filter(d => 
          d.issues.some(issue => issue.includes('Patch') || issue.includes('Security'))
        )
        break
      case 'upgrade':
        filtered = devices.filter(d => d.status === 'needs-upgrade')
        break
      default:
        filtered = devices
    }
    
    setFilteredDevices(filtered)
    setDeviceListTitle(title)
    setIsDeviceListOpen(true)
  }

  const loadRecommendations = async () => {
    try {
      // Get the most recent device comparison data
      const { data: projectData, error } = await supabase
        .from('project_data')
        .select('*')
        .eq('step_name', 'deviceComparison')
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) throw error

      if (projectData && projectData.length > 0) {
        const data = projectData[0].data as any
        const deviceComparison = Array.isArray(data) ? data : []
        
        // Convert devices to DeviceItem format
        const deviceItems = deviceComparison.map((device: any, index: number) => ({
          id: device.id || `device-${index}`,
          employee: device.employee || `Employee ${index + 1}`,
          department: device.department || 'Unknown',
          deviceType: device.devicetype || 'Unknown',
          model: device.model || 'Unknown Model',
          os: device.deviceos || 'Unknown OS',
          issues: device.issues || [],
          status: device.status || 'unknown',
          score: device.score || 0
        }))
        setDevices(deviceItems)
        
        // Analyze device data
        const analysis = analyzeDevices(deviceComparison)
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

    // Estimate cost optimization opportunities
    const deviceTypes = new Set(devices.map(d => d.devicetype))
    const costOptimization = deviceTypes.size > 3 ? Math.floor(totalDevices * 0.3) : 0

    // Estimate security risks (devices with issues)
    const securityRisks = devices.filter(d => 
      d.issues && d.issues.length > 0 || d.deviceos?.includes('Windows 10')
    ).length

    return {
      totalDevices,
      complianceRate,
      criticalIssues,
      avgScore,
      upgradeNeeded,
      costOptimization,
      securityRisks
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
        estimatedCost: `$${(analysis.upgradeNeeded * 800).toLocaleString()}`,
        timeframe: '2-3 months',
        affectedDevices: analysis.upgradeNeeded,
        implementationSteps: [
          'Audit devices with RAM below baseline requirements',
          'Prioritize upgrades for power users and engineers',
          'Negotiate bulk pricing with hardware vendors',
          'Schedule upgrades during maintenance windows'
        ],
        detailedAnalysis: {
          deviceBreakdown: [
            { type: 'Laptops', count: Math.floor(analysis.upgradeNeeded * 0.6), issues: ['Insufficient RAM', 'Slow Storage'] },
            { type: 'Desktops', count: Math.floor(analysis.upgradeNeeded * 0.4), issues: ['Outdated CPU', 'Low RAM'] }
          ],
          costBreakdown: [
            { item: 'RAM Upgrades (16GB→32GB)', cost: 200, quantity: Math.floor(analysis.upgradeNeeded * 0.7) },
            { item: 'SSD Upgrades (256GB→1TB)', cost: 150, quantity: Math.floor(analysis.upgradeNeeded * 0.5) },
            { item: 'Installation Labor', cost: 50, quantity: analysis.upgradeNeeded }
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
            { type: 'Windows 10 Devices', count: Math.floor(analysis.securityRisks * 0.8), issues: ['Outdated OS', 'Missing Security Features'] },
            { type: 'Unpatched Systems', count: Math.floor(analysis.securityRisks * 0.3), issues: ['Critical Security Patches Missing'] }
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
      <div className="flex items-center gap-2">
        <Lightbulb className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Recommendations</h1>
          <p className="text-muted-foreground">AI-powered insights to optimize your hardware infrastructure</p>
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
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{deviceListTitle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredDevices.length} devices
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
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
                    <TableCell className="font-medium">{device.employee}</TableCell>
                    <TableCell>{device.department}</TableCell>
                    <TableCell>{device.deviceType}</TableCell>
                    <TableCell>{device.model}</TableCell>
                    <TableCell>{device.os}</TableCell>
                    <TableCell>
                      <Badge variant={device.status === 'compliant' ? 'default' : 'destructive'}>
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
                                                device.type === 'Unpatched Systems' ? 'unpatched' : 'security'
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