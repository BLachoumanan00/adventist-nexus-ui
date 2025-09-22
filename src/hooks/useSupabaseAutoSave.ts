import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type TableName = 'students' | 'teachers' | 'subjects' | 'results' | 'communications' | 'classes' | 'attendance' | 'profiles' | 'schools' | 'student_subjects';

interface UseSupabaseAutoSaveOptions {
  data: any;
  table: TableName;
  enabled?: boolean;
  delay?: number;
  keyField?: string;
}

export const useSupabaseAutoSave = ({
  data,
  table,
  enabled = true,
  delay = 2000,
  keyField = 'id'
}: UseSupabaseAutoSaveOptions) => {
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedData = useRef<any>(null);

  useEffect(() => {
    if (!enabled || !data) return;

    // Check if data has actually changed
    const currentDataString = JSON.stringify(data);
    const lastDataString = JSON.stringify(lastSavedData.current);
    
    if (currentDataString === lastDataString) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(async () => {
      try {
        // For arrays of data (like students list)
        if (Array.isArray(data) && data.length > 0) {
          const updates = data.map(item => ({
            ...item,
            updated_at: new Date().toISOString()
          }));

          // Use upsert to handle both updates and inserts
          const { error } = await (supabase as any)
            .from(table)
            .upsert(updates, { 
              onConflict: keyField,
              ignoreDuplicates: false 
            });

          if (error) throw error;
        } 
        // For single objects
        else if (data && typeof data === 'object' && !Array.isArray(data)) {
          const updateData = {
            ...data,
            updated_at: new Date().toISOString()
          };

          if (data[keyField]) {
            // Update existing record
            const { error } = await (supabase as any)
              .from(table)
              .update(updateData)
              .eq(keyField, data[keyField]);

            if (error) throw error;
          } else {
            // Insert new record
            const { error } = await (supabase as any)
              .from(table)
              .insert([updateData]);

            if (error) throw error;
          }
        }

        lastSavedData.current = data;
        
        // Optional success notification (commented out to avoid spam)
        // toast({
        //   title: "Auto-saved",
        //   description: "Changes have been automatically saved.",
        //   duration: 2000,
        // });

      } catch (error) {
        console.error('Auto-save error:', error);
        toast({
          variant: "destructive",
          title: "Auto-save Failed",
          description: "Unable to save changes automatically. Please save manually.",
          duration: 5000,
        });
      }
    }, delay);

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, table, enabled, delay, keyField, toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
};