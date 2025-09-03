import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { ArrowLeft, Building2, Users, Monitor, Target, TrendingUp, Calendar, Eye, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ProjectDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState<any>(null)
  const [projectData, setProjectData] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (id) {
      fetchProjectDetails()
    }
  }, [id])

  const fetchProjectDetails = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch project info
      const { data: projectInfo, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (projectError) throw projectError

      // Fetch project data
      const { data: projectDataResult, error: dataError } = await supabase
        .from('project_data')
        .select('*')
        .eq('project_id', id)

      if (dataError) throw dataError

      setProject(projectInfo)
      
      // Organize project data by step
      const organizedData: any = {}
      projectDataResult.forEach(item => {
        organizedData[item.step_name] = item.data
      })
      setProjectData(organizedData)

    } catch (error) {
      console.error('Error fetching project details:', error)
      toast({
        title: "Error",
        description: "Failed to load project details",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async () => {
    setDeleting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Delete project data first (due to foreign key relationship)
      const { error: dataError } = await supabase
        .from('project_data')
        .delete()
        .eq('project_id', id)

      if (dataError) throw dataError

      // Delete the project
      const { error: projectError } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (projectError) throw projectError

      toast({
        title: "Success",
        description: "Project deleted successfully",
      })

      // Navigate back to dashboard
      navigate('/')
    } catch (error) {
      console.error('Error deleting project:', error)
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive"
      })
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist or you don't have access to it.</p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-8 bg-background">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <p className="text-muted-foreground">Project details and analysis results</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={getStatusColor(project.status)}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </Badge>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={deleting}>
                <Trash2 className="w-4 h-4 mr-2" />
                {deleting ? "Deleting..." : "Delete Project"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Project</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{project.name}"? This action cannot be undone and will permanently remove all project data, including employee data, device inventory, and recommendations.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={deleteProject} 
                  disabled={deleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleting ? "Deleting..." : "Delete Project"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Project Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Organization</p>
                <p className="text-lg font-bold">{project.organization_type}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm font-semibold">{formatDate(project.created_at)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-sm font-semibold">{project.completed_at ? formatDate(project.completed_at) : 'In Progress'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Data */}
      {projectData.organizationSetup?.employeeData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Employee Data
            </CardTitle>
            <CardDescription>
              {projectData.organizationSetup.employeeData.length} employees analyzed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectData.organizationSetup.employeeData.slice(0, 5).map((employee: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{employee.id}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>{employee.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {projectData.organizationSetup.employeeData.length > 5 && (
              <p className="text-sm text-muted-foreground mt-2">
                Showing 5 of {projectData.organizationSetup.employeeData.length} employees
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Device Inventory */}
      {projectData.organizationSetup?.deviceData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Device Inventory
            </CardTitle>
            <CardDescription>
              {projectData.organizationSetup.deviceData.length} devices catalogued
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Specifications</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectData.organizationSetup.deviceData.slice(0, 5).map((device: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{device.deviceserial || device.deviceId}</TableCell>
                    <TableCell>{device.computername}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{device.deviceserial?.startsWith('LTP') ? 'Laptop' : device.deviceserial?.startsWith('DESK') ? 'Desktop' : 'Other'}</Badge>
                    </TableCell>
                    <TableCell>{device.devicemodel || device.model}</TableCell>
                    <TableCell className="text-xs">
                      {device.ramcapacity || device.ram} RAM, {device.cpucapacity || device.cpu}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {projectData.organizationSetup.deviceData.length > 5 && (
              <p className="text-sm text-muted-foreground mt-2">
                Showing 5 of {projectData.organizationSetup.deviceData.length} devices
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {projectData.recommendations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recommendations
            </CardTitle>
            <CardDescription>
              Generated recommendations and cost analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projectData.recommendations.costSavings && (
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Savings</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${projectData.recommendations.costSavings.total?.toLocaleString() || 0}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-muted-foreground">Upgrade Costs</p>
                    <p className="text-2xl font-bold text-red-600">
                      ${projectData.recommendations.costSavings.upgrades?.toLocaleString() || 0}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-muted-foreground">Downgrade Savings</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ${projectData.recommendations.costSavings.downgrades?.toLocaleString() || 0}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {projectData.recommendations.recommendations && (
              <div className="space-y-3">
                <h4 className="font-medium">Specific Recommendations</h4>
                {projectData.recommendations.recommendations.slice(0, 5).map((rec: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">{rec.title}</h5>
                      <Badge className={rec.priority === 'high' ? 'bg-red-100 text-red-800' : 
                                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                      'bg-green-100 text-green-800'}>
                        {rec.priority} priority
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                    <p className="text-sm"><strong>Impact:</strong> {rec.impact}</p>
                    {rec.cost && <p className="text-sm"><strong>Cost:</strong> ${rec.cost.toLocaleString()}</p>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}