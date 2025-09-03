import { useState, useEffect } from "react"
import { Building2, Calendar, Users, Monitor, FileText, ChevronRight, Plus, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

interface Project {
  id: string
  name: string
  status: string
  organization_type: string | null
  industry: string | null
  created_at: string
  updated_at: string
  completed_at: string | null
  user_id: string
  employeeCount?: number
  deviceCount?: number
  complianceScore?: number
}

interface ProjectStats {
  total: number
  completed: number
  inProgress: number
  draft: number
  totalEmployees: number
  totalDevices: number
  avgComplianceScore: number
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'in-progress':
      return 'bg-blue-100 text-blue-800'
    case 'draft':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return '✓'
    case 'in-progress':
      return '⏳'
    case 'draft':
      return '📝'
    default:
      return '📝'
  }
}

export default function Organizations() {
  const [projects, setProjects] = useState<Project[]>([])
  const [projectStats, setProjectStats] = useState<ProjectStats>({
    total: 0,
    completed: 0,
    inProgress: 0,
    draft: 0,
    totalEmployees: 0,
    totalDevices: 0,
    avgComplianceScore: 0
  })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get user's projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (projectsError) throw projectsError

      // Get project data for additional stats
      const { data: projectDataItems, error: dataError } = await supabase
        .from('project_data')
        .select('project_id, step_name, data')
        .in('project_id', projectsData?.map(p => p.id) || [])

      if (dataError) throw dataError

      // Process projects with additional data
      const enrichedProjects = (projectsData || []).map(project => {
        const projectData = projectDataItems?.filter(pd => pd.project_id === project.id) || []
        
        // Count employees and devices from project data
        const employeeData = projectData.find(pd => pd.step_name === 'employeeData')
        const deviceData = projectData.find(pd => pd.step_name === 'deviceInventory')
        const deviceComparison = projectData.find(pd => pd.step_name === 'deviceComparison')
        
        const employeeCount = Array.isArray(employeeData?.data) ? employeeData.data.length : 0
        const deviceCount = Array.isArray(deviceData?.data) ? deviceData.data.length : 0
        
        // Calculate compliance score from device comparison
        let complianceScore = 0
        if (Array.isArray(deviceComparison?.data)) {
          const scores = deviceComparison.data.map((item: any) => item.score || 0)
          complianceScore = scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0
        }

        return {
          ...project,
          employeeCount,
          deviceCount,
          complianceScore
        }
      })

      setProjects(enrichedProjects)

      // Calculate stats
      const stats: ProjectStats = {
        total: enrichedProjects.length,
        completed: enrichedProjects.filter(p => p.status === 'completed').length,
        inProgress: enrichedProjects.filter(p => p.status === 'in-progress').length,
        draft: enrichedProjects.filter(p => p.status === 'draft').length,
        totalEmployees: enrichedProjects.reduce((sum, p) => sum + (p.employeeCount || 0), 0),
        totalDevices: enrichedProjects.reduce((sum, p) => sum + (p.deviceCount || 0), 0),
        avgComplianceScore: enrichedProjects.length > 0 
          ? Math.round(enrichedProjects.reduce((sum, p) => sum + (p.complianceScore || 0), 0) / enrichedProjects.length)
          : 0
      }

      setProjectStats(stats)
    } catch (error) {
      console.error('Error loading projects:', error)
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = () => {
    navigate('/project')
  }

  const handleViewProject = (projectId: string) => {
    navigate(`/project/${projectId}`)
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
          <Building2 className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">My Projects</h1>
            <p className="text-muted-foreground">Manage your hardware analysis projects</p>
          </div>
        </div>
        <Button onClick={handleCreateProject} className="gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectStats.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{projectStats.completed}</div>
            <p className="text-xs text-muted-foreground">
              {projectStats.total > 0 ? Math.round((projectStats.completed / projectStats.total) * 100) : 0}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{projectStats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{projectStats.totalDevices}</div>
            <p className="text-xs text-muted-foreground">
              Avg: {projectStats.total > 0 ? Math.round(projectStats.totalDevices / projectStats.total) : 0} per project
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all-projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all-projects">All Projects</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
        </TabsList>

        <TabsContent value="all-projects" className="space-y-4">
          <ProjectsList projects={projects} onViewProject={handleViewProject} />
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <ProjectsList 
            projects={projects.filter(p => p.status === 'completed')} 
            onViewProject={handleViewProject} 
          />
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          <ProjectsList 
            projects={projects.filter(p => p.status === 'in-progress')} 
            onViewProject={handleViewProject} 
          />
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          <ProjectsList 
            projects={projects.filter(p => p.status === 'draft')} 
            onViewProject={handleViewProject} 
          />
        </TabsContent>
      </Tabs>

      {projects.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first hardware analysis project to get started.
            </p>
            <Button onClick={handleCreateProject} className="gap-2">
              <Plus className="w-4 h-4" />
              Create First Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface ProjectsListProps {
  projects: Project[]
  onViewProject: (projectId: string) => void
}

function ProjectsList({ projects, onViewProject }: ProjectsListProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No projects in this category</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project.id} className="relative hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusIcon(project.status)} {project.status}
                  </Badge>
                  {project.organization_type && (
                    <Badge variant="outline">{project.organization_type}</Badge>
                  )}
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onViewProject(project.id)}
                className="gap-1"
              >
                <Eye className="w-4 h-4" />
                View
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {project.industry && (
              <div className="text-sm">
                <span className="font-medium">Industry:</span>
                <span className="text-muted-foreground ml-1">{project.industry}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="font-medium">{project.employeeCount || 0}</div>
                  <div className="text-muted-foreground">Employees</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-purple-500" />
                <div>
                  <div className="font-medium">{project.deviceCount || 0}</div>
                  <div className="text-muted-foreground">Devices</div>
                </div>
              </div>
            </div>

            {project.complianceScore > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Compliance Score</span>
                  <span className="text-muted-foreground">{project.complianceScore}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      project.complianceScore >= 80 ? 'bg-green-500' : 
                      project.complianceScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${project.complianceScore}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Created {new Date(project.created_at).toLocaleDateString()}
              </div>
              {project.completed_at && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Completed {new Date(project.completed_at).toLocaleDateString()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}