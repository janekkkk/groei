import { useCallback, useEffect, useRef, useState } from "react";

type SaveStatus = "saving" | "saved" | null;

interface UseAutoSaveOptions<T> {
  onSave: (data: T) => Promise<void> | void;
  debounceMs?: number;
  statusDurationMs?: number;
  shouldAutoSave?: (data: T) => boolean;
}

export const useAutoSave = <T>({
  onSave,
  debounceMs = 1000,
  statusDurationMs = 2000,
  shouldAutoSave = () => true,
}: UseAutoSaveOptions<T>) => {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const saveStatusTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSave = useCallback(
    async (data: T) => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      autoSaveTimeoutRef.current = setTimeout(async () => {
        if (!shouldAutoSave(data)) {
          setSaveStatus(null);
          return;
        }

        setSaveStatus("saving");

        try {
          await onSave(data);
          setSaveStatus("saved");

          // Keep 'saved' status visible for configured duration
          if (saveStatusTimeoutRef.current) {
            clearTimeout(saveStatusTimeoutRef.current);
          }
          saveStatusTimeoutRef.current = setTimeout(() => {
            setSaveStatus(null);
          }, statusDurationMs);
        } catch (error) {
          setSaveStatus(null);
          throw error;
        }
      }, debounceMs);
    },
    [onSave, debounceMs, statusDurationMs, shouldAutoSave],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      if (saveStatusTimeoutRef.current) {
        clearTimeout(saveStatusTimeoutRef.current);
      }
    };
  }, []);

  return {
    saveStatus,
    debouncedSave,
  };
};
