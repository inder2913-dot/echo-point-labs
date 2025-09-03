import { Users, Target, Activity, Building2, TrendingUp, Shield, AlertTriangle, CheckCircle } from "lucide-react"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function Dashboard() {
  const stats = [
    {
      title: "Total Users Profiled",
      value: "2,847",
      description: "Active user profiles",
      icon: <Users className="h-4 w-4" />,
      trend: { value: 12, label: "from last month", positive: true }
    },
    {
      title: "Organizations",
      value: "24",
      description: "Multi-industry coverage",
      icon: <Building2 className="h-4 w-4" />,
      trend: { value: 8, label: "new this quarter", positive: true }
    },
    {
      title: "Baselines Set",
      value: "156",
      description: "Industry standards defined",
      icon: <Target className="h-4 w-4" />,
      trend: { value: 15, label: "updated recently", positive: true }
    },
    {
      title: "Endpoint Compliance",
      value: "87%",
      description: "Meeting baseline standards",
      icon: <Activity className="h-4 w-4" />,
      trend: { value: 5, label: "improvement", positive: true }
    }
  ]

  const recentActivities = [
    { action: "Baseline updated for Healthcare industry", time: "2 minutes ago", status: "success" },
    { action: "New user profile created - Marketing Dept", time: "5 minutes ago", status: "info" },
    { action: "Security recommendation generated", time: "12 minutes ago", status: "warning" },
    { action: "Endpoint analysis completed - 95% compliance", time: "18 minutes ago", status: "success" },
    { action: "Organization onboarded - TechCorp Inc", time: "1 hour ago", status: "info" },
  ]

  const criticalInsights = [
    {
      title: "Security Gap Identified",
      description: "15 endpoints in Finance dept below security baseline",
      priority: "high",
      action: "Review Security Settings"
    },
    {
      title: "Performance Opportunity",
      description: "Remote workers could benefit from enhanced mobility solutions",
      priority: "medium", 
      action: "Generate Recommendations"
    },
    {
      title: "Compliance Achievement",
      description: "Healthcare division reached 98% baseline compliance",
      priority: "low",
      action: "View Report"
    }
  ]

  return (
    <div className="flex-1 space-y-4 p-8 bg-background">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h2>
          <p className="text-muted-foreground">
            Real-time insights into your workplace analytics and endpoint management
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">Export Report</Button>
          <Button variant="hero">Create Profile</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <DashboardCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="col-span-4 bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Recent Activity</CardTitle>
            <CardDescription>
              Latest updates across your workplace analytics platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between border-b border-border last:border-0 pb-3 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-success' :
                    activity.status === 'warning' ? 'bg-warning' : 'bg-primary'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Critical Insights */}
        <Card className="col-span-3 bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Critical Insights</CardTitle>
            <CardDescription>
              Actionable recommendations for immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {criticalInsights.map((insight, index) => (
              <div key={index} className="space-y-2 border-b border-border last:border-0 pb-3 last:pb-0">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={insight.priority === 'high' ? 'destructive' : insight.priority === 'medium' ? 'default' : 'secondary'}>
                        {insight.priority}
                      </Badge>
                      <h4 className="text-sm font-medium text-card-foreground">{insight.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  {insight.action}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Compliance Overview */}
      <Card className="bg-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Baseline Compliance Overview</CardTitle>
          <CardDescription>
            Department-wise compliance against established workplace baselines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { dept: "Finance", compliance: 87, total: 120 },
              { dept: "Healthcare", compliance: 98, total: 85 },
              { dept: "Engineering", compliance: 92, total: 200 },
              { dept: "Marketing", compliance: 78, total: 65 },
              { dept: "Operations", compliance: 85, total: 150 },
              { dept: "HR", compliance: 94, total: 45 }
            ].map((dept, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-card-foreground">{dept.dept}</span>
                  <span className="text-sm text-muted-foreground">{dept.compliance}%</span>
                </div>
                <Progress value={dept.compliance} className="h-2" />
                <p className="text-xs text-muted-foreground">{dept.total} endpoints</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}