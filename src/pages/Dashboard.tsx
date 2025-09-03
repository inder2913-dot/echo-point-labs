import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Users, Target, Activity, Building2, TrendingUp, Shield, AlertTriangle, CheckCircle, Plus, Calendar, Eye } from "lucide-react"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UpdateProjectName } from "@/components/UpdateProjectName"
import { useToast } from "@/hooks/use-toast"

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchProjects()
  }, [])

  // Also fetch projects when the component becomes visible (user navigates back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchProjects()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const fetchProjects = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      title: "Total Projects",
      value: projects.length.toString(),
      description: "Completed analyses",
      icon: <Target className="h-4 w-4" />,
      trend: { value: projects.filter(p => p.status === 'completed').length, label: "completed", positive: true }
    },
    {
      title: "Industries",
      value: new Set(projects.map(p => p.organization_type)).size.toString(),
      description: "Industry types analyzed",
      icon: <Building2 className="h-4 w-4" />,
      trend: { value: 0, label: "unique types", positive: true }
    },
    {
      title: "Recent Activity",
      value: projects.filter(p => new Date(p.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length.toString(),
      description: "Projects this week",
      icon: <Activity className="h-4 w-4" />,
      trend: { value: 0, label: "this week", positive: true }
    }
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8 bg-background font-inter">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your workplace analytics projects and insights
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <DashboardCard key={index} {...stat} />
        ))}
      </div>

      {/* Projects Section */}
      <Card className="bg-background border-border shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Your Projects</CardTitle>
              <CardDescription>
                Recent workplace analytics projects and their status
              </CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/project">
                <Plus className="w-4 h-4 mr-2" />
                Start New Analysis
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8">
              <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-4">
                Start your first workplace analytics project to see insights here
              </p>
              <Button asChild>
                <Link to="/project">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Project
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{project.organization_type}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDate(project.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/project/${project.id}`}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-background border-border shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Start New Project</h3>
                <p className="text-sm text-muted-foreground">Begin a new workplace analytics project</p>
              </div>
            </div>
            <Button asChild className="w-full mt-4">
              <Link to="/project">Get Started</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-background border-border shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">View Analytics</h3>
                <p className="text-sm text-muted-foreground">Explore detailed project insights</p>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4" disabled={projects.length === 0}>
              View Reports
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-background border-border shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Security Overview</h3>
                <p className="text-sm text-muted-foreground">Review security recommendations</p>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4" disabled={projects.length === 0}>
              View Security
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}