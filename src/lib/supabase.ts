import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'teacher' | 'student';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  student_id: string;
  full_name: string;
  date_of_birth?: string;
  gender?: string;
  phone?: string;
  address?: string;
  parent_name?: string;
  parent_phone?: string;
  parent_email?: string;
  class_id?: string;
  grade_level?: number;
  school_id: string;
  enrollment_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  name: string;
  code?: string;
  description?: string;
  grade: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Result {
  id: string;
  student_id: string;
  subject_id: string;
  exam_type: string;
  exam_name?: string;
  marks: number;
  max_marks: number;
  grade?: string;
  remarks?: string;
  exam_date?: string;
  academic_year: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  student?: Student;
  subject?: Subject;
}

export interface Attendance {
  id: string;
  student_id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  marked_by?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  student?: Student;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  recipient_id?: string;
  recipient_role?: 'admin' | 'teacher' | 'student';
  is_read: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}