import { useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';

interface AutoSaveOptions {
  data: any;
  saveKey: string;
  onSave?: (data: any) => Promise<void>;
  delay?: number;
  enabled?: boolean;
}

export function useAutoSave({ data, saveKey, onSave, delay = 2000, enabled = true }: AutoSaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef<string>('');

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      // Save to localStorage as backup
      localStorage.setItem(`draft_${saveKey}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));

      // Save to server if callback provided
      if (onSave) {
        await onSave(data);
      }
    }
  });

  useEffect(() => {
    if (!enabled || !data) return;

    const currentData = JSON.stringify(data);
    
    // Skip if data hasn't changed
    if (currentData === lastSavedRef.current) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      lastSavedRef.current = currentData;
      saveMutation.mutate(data);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, enabled, saveMutation, saveKey, onSave]);

  // Load draft from localStorage
  const loadDraft = () => {
    try {
      const saved = localStorage.getItem(`draft_${saveKey}`);
      if (saved) {
        const { data, timestamp } = JSON.parse(saved);
        // Only return draft if it's less than 24 hours old
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          return data;
        }
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
    return null;
  };

  // Clear draft
  const clearDraft = () => {
    localStorage.removeItem(`draft_${saveKey}`);
  };

  return {
    isSaving: saveMutation.isPending,
    lastSaved: lastSavedRef.current ? new Date() : null,
    loadDraft,
    clearDraft
  };
}