-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create job applications table
CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_number text NOT NULL UNIQUE,
  career_id uuid REFERENCES public.careers(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  resume_url text,
  cover_letter text,
  experience_years integer,
  current_company text,
  linkedin_url text,
  portfolio_url text,
  status text NOT NULL DEFAULT 'pending',
  is_general_application boolean DEFAULT false,
  admin_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can submit applications"
ON public.job_applications
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view own application by number"
ON public.job_applications
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage applications"
ON public.job_applications
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create function to generate application number
CREATE OR REPLACE FUNCTION public.generate_application_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.application_number := 'APP-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || SUBSTRING(NEW.id::text, 1, 8);
  RETURN NEW;
END;
$$;

-- Create trigger for application number
CREATE TRIGGER set_application_number
BEFORE INSERT ON public.job_applications
FOR EACH ROW
EXECUTE FUNCTION public.generate_application_number();

-- Create trigger for timestamps
CREATE TRIGGER update_job_applications_updated_at
BEFORE UPDATE ON public.job_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();