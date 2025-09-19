export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          created_at: string | null
          date: string
          id: string
          marked_by: string | null
          notes: string | null
          status: string
          student_id: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          marked_by?: string | null
          notes?: string | null
          status: string
          student_id?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          marked_by?: string | null
          notes?: string | null
          status?: string
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_marked_by_fkey"
            columns: ["marked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          capacity: number | null
          created_at: string | null
          grade_level: number
          id: string
          name: string
          section: string | null
          teacher_id: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          grade_level: number
          id?: string
          name: string
          section?: string | null
          teacher_id?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          grade_level?: number
          id?: string
          name?: string
          section?: string | null
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      communications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          message_type: string
          method: string
          recipient_email: string | null
          recipient_name: string | null
          recipient_phone: string | null
          sent_at: string | null
          sent_by: string | null
          status: string | null
          student_id: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          message_type: string
          method: string
          recipient_email?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          sent_at?: string | null
          sent_by?: string | null
          status?: string | null
          student_id?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          message_type?: string
          method?: string
          recipient_email?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          sent_at?: string | null
          sent_by?: string | null
          status?: string | null
          student_id?: string | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communications_sent_by_fkey"
            columns: ["sent_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          department: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      results: {
        Row: {
          academic_year: string | null
          created_at: string | null
          created_by: string | null
          exam_date: string | null
          exam_type: string
          grade: string | null
          id: string
          marks_obtained: number | null
          remarks: string | null
          student_id: string | null
          subject_id: string | null
          term: string | null
          total_marks: number | null
          updated_at: string | null
        }
        Insert: {
          academic_year?: string | null
          created_at?: string | null
          created_by?: string | null
          exam_date?: string | null
          exam_type: string
          grade?: string | null
          id?: string
          marks_obtained?: number | null
          remarks?: string | null
          student_id?: string | null
          subject_id?: string | null
          term?: string | null
          total_marks?: number | null
          updated_at?: string | null
        }
        Update: {
          academic_year?: string | null
          created_at?: string | null
          created_by?: string | null
          exam_date?: string | null
          exam_type?: string
          grade?: string | null
          id?: string
          marks_obtained?: number | null
          remarks?: string | null
          student_id?: string | null
          subject_id?: string | null
          term?: string | null
          total_marks?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "results_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "results_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "results_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          principal_name: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          principal_name?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          principal_name?: string | null
        }
        Relationships: []
      }
      student_subjects: {
        Row: {
          enrollment_date: string | null
          id: string
          is_active: boolean | null
          student_id: string | null
          subject_id: string | null
        }
        Insert: {
          enrollment_date?: string | null
          id?: string
          is_active?: boolean | null
          student_id?: string | null
          subject_id?: string | null
        }
        Update: {
          enrollment_date?: string | null
          id?: string
          is_active?: boolean | null
          student_id?: string | null
          subject_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_subjects_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_subjects_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          address: string | null
          class_id: string | null
          created_at: string | null
          date_of_birth: string | null
          disciplinary_records: Json | null
          emergency_contact: string | null
          emergency_phone: string | null
          enrollment_date: string | null
          full_name: string
          grade_level: number | null
          id: string
          parent_email: string | null
          parent_name: string | null
          parent_phone: string | null
          remarks: string | null
          responsible_parties: Json | null
          status: string | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          class_id?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          disciplinary_records?: Json | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          enrollment_date?: string | null
          full_name: string
          grade_level?: number | null
          id?: string
          parent_email?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          remarks?: string | null
          responsible_parties?: Json | null
          status?: string | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          class_id?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          disciplinary_records?: Json | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          enrollment_date?: string | null
          full_name?: string
          grade_level?: number | null
          id?: string
          parent_email?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          remarks?: string | null
          responsible_parties?: Json | null
          status?: string | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          code: string | null
          created_at: string | null
          credit_hours: number | null
          description: string | null
          grade_levels: number[] | null
          id: string
          is_active: boolean | null
          is_core_subject: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          credit_hours?: number | null
          description?: string | null
          grade_levels?: number[] | null
          id?: string
          is_active?: boolean | null
          is_core_subject?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          credit_hours?: number | null
          description?: string | null
          grade_levels?: number[] | null
          id?: string
          is_active?: boolean | null
          is_core_subject?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      teachers: {
        Row: {
          address: string | null
          created_at: string | null
          custom_fields: Json | null
          department: string | null
          email: string | null
          full_name: string
          hire_date: string | null
          id: string
          phone: string | null
          qualification: string | null
          salary: number | null
          status: string | null
          teacher_id: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          department?: string | null
          email?: string | null
          full_name: string
          hire_date?: string | null
          id?: string
          phone?: string | null
          qualification?: string | null
          salary?: number | null
          status?: string | null
          teacher_id: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          department?: string | null
          email?: string | null
          full_name?: string
          hire_date?: string | null
          id?: string
          phone?: string | null
          qualification?: string | null
          salary?: number | null
          status?: string | null
          teacher_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
