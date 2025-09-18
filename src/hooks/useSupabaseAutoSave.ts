import { useAutoSave } from './useAutoSave';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

interface UseSupabaseAutoSaveOptions {
  data: any;
  table: string;
  delay?: number;
  enabled?: boolean;
}

export const useSupabaseAutoSave = ({ data, table, delay = 2000, enabled = true }: UseSupabaseAutoSaveOptions) => {
  const { user } = useAuth();

  const saveFunction = async (dataToSave: any) => {
    if (!user || !dataToSave) return;

    // Handle different save scenarios based on table and data structure
    if (table === 'students' && dataToSave.id) {
      const { error } = await supabase
        .from('students')
        .upsert({
          ...dataToSave,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
    } else if (table === 'results' && dataToSave.id) {
      const { error } = await supabase
        .from('results')
        .upsert({
          ...dataToSave,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
    } else if (table === 'subjects' && dataToSave.id) {
      const { error } = await supabase
        .from('subjects')
        .upsert({
          ...dataToSave,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
    }
  };

  return useAutoSave({
    data,
    saveFunction,
    delay,
    enabled: enabled && !!user
  });
};