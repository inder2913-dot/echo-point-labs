import { useState, useEffect } from "react"
import { Lightbulb, TrendingUp, TrendingDown, RefreshCw, Download, DollarSign, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface RecommendationEngineProps {
  onComplete: (data: any) => void
  initialData: any
}

export function RecommendationEngine({ onComplete, initialData }: RecommendationEngineProps) {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [filterType, setFilterType] = useState("all")
  const [costSavings, setCostSavings] = useState({ total: 0, upgrades: 0, downgrades: 0 })

  const generateRecommendations = () => {
    setIsGenerating(true)
    
    setTimeout(() => {
      const comparisonResults = initialData.deviceComparison || []
      const generatedRecs = []
      let totalSavings = 0
      let upgradeCosts = 0
      let downgradeSavings = 0
      
      comparisonResults.forEach(result => {
        const recommendations = []
        
        if (result.status === 'needs-upgrade') {
          const recommendation = {
            userId: result.id,
            userName: result.name,
            department: result.department,
            currentDevice: result.device,
            profile: result.profile,
            type: 'upgrade',
            priority: 'high',
            action: `Upgrade to ${result.profile?.baseline.deviceType} with ${result.profile?.baseline.minRam} RAM`,
            reasoning: result.issues.join(', '),
            estimatedCost: 1500,
            timeline: '30 days',
            impact: 'High productivity gain expected'
          }
          recommendations.push(recommendation)
          upgradeCosts += 1500
        }
        
        if (result.status === 'over-provisioned') {
          const recommendation = {
            userId: result.id,
            userName: result.name,
            department: result.department,
            currentDevice: result.device,
            profile: result.profile,
            type: 'downgrade',
            priority: 'medium',
            action: `Reassign to standard ${result.profile?.baseline.deviceType} configuration`,
            reasoning: 'Current device exceeds baseline requirements',
            estimatedCost: -800,
            timeline: '60 days',
            impact: 'No productivity impact, cost savings'
          }
          recommendations.push(recommendation)
          downgradeSavings += 800
        }
        
        if (result.status === 'minor-issues') {
          const recommendation = {
            userId: result.id,
            userName: result.name,
            department: result.department,
            currentDevice: result.device,
            profile: result.profile,
            type: 'maintain',
            priority: 'low',
            action: 'Continue with current device, schedule replacement in 12 months',
            reasoning: 'Device meets most requirements with minor optimization needed',
            estimatedCost: 0,
            timeline: '12 months',
            impact: 'Monitor performance'
          }
          recommendations.push(recommendation)
        }
        
        if (result.status === 'no-device') {
          const recommendation = {
            userId: result.id,
            userName: result.name,
            department: result.department,
            currentDevice: null,
            profile: result.profile,
            type: 'assign',
            priority: 'high',
            action: `Assign new ${result.profile?.baseline.deviceType}`,
            reasoning: 'No device currently assigned',
            estimatedCost: 1200,
            timeline: '14 days',
            impact: 'Essential for productivity'
          }
          recommendations.push(recommendation)
          upgradeCosts += 1200
        }
        
        generatedRecs.push(...recommendations)
      })
      
      totalSavings = downgradeSavings - upgradeCosts
      
      setRecommendations(generatedRecs)
      setCostSavings({
        total: totalSavings,
        upgrades: upgradeCosts,
        downgrades: downgradeSavings
      })
      setIsGenerating(false)
    }, 3000)
  }

  useEffect(() => {
    if (initialData.deviceComparison?.length > 0) {
      generateRecommendations()
    }
  }, [])

  const handleComplete = () => {
    onComplete({
      recommendations: recommendations,
      costAnalysis: costSavings,
      projectComplete: true
    })
  }

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'upgrade':
        return { icon: TrendingUp, color: 'bg-red-100 text-red-800', label: 'Upgrade' }
      case 'downgrade':
        return { icon: TrendingDown, color: 'bg-blue-100 text-blue-800', label: 'Downgrade' }
      case 'maintain':
        return { icon: RefreshCw, color: 'bg-green-100 text-green-800', label: 'Maintain' }
      case 'assign':
        return { icon: TrendingUp, color: 'bg-purple-100 text-purple-800', label: 'Assign Device' }
      default:
        return { icon: RefreshCw, color: 'bg-gray-100 text-gray-800', label: 'Other' }
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredRecommendations = recommendations.filter(rec => 
    filterType === 'all' || rec.type === filterType
  )

  const getTypeCounts = () => {
    return {
      upgrade: recommendations.filter(r => r.type === 'upgrade').length,
      downgrade: recommendations.filter(r => r.type === 'downgrade').length,
      maintain: recommendations.filter(r => r.type === 'maintain').length,
      assign: recommendations.filter(r => r.type === 'assign').length
    }
  }

  const typeCounts = getTypeCounts()

  return (
    <div className="space-y-6">
      {/* Generation Status */}
      {isGenerating && (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <div>
                <h3 className="text-lg font-medium">Generating Recommendations</h3>
                <p className="text-muted-foreground">Analyzing device gaps and creating optimization suggestions...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      {recommendations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Recommendations</p>
                  <p className="text-2xl font-bold">{recommendations.length}</p>
                </div>
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Upgrades Needed</p>
                  <p className="text-2xl font-bold">{typeCounts.upgrade + typeCounts.assign}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Potential Downgrades</p>
                  <p className="text-2xl font-bold">{typeCounts.downgrade}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Net Cost Impact</p>
                  <p className={`text-2xl font-bold ${costSavings.total < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ${Math.abs(costSavings.total).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {costSavings.total < 0 ? 'Investment' : 'Savings'}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recommendations Table */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                Device Optimization Recommendations
              </CardTitle>
              <div className="flex items-center gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Recommendations</SelectItem>
                    <SelectItem value="upgrade">Upgrades</SelectItem>
                    <SelectItem value="downgrade">Downgrades</SelectItem>
                    <SelectItem value="assign">New Assignments</SelectItem>
                    <SelectItem value="maintain">Maintain Current</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="recommendations" className="w-full">
              <TabsList>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="cost-analysis">Cost Analysis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recommendations" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Cost Impact</TableHead>
                      <TableHead>Timeline</TableHead>
                      <TableHead>Reasoning</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecommendations.map((rec, index) => {
                      const typeInfo = getTypeInfo(rec.type)
                      const TypeIcon = typeInfo.icon
                      
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{rec.userName}</p>
                              <p className="text-xs text-muted-foreground">{rec.department}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={typeInfo.color}>
                              <TypeIcon className="w-3 h-3 mr-1" />
                              {typeInfo.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(rec.priority)}>
                              {rec.priority}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <p className="text-sm">{rec.action}</p>
                          </TableCell>
                          <TableCell>
                            <span className={`font-medium ${rec.estimatedCost < 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {rec.estimatedCost === 0 ? '-' : 
                               rec.estimatedCost < 0 ? `-$${Math.abs(rec.estimatedCost)}` : 
                               `$${rec.estimatedCost}`}
                            </span>
                          </TableCell>
                          <TableCell>{rec.timeline}</TableCell>
                          <TableCell className="max-w-xs">
                            <p className="text-xs text-muted-foreground">{rec.reasoning}</p>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="cost-analysis" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Upgrade Investments</h3>
                      <p className="text-2xl font-bold text-red-600">${costSavings.upgrades.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {typeCounts.upgrade + typeCounts.assign} devices requiring investment
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Downgrade Savings</h3>
                      <p className="text-2xl font-bold text-green-600">${costSavings.downgrades.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {typeCounts.downgrade} devices can be optimized
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Net Impact</h3>
                      <p className={`text-2xl font-bold ${costSavings.total < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {costSavings.total < 0 ? '-' : '+'}${Math.abs(costSavings.total).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {costSavings.total < 0 ? 'Total investment required' : 'Total potential savings'}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Complete Project */}
      {recommendations.length > 0 && (
        <div className="flex justify-between">
          <Button variant="outline" onClick={generateRecommendations}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate Recommendations
          </Button>
          
          <Button onClick={handleComplete}>
            <Save className="w-4 h-4 mr-2" />
            Complete Project
          </Button>
        </div>
      )}
    </div>
  )
}