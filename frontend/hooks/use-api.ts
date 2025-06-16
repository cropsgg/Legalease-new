import { useState, useCallback } from 'react'
import { healthAPI, handleAPIError } from '@/lib/api'

// Hook for API operations with loading and error states
export const useAPI = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const executeAPI = useCallback(async <T>(apiCall: () => Promise<T>): Promise<T | null> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await apiCall()
      setIsLoading(false)
      return result
    } catch (error: any) {
      const errorInfo = handleAPIError(error)
      setError(errorInfo.message)
      setIsLoading(false)
      return null
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    isLoading,
    error,
    executeAPI,
    clearError,
  }
}

// Hook for health check
export const useHealthCheck = () => {
  const { isLoading, error, executeAPI, clearError } = useAPI()

  const checkHealth = useCallback(async () => {
    return await executeAPI(healthAPI.check)
  }, [executeAPI])

  return {
    isLoading,
    error,
    checkHealth,
    clearError,
  }
}

// Hook for form handling with validation
export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validationSchema?: (values: T) => Record<string, string>
) => {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const setValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name as string]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }, [errors])

  const setFieldTouched = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }))
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setValue(name, type === 'checkbox' ? checked : value)
  }, [setValue])

  const handleSelectChange = useCallback((name: keyof T, value: string) => {
    setValue(name, value)
  }, [setValue])

  const validate = useCallback(() => {
    if (!validationSchema) return true
    
    const validationErrors = validationSchema(values)
    setErrors(validationErrors)
    return Object.keys(validationErrors).length === 0
  }, [values, validationSchema])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    handleInputChange,
    handleSelectChange,
    validate,
    reset,
    isValid: Object.keys(errors).length === 0,
  }
}

// Hook for toast notifications (you can integrate with your toast library)
export const useToast = () => {
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    // You can integrate with react-hot-toast, sonner, or any other toast library
    console.log(`${type.toUpperCase()}: ${message}`)
    
    // For now, we'll use a simple alert, but you should replace this with a proper toast
    if (type === 'error') {
      alert(`Error: ${message}`)
    }
  }, [])

  return {
    showToast,
    success: (message: string) => showToast(message, 'success'),
    error: (message: string) => showToast(message, 'error'),
    info: (message: string) => showToast(message, 'info'),
  }
}