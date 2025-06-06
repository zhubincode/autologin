import { useState, useCallback } from "react";
import { AppError } from "../types";

export const useErrorHandler = () => {
  const [errors, setErrors] = useState<AppError[]>([]);

  // 在 addError 函数中确保生成 id
  const addError = (error: Omit<AppError, 'id' | 'timestamp'>) => {
    const newError: AppError = {
      ...error,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    setErrors(prev => [...prev, newError]);
  };

  const removeError = useCallback((timestamp: string) => {
    setErrors((prev) => prev.filter((error) => error.timestamp !== timestamp));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return {
    errors,
    addError,
    removeError,
    clearErrors,
  };
};
