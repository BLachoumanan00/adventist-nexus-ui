import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Student, TablesInsert, TablesUpdate } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('status', 'active')
        .order('full_name');

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch students. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async (studentData: TablesInsert<'students'>) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert([studentData])
        .select()
        .single();

      if (error) throw error;

      setStudents(prev => [...prev, data]);
      toast({
        title: "Student added",
        description: `${data.full_name} has been added successfully.`,
      });

      return { data, error: null };
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add student. Please try again.",
      });
      return { data: null, error };
    }
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setStudents(prev => 
        prev.map(student => student.id === id ? data : student)
      );

      toast({
        title: "Student updated",
        description: "Student information has been updated successfully.",
      });

      return { data, error: null };
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update student. Please try again.",
      });
      return { data: null, error };
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .update({ status: 'inactive' })
        .eq('id', id);

      if (error) throw error;

      setStudents(prev => prev.filter(student => student.id !== id));
      toast({
        title: "Student removed",
        description: "Student has been removed successfully.",
      });

      return { error: null };
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove student. Please try again.",
      });
      return { error };
    }
  };

  // Filter students based on search term and grade
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.student_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = !gradeFilter || student.class_id === gradeFilter;
    return matchesSearch && matchesGrade;
  });

  return {
    students: filteredStudents,
    allStudents: students,
    loading,
    searchTerm,
    setSearchTerm,
    gradeFilter,
    setGradeFilter,
    addStudent,
    updateStudent,
    deleteStudent,
    refetch: fetchStudents
  };
};