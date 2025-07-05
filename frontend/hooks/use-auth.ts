import { useEffect } from 'react'
import { useAuthStore } from '@/lib/auth-store'

// Auth hook that uses Zustand store
export const useAuth = () => {
  const store = useAuthStore()

  // Initialize auth on first load
  useEffect(() => {
    if (!store.user && !store.isLoading) {
      const currentUser = localStorage.getItem('current_user')
      const guestSession = localStorage.getItem('guest_session')
      
      if (currentUser) {
        store.getCurrentUser()
      } else if (guestSession) {
        try {
          const { timestamp } = JSON.parse(guestSession)
          // Check if guest session is not too old (24 hours)
          if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
            store.loginAsGuest()
          } else {
            localStorage.removeItem('guest_session')
          }
        } catch (error) {
          localStorage.removeItem('guest_session')
        }
      }
    }
  }, [store])

  return {
    // State
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    companies: store.companies,
    
    // Actions
    login: store.login,
    register: store.register,
    logout: store.logout,
    loginAsGuest: store.loginAsGuest,
    upgradeGuestToUser: store.upgradeGuestToUser,
    clearError: store.clearError,
    
    // Company actions
    fetchCompanies: store.fetchCompanies,
    createCompany: store.createCompany,
    updateCompany: store.updateCompany,
    deleteCompany: store.deleteCompany,
  }
}