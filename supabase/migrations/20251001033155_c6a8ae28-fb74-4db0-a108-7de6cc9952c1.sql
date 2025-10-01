-- Phase 2: Fix RLS policies for all tables with overly permissive access
-- Fixed version with correct type handling

-- ==========================================
-- 1. Fix communications table
-- ==========================================
DROP POLICY IF EXISTS "Allow authenticated users full access" ON public.communications;

-- Admins can view all communications
CREATE POLICY "Admins can view all communications" ON public.communications
  FOR SELECT USING (public.get_current_user_role() = 'admin');

-- Teachers can view communications for their students
CREATE POLICY "Teachers can view student communications" ON public.communications
  FOR SELECT USING (
    public.get_current_user_role() = 'teacher' AND
    student_id IN (
      SELECT s.id FROM public.students s
      JOIN public.classes c ON s.class_id = c.id
      WHERE c.teacher_id = auth.uid()
    )
  );

-- Users can view communications they sent
CREATE POLICY "Users can view communications they sent" ON public.communications
  FOR SELECT USING (auth.uid() = sent_by);

-- Teachers and admins can insert communications
CREATE POLICY "Teachers and admins can send communications" ON public.communications
  FOR INSERT WITH CHECK (
    public.get_current_user_role() IN ('admin', 'teacher')
  );

-- Users can update their own communications
CREATE POLICY "Users can update own communications" ON public.communications
  FOR UPDATE USING (auth.uid() = sent_by);

-- Admins can update all communications
CREATE POLICY "Admins can update all communications" ON public.communications
  FOR UPDATE USING (public.get_current_user_role() = 'admin');

-- Admins can delete communications
CREATE POLICY "Admins can delete communications" ON public.communications
  FOR DELETE USING (public.get_current_user_role() = 'admin');

-- ==========================================
-- 2. Fix results table
-- ==========================================
DROP POLICY IF EXISTS "Allow authenticated users full access" ON public.results;

-- Students can view their own results
CREATE POLICY "Students can view own results" ON public.results
  FOR SELECT USING (
    public.get_current_user_role() = 'student' AND 
    public.is_own_student_record(student_id)
  );

-- Teachers can view results for their students
CREATE POLICY "Teachers can view student results" ON public.results
  FOR SELECT USING (
    public.get_current_user_role() = 'teacher' AND
    public.is_teacher_of_student(student_id)
  );

-- Admins can view all results
CREATE POLICY "Admins can view all results" ON public.results
  FOR SELECT USING (public.get_current_user_role() = 'admin');

-- Teachers and admins can insert results
CREATE POLICY "Teachers and admins can insert results" ON public.results
  FOR INSERT WITH CHECK (public.get_current_user_role() IN ('admin', 'teacher'));

-- Teachers can update results for their students
CREATE POLICY "Teachers can update student results" ON public.results
  FOR UPDATE USING (
    public.get_current_user_role() = 'teacher' AND
    public.is_teacher_of_student(student_id)
  );

-- Admins can update all results
CREATE POLICY "Admins can update all results" ON public.results
  FOR UPDATE USING (public.get_current_user_role() = 'admin');

-- Only admins can delete results
CREATE POLICY "Only admins can delete results" ON public.results
  FOR DELETE USING (public.get_current_user_role() = 'admin');

-- ==========================================
-- 3. Fix attendance table
-- ==========================================
DROP POLICY IF EXISTS "Allow authenticated users full access" ON public.attendance;

-- Students can view their own attendance
CREATE POLICY "Students can view own attendance" ON public.attendance
  FOR SELECT USING (
    public.get_current_user_role() = 'student' AND 
    public.is_own_student_record(student_id)
  );

-- Teachers can view attendance for their students
CREATE POLICY "Teachers can view student attendance" ON public.attendance
  FOR SELECT USING (
    public.get_current_user_role() = 'teacher' AND
    public.is_teacher_of_student(student_id)
  );

-- Admins can view all attendance
CREATE POLICY "Admins can view all attendance" ON public.attendance
  FOR SELECT USING (public.get_current_user_role() = 'admin');

-- Teachers and admins can mark attendance
CREATE POLICY "Teachers and admins can mark attendance" ON public.attendance
  FOR INSERT WITH CHECK (public.get_current_user_role() IN ('admin', 'teacher'));

-- Teachers can update attendance they marked
CREATE POLICY "Teachers can update attendance" ON public.attendance
  FOR UPDATE USING (
    public.get_current_user_role() = 'teacher' AND
    auth.uid() = marked_by
  );

