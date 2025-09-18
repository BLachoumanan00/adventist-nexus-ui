import { useEffect, useRef } from 'react';
import { useToast } from './use-toast';

interface UseAutoSaveOptions {
  data: any;
  saveFunction: (data: any) => Promise<void>;
  delay?: number;
  enabled?: boolean;
}

export const useAutoSave = ({ data, saveFunction, delay = 2000, enabled = true }: UseAutoSaveOptions) => {
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const initialLoadRef = useRef(true);
  const lastSavedDataRef = useRef<string>('');

  useEffect(() => {
    if (!enabled) return;

    // Skip auto-save on initial load
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      lastSavedDataRef.current = JSON.stringify(data);
      return;
    }

    // Check if data has actually changed
    const currentDataString = JSON.stringify(data);
    if (currentDataString === lastSavedDataRef.current) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(async () => {
      try {
        await saveFunction(data);
        lastSavedDataRef.current = currentDataString;
        toast({
          title: "Auto-saved",
          description: "Changes saved automatically",
          duration: 2000,
        });
      } catch (error) {
        console.error('Auto-save failed:', error);
        toast({
          variant: "destructive",
          title: "Auto-save failed",
          description: "Please save manually",
          duration: 3000,
        });
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, saveFunction, delay, enabled, toast]);

  return { isAutoSaveEnabled: enabled };
};