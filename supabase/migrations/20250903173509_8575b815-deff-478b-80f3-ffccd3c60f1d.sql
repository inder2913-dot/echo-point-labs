-- Create custom_industries table
CREATE TABLE public.custom_industries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  starter_template text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.custom_industries ENABLE ROW LEVEL SECURITY;

-- Create policies for custom_industries
CREATE POLICY "Users can create their own custom industries" 
ON public.custom_industries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own custom industries" 
ON public.custom_industries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom industries" 
ON public.custom_industries 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom industries" 
ON public.custom_industries 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create custom_industry_profiles table to store profiles associated with custom industries
CREATE TABLE public.custom_industry_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  custom_industry_id uuid NOT NULL REFERENCES public.custom_industries(id) ON DELETE CASCADE,
  role text NOT NULL,
  department text NOT NULL,
  level text NOT NULL,
  hardware_cpu text NOT NULL DEFAULT 'Core i5',
  hardware_ram text NOT NULL DEFAULT '8GB',
  hardware_storage text NOT NULL DEFAULT '256GB SSD',
  hardware_graphics text NOT NULL DEFAULT 'Onboard',
  hardware_graphics_capacity text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.custom_industry_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for custom_industry_profiles (access controlled through custom_industries)
CREATE POLICY "Users can manage profiles for their own custom industries" 
ON public.custom_industry_profiles 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.custom_industries 
    WHERE custom_industries.id = custom_industry_profiles.custom_industry_id 
    AND custom_industries.user_id = auth.uid()
  )
);

-- Add trigger for updating updated_at column
CREATE TRIGGER update_custom_industries_updated_at
BEFORE UPDATE ON public.custom_industries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_custom_industry_profiles_updated_at
BEFORE UPDATE ON public.custom_industry_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();