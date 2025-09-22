import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Result, TablesInsert } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export const useResults = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('');
  const [subjectFilter, setSubjectFilter] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('results')
        .select(`
          *,
          student:students(id, student_id, full_name),
          subject:subjects(id, name, code)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error('Error fetching results:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch results. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const addResult = async (resultData: TablesInsert<'results'>) => {
    try {
      const { data, error } = await supabase
        .from('results')
        .insert([resultData])
        .select(`
          *,
          student:students(id, student_id, full_name),
          subject:subjects(id, name, code)
        `)
        .single();

      if (error) throw error;

      setResults(prev => [data, ...prev]);
      toast({
        title: "Result added",
        description: "Student result has been added successfully.",
      });

      return { data, error: null };
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add result. Please try again.",
      });
      return { data: null, error };
    }
  };

  const updateResult = async (id: string, updates: Partial<Result>) => {
    try {
      const { data, error } = await supabase
        .from('results')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          student:students(id, student_id, full_name),
          subject:subjects(id, name, code)
        `)
        .single();

      if (error) throw error;

      setResults(prev => 
        prev.map(result => result.id === id ? data : result)
      );

      toast({
        title: "Result updated",
        description: "Student result has been updated successfully.",
      });

      return { data, error: null };
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update result. Please try again.",
      });
      return { data: null, error };
    }
  };

  const deleteResult = async (id: string) => {
    try {
      const { error } = await supabase
        .from('results')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setResults(prev => prev.filter(result => result.id !== id));
      toast({
        title: "Result deleted",
        description: "Student result has been deleted successfully.",
      });

      return { error: null };
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete result. Please try again.",
      });
      return { error };
    }
  };

  const getStudentResults = (studentId: string, academicYear?: string) => {
    return results.filter(result => {
      const matchesStudent = result.student_id === studentId;
      const matchesYear = !academicYear || result.academic_year === academicYear;
      return matchesStudent && matchesYear;
    });
  };

  // Filter results based on search term, grade, and subject
  const filteredResults = results.filter(result => {
    const matchesSearch = result.student?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.student?.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.subject?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = !gradeFilter || result.student?.class_id === gradeFilter;
    const matchesSubject = !subjectFilter || result.subject_id === subjectFilter;
    return matchesSearch && matchesGrade && matchesSubject;
  });

  return {
    results: filteredResults,
    allResults: results,
    loading,
    searchTerm,
    setSearchTerm,
    gradeFilter,
    setGradeFilter,
    subjectFilter,
    setSubjectFilter,
    addResult,
    updateResult,
    deleteResult,
    getStudentResults,
    refetch: fetchResults
  };
};