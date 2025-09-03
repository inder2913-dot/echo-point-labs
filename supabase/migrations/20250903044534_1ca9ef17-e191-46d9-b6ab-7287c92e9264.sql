-- Add DELETE policies for projects table
CREATE POLICY "Users can delete their own projects" 
ON public.projects 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add DELETE policies for project_data table  
CREATE POLICY "Users can delete their own project data" 
ON public.project_data 
FOR DELETE 
USING (EXISTS ( SELECT 1
   FROM projects
  WHERE ((projects.id = project_data.project_id) AND (projects.user_id = auth.uid()))));