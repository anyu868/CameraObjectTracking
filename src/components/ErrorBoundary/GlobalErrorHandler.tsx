import React, { useEffect } from 'react'
import { create } from 'zustand'

interface AppError {
  message: string
  timestamp: number
  stack?: string
}

interface ErrorStore {
  errors: AppError[]
  addError: (error: Error) => void
  clearErrors: () => void
  removeError: (timestamp: number) => void
}

export const useErrorStore = create<ErrorStore>((set) => ({
  errors: [],
  addError: (error: Error) =>
    set((state) => ({
      errors: [
        ...state.errors,
        {
          message: error.message,
          timestamp: Date.now(),
          stack: error.stack
        }
      ].slice(-5)
    })),
  clearErrors: () => set({ errors: [] }),
  removeError: (timestamp: number) =>
    set((state) => ({
      errors: state.errors.filter((e) => e.timestamp !== timestamp)
    }))
}))

interface GlobalErrorHandlerProps {
  children: React.ReactNode
}

export function GlobalErrorHandler({ children }: GlobalErrorHandlerProps): JSX.Element {
  const { addError } = useErrorStore()

  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent): void => {
      addError(new Error(event.message))
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
      addError(new Error(event.reason?.message || 'Unhandled Promise Rejection'))
    }

    window.addEventListener('error', handleGlobalError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleGlobalError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [addError])

  return <>{children}</>
}
