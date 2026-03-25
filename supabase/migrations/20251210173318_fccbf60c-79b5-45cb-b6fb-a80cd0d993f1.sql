-- Fix contact_messages policies - make them permissive
DROP POLICY IF EXISTS "Admins can manage messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can view messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Anyone can submit contact" ON public.contact_messages;

-- Create permissive policies
CREATE POLICY "Admins can manage messages" ON public.contact_messages
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can submit contact" ON public.contact_messages
FOR INSERT WITH CHECK (true);