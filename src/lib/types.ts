import { Database } from '@/integrations/supabase/types';

// Export commonly used types from Supabase generated types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Convenience type aliases for commonly used tables  
export type Student = Tables<'students'>;
export type Profile = Tables<'profiles'>;
export type BaseResult = Tables<'results'>;
export type Result = BaseResult & {
  student?: {
    id: string;
    student_id: string;
    full_name: string;
    class_id?: string | null;
  };
  subject?: {
    id: string;
    name: string;
    code?: string | null;
  };
};
export type Subject = Tables<'subjects'>;
export type Teacher = Tables<'teachers'>;
export type Attendance = Tables<'attendance'>;
export type Communication = Tables<'communications'>;
export type Class = Tables<'classes'>;
export type School = Tables<'schools'>;
export type StudentSubject = Tables<'student_subjects'>;