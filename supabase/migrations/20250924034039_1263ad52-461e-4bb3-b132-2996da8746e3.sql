-- Drop the overly permissive existing policy
DROP POLICY IF EXISTS "Allow authenticated users full access" ON public.students;

-- Create security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Create function to check if user is a teacher of a specific student
CREATE OR REPLACE FUNCTION public.is_teacher_of_student(student_uuid uuid)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.classes c
    JOIN public.students s ON s.class_id = c.id
    JOIN public.profiles p ON p.id = auth.uid()
    WHERE s.id = student_uuid 
    AND c.teacher_id = auth.uid()
    AND p.role = 'teacher'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Create function to check if user is viewing their own student record
CREATE OR REPLACE FUNCTION public.is_own_student_record(student_uuid uuid)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.students s
    JOIN public.profiles p ON p.id = auth.uid()
    WHERE s.id = student_uuid 
    AND p.role = 'student'
    AND s.student_id = (SELECT student_id FROM public.students WHERE id = auth.uid())
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- RLS Policy: Admins can view all students
CREATE POLICY "Admins can view all students" ON public.students
  FOR SELECT USING (
    public.get_current_user_role() = 'admin'
  );

-- RLS Policy: Teachers can view students in their classes
CREATE POLICY "Teachers can view their students" ON public.students
  FOR SELECT USING (
    public.get_current_user_role() = 'teacher' AND 
    public.is_teacher_of_student(id)
  );

-- RLS Policy: Students can view their own record only
CREATE POLICY "Students can view own record" ON public.students
  FOR SELECT USING (
    public.get_current_user_role() = 'student' AND 
    public.is_own_student_record(id)
  );

-- RLS Policy: Only admins can insert new students
CREATE POLICY "Only admins can insert students" ON public.students
  FOR INSERT WITH CHECK (
    public.get_current_user_role() = 'admin'
  );

-- RLS Policy: Only admins can update student records
CREATE POLICY "Only admins can update students" ON public.students
  FOR UPDATE USING (
    public.get_current_user_role() = 'admin'
  );

-- RLS Policy: Only admins can delete students
CREATE POLICY "Only admins can delete students" ON public.students
  FOR DELETE USING (
    public.get_current_user_role() = 'admin'
  );