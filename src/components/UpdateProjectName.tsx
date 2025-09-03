import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function UpdateProjectName() {
  const [updating, setUpdating] = useState(false)
  const { toast } = useToast()

  const updateProjectName = async () => {
    setUpdating(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('projects')
        .update({ 
          name: 'Contoso Project - 03/09/2025',
          organization_type: 'Technology',
          industry: 'Software & Technology'
        })
        .eq('user_id', user.id)
        .eq('name', 'Unknown Project - 03/09/2025')

      if (error) throw error

      toast({
        title: "Success",
        description: "Project updated to 'Contoso Project'"
      })

      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Error updating project:', error)
      toast({
        title: "Error",
        description: "Failed to update project name",
        variant: "destructive"
      })
    } finally {
      setUpdating(false)
    }
  }

  return (
    <Button onClick={updateProjectName} disabled={updating}>
      {updating ? "Updating..." : "Update Project to Contoso"}
    </Button>
  )
}