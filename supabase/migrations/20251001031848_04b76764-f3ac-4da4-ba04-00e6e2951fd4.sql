-- Fix teachers table RLS policies to protect sensitive personal data
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Allow authenticated users full access" ON public.teachers;

-- Admins can view all teachers
CREATE POLICY "Admins can view all teachers" ON public.teachers
  FOR SELECT USING (public.get_current_user_role() = 'admin');

-- Admins can insert teachers
CREATE POLICY "Admins can insert teachers" ON public.teachers
  FOR INSERT WITH CHECK (public.get_current_user_role() = 'admin');

-- Admins can update teachers
CREATE POLICY "Admins can update teachers" ON public.teachers
  FOR UPDATE USING (public.get_current_user_role() = 'admin');

-- Admins can delete teachers
CREATE POLICY "Admins can delete teachers" ON public.teachers
  FOR DELETE USING (public.get_current_user_role() = 'admin');

-- Teachers can view other teachers (read-only, for collaboration purposes)
CREATE POLICY "Teachers can view colleagues" ON public.teachers
  FOR SELECT USING (public.get_current_user_role() = 'teacher');