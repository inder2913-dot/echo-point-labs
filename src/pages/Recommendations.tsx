import { useState, useEffect } from "react"
import { Lightbulb, TrendingUp, Shield, DollarSign, Calendar, ChevronRight, AlertTriangle, CheckCircle, Target, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

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
        ]
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
        ]
      })
    }

    // Cost optimization
    if (analysis.costOptimization > 0) {
      recommendations.push({
        id: 'standardization',
        title: 'Standardize Hardware Portfolio',
        description: `Opportunity to reduce costs through hardware standardization. Currently using multiple device types - consolidating could save 15-25% on procurement.`,
        impact: 'medium',
        priority: 'medium',
        category: 'cost',
        estimatedSavings: `$${(analysis.costOptimization * 300).toLocaleString()}`,
        timeframe: '6-12 months',
        affectedDevices: analysis.costOptimization,
        implementationSteps: [
          'Define standard device configurations per user profile',
          'Negotiate volume pricing with preferred vendors',
          'Implement phased replacement during refresh cycles',
          'Establish centralized procurement process'
        ]
      })
    }

    // Compliance improvement
    if (analysis.complianceRate < 80) {
      recommendations.push({
        id: 'compliance-improvement',
        title: 'Improve Overall Compliance',
        description: `Current compliance rate is ${analysis.complianceRate}%. Implement automated compliance monitoring and remediation processes.`,
        impact: 'high',
        priority: 'high',
        category: 'planning',
        timeframe: '3-6 months',
        implementationSteps: [
          'Deploy device management and monitoring tools',
          'Establish compliance baseline requirements',
          'Implement automated compliance reporting',
          'Create remediation workflows for non-compliant devices'
        ]
      })
    }

    // Lifecycle management
    const oldDevices = devices.filter(d => 
      d.device?.warrantystatus === 'Expired' || 
      d.deviceos?.includes('Windows 10')
    ).length

    if (oldDevices > 0) {
      recommendations.push({
        id: 'lifecycle-management',
        title: 'Implement Device Lifecycle Management',
        description: `${oldDevices} devices are approaching end-of-life. Establish proactive replacement planning to avoid business disruption.`,
        impact: 'medium',
        priority: 'medium',
        category: 'planning',
        estimatedCost: `$${(oldDevices * 1200).toLocaleString()}`,
        timeframe: '12-18 months',
        affectedDevices: oldDevices,
        implementationSteps: [
          'Create device age and warranty tracking system',
          'Establish 3-5 year replacement cycles by device type',
          'Budget for annual hardware refresh program',
          'Implement asset disposal and data security procedures'
        ]
      })
    }

    // Performance optimization
    const lowPerformanceDevices = devices.filter(d => (d.score || 0) < 60).length
    if (lowPerformanceDevices > 0) {
      recommendations.push({
        id: 'performance-optimization',
        title: 'Optimize Device Performance',
        description: `${lowPerformanceDevices} devices show performance scores below 60%. Targeted optimizations can improve productivity without full hardware replacement.`,
        impact: 'medium',
        priority: 'medium',
        category: 'hardware',
        estimatedCost: `$${(lowPerformanceDevices * 150).toLocaleString()}`,
        timeframe: '1-2 months',
        affectedDevices: lowPerformanceDevices,
        implementationSteps: [
          'Perform disk cleanup and optimization',
          'Upgrade to SSD storage where applicable',
          'Optimize startup programs and services',
          'Consider selective RAM upgrades'
        ]
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
          <RecommendationsList recommendations={recommendations} />
        </TabsContent>

        <TabsContent value="hardware" className="space-y-4">
          <RecommendationsList recommendations={categoryRecommendations.hardware} />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <RecommendationsList recommendations={categoryRecommendations.security} />
        </TabsContent>

        <TabsContent value="cost" className="space-y-4">
          <RecommendationsList recommendations={categoryRecommendations.cost} />
        </TabsContent>

        <TabsContent value="planning" className="space-y-4">
          <RecommendationsList recommendations={categoryRecommendations.planning} />
        </TabsContent>
      </Tabs>

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
}

function RecommendationsList({ recommendations }: RecommendationsListProps) {
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

            <Button variant="outline" className="mt-4">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}