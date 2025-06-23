import { useState, useCallback } from 'react';

export interface UseFormInputsResult<T> {
  values: T;
  setValue: (key: keyof T, value: string) => void;
  resetForm: () => void;
  handleInputChange: (key: keyof T) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Generic hook for managing form input state
 * Eliminates repetitive useState and onChange handlers
 */
export function useFormInputs<T extends Record<string, string>>(
  initialValues: T
): UseFormInputsResult<T> {
  const [values, setValues] = useState<T>(initialValues);

  const setValue = useCallback((key: keyof T, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleInputChange = useCallback((key: keyof T) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(key, e.target.value);
    }, [setValue]);

  return {
    values,
    setValue,
    resetForm,
    handleInputChange,
  };
}
