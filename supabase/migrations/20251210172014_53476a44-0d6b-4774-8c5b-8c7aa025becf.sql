-- Drop existing restrictive policies and recreate with proper permissive/restrictive setup

-- SERVICES
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
DROP POLICY IF EXISTS "Anyone can view active services" ON public.services;

CREATE POLICY "Admins can manage services" ON public.services
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can view active services" ON public.services
FOR SELECT USING (is_active = true);

-- PORTFOLIO
DROP POLICY IF EXISTS "Admins can manage portfolio" ON public.portfolio;
DROP POLICY IF EXISTS "Anyone can view active portfolio" ON public.portfolio;

CREATE POLICY "Admins can manage portfolio" ON public.portfolio
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can view active portfolio" ON public.portfolio
FOR SELECT USING (is_active = true);

-- REVIEWS
DROP POLICY IF EXISTS "Admins can manage reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can view active reviews" ON public.reviews;

CREATE POLICY "Admins can manage reviews" ON public.reviews
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can view active reviews" ON public.reviews
FOR SELECT USING (is_active = true);