import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  fallbackPath?: string
}

export const AuthGuard = ({ 
  children, 
  requireAuth = true, 
  fallbackPath = '/login' 
}: AuthGuardProps) => {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      router.push(fallbackPath)
    }
  }, [isAuthenticated, isLoading, requireAuth, router, fallbackPath])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // If auth is required but user is not authenticated, don't render
  if (requireAuth && !isAuthenticated) {
    return null
  }

  return <>{children}</>
}

// Higher-order component for protecting pages
export const withAuthGuard = (
  Component: React.ComponentType,
  options: { requireAuth?: boolean; fallbackPath?: string } = {}
) => {
  return function ProtectedComponent(props: any) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    )
  }
}