-- Admins can update all attendance
CREATE POLICY "Admins can update all attendance" ON public.attendance
  FOR UPDATE USING (public.get_current_user_role() = 'admin');

-- Only admins can delete attendance
CREATE POLICY "Only admins can delete attendance" ON public.attendance
  FOR DELETE USING (public.get_current_user_role() = 'admin');

-- ==========================================
-- 4. Fix classes table
-- ==========================================
DROP POLICY IF EXISTS "Allow authenticated users full access" ON public.classes;

-- All authenticated users can view classes
CREATE POLICY "Authenticated users can view classes" ON public.classes
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Only admins can insert classes
CREATE POLICY "Only admins can insert classes" ON public.classes
  FOR INSERT WITH CHECK (public.get_current_user_role() = 'admin');

-- Teachers can update their own classes
CREATE POLICY "Teachers can update own classes" ON public.classes
  FOR UPDATE USING (
    public.get_current_user_role() = 'teacher' AND
    auth.uid() = teacher_id
  );

-- Admins can update all classes
CREATE POLICY "Admins can update all classes" ON public.classes
  FOR UPDATE USING (public.get_current_user_role() = 'admin');

-- Only admins can delete classes
CREATE POLICY "Only admins can delete classes" ON public.classes
  FOR DELETE USING (public.get_current_user_role() = 'admin');

-- ==========================================
-- 5. Fix subjects table
-- ==========================================
DROP POLICY IF EXISTS "Allow authenticated users full access" ON public.subjects;

-- All authenticated users can view active subjects
CREATE POLICY "Authenticated users can view active subjects" ON public.subjects
  FOR SELECT USING (auth.uid() IS NOT NULL AND is_active = true);

-- Admins can view all subjects including inactive
CREATE POLICY "Admins can view all subjects" ON public.subjects
  FOR SELECT USING (public.get_current_user_role() = 'admin');

-- Only admins can insert subjects
CREATE POLICY "Only admins can insert subjects" ON public.subjects
  FOR INSERT WITH CHECK (public.get_current_user_role() = 'admin');

-- Only admins can update subjects
CREATE POLICY "Only admins can update subjects" ON public.subjects
  FOR UPDATE USING (public.get_current_user_role() = 'admin');

-- Only admins can delete subjects
CREATE POLICY "Only admins can delete subjects" ON public.subjects
  FOR DELETE USING (public.get_current_user_role() = 'admin');

-- ==========================================
-- 6. Fix schools table
-- ==========================================
DROP POLICY IF EXISTS "Allow authenticated users full access" ON public.schools;

-- All authenticated users can view school info
CREATE POLICY "Authenticated users can view schools" ON public.schools
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Only admins can insert schools
CREATE POLICY "Only admins can insert schools" ON public.schools
  FOR INSERT WITH CHECK (public.get_current_user_role() = 'admin');

-- Only admins can update schools
CREATE POLICY "Only admins can update schools" ON public.schools
  FOR UPDATE USING (public.get_current_user_role() = 'admin');

-- Only admins can delete schools
CREATE POLICY "Only admins can delete schools" ON public.schools
  FOR DELETE USING (public.get_current_user_role() = 'admin');

-- ==========================================
-- 7. Fix student_subjects table
-- ==========================================
DROP POLICY IF EXISTS "Allow authenticated users full access" ON public.student_subjects;

-- Students can view their own subject enrollments
CREATE POLICY "Students can view own subject enrollments" ON public.student_subjects
  FOR SELECT USING (
    public.get_current_user_role() = 'student' AND 
    public.is_own_student_record(student_id)
  );

-- Teachers can view enrollments for their students
CREATE POLICY "Teachers can view student subject enrollments" ON public.student_subjects
  FOR SELECT USING (
    public.get_current_user_role() = 'teacher' AND
    public.is_teacher_of_student(student_id)
  );

-- Admins can view all enrollments
CREATE POLICY "Admins can view all subject enrollments" ON public.student_subjects
  FOR SELECT USING (public.get_current_user_role() = 'admin');

-- Only admins can insert subject enrollments
CREATE POLICY "Only admins can insert subject enrollments" ON public.student_subjects
  FOR INSERT WITH CHECK (public.get_current_user_role() = 'admin');

-- Only admins can update subject enrollments
CREATE POLICY "Only admins can update subject enrollments" ON public.student_subjects
  FOR UPDATE USING (public.get_current_user_role() = 'admin');

-- Only admins can delete subject enrollments
CREATE POLICY "Only admins can delete subject enrollments" ON public.student_subjects
  FOR DELETE USING (public.get_current_user_role() = 'admin');