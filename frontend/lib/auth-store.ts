import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { authAPI, companiesAPI, handleAPIError } from './api'

// Types
export interface User {
  id: string
  email: string
  full_name: string
  role: 'user' | 'admin'
  created_at: string
  updated_at?: string | null
  last_login?: string | null
  // Extended user data
  firstName?: string
  lastName?: string
  companyName?: string
  isGuest: boolean
}

export interface Company {
  id: string
  name: string
  owner_id: string
  created_at: string
  updated_at?: string | null
}

export interface AuthState {
  // State
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  companies: Company[]
  
  // Actions
  login: (email: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  loginAsGuest: () => void
  upgradeGuestToUser: (userData: RegisterData) => Promise<void>
  clearError: () => void
  getCurrentUser: () => Promise<void>
  
  // Company actions
  fetchCompanies: () => Promise<void>
  createCompany: (name: string) => Promise<Company>
  updateCompany: (id: string, name: string) => Promise<Company>
  deleteCompany: (id: string) => Promise<void>
}

export interface RegisterData {
  email: string
  full_name: string
  firstName?: string
  lastName?: string
  companyName?: string
  companySize?: string
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      companies: [],

      // Login action (email-only)
      login: async (email: string) => {
        set({ isLoading: true, error: null })
        
        try {
          // Call login API with email only
          const response = await authAPI.login({ email })
          const userData = response.user
          
          // Store user data
          localStorage.setItem('current_user', JSON.stringify(userData))
          localStorage.setItem('current_user_email', email)
          
          set({
            user: { ...userData, isGuest: false },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          
          // Clear any guest session
          localStorage.removeItem('guest_session')
          
        } catch (error: any) {
          const errorInfo = handleAPIError(error)
          
          // If user not found, suggest signup
          if (error.response?.status === 401 && errorInfo.message.includes('not found')) {
            set({
              isLoading: false,
              error: 'Email not found. Please sign up first.',
              user: null,
              isAuthenticated: false,
            })
          } else {
            set({
              isLoading: false,
              error: errorInfo.message,
              user: null,
              isAuthenticated: false,
            })
          }
          throw error
        }
      },

      // Register action (email + full name)
      register: async (userData: RegisterData) => {
        set({ isLoading: true, error: null })
        
        try {
          // Register user
          const response = await authAPI.register({
            email: userData.email,
            full_name: userData.full_name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
          })
          
          const newUser = response.user
          
          // Store user data
          localStorage.setItem('current_user', JSON.stringify(newUser))
          localStorage.setItem('current_user_email', userData.email)
          
          set({
            user: { ...newUser, isGuest: false },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          
          // Create company if provided
          if (userData.companyName) {
            await get().createCompany(userData.companyName)
          }
          
        } catch (error: any) {
          const errorInfo = handleAPIError(error)
          set({
            isLoading: false,
            error: errorInfo.message,
          })
          throw error
        }
      },

      // Guest login
      loginAsGuest: () => {
        const guestUser: User = {
          id: `guest_${Date.now()}`,
          email: 'guest@legalease.com',
          full_name: 'Guest User',
          role: 'user',
          created_at: new Date().toISOString(),
          firstName: 'Guest',
          lastName: 'User',
          isGuest: true,
        }
        
        set({
          user: guestUser,
          isAuthenticated: true,
          error: null,
        })
        
        // Store guest session
        localStorage.setItem('guest_session', JSON.stringify({
          id: guestUser.id,
          timestamp: Date.now(),
        }))
        
        // Clear any regular auth
        localStorage.removeItem('current_user')
        localStorage.removeItem('current_user_email')
      },

      // Upgrade guest to user
      upgradeGuestToUser: async (userData: RegisterData) => {
        const currentUser = get().user
        if (!currentUser?.isGuest) {
          throw new Error('Not a guest user')
        }
        
        set({ isLoading: true, error: null })
        
        try {
          // Register the user
          await get().register(userData)
          
          // Clear guest session
          localStorage.removeItem('guest_session')
          
        } catch (error: any) {
          const errorInfo = handleAPIError(error)
          set({
            isLoading: false,
            error: errorInfo.message,
          })
          throw error
        }
      },

      // Logout action
      logout: () => {
        authAPI.logout()
        localStorage.removeItem('guest_session')
        set({
          user: null,
          isAuthenticated: false,
          error: null,
          companies: [],
        })
      },

      // Get current user
      getCurrentUser: async () => {
        const currentUserEmail = localStorage.getItem('current_user_email')
        const currentUser = localStorage.getItem('current_user')
        
        if (!currentUserEmail || !currentUser) return
        
        set({ isLoading: true })
        
        try {
          const userData = await authAPI.getUserByEmail(currentUserEmail)
          set({
            user: { ...userData, isGuest: false },
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          // User data might be invalid
          localStorage.removeItem('current_user')
          localStorage.removeItem('current_user_email')
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null })
      },

      // Company actions
      fetchCompanies: async () => {
        try {
          const companies = await companiesAPI.list()
          set({ companies })
        } catch (error: any) {
          const errorInfo = handleAPIError(error)
          set({ error: errorInfo.message })
        }
      },

      createCompany: async (name: string) => {
        try {
          const company = await companiesAPI.create({ name })
          set((state) => ({
            companies: [...state.companies, company]
          }))
          return company
        } catch (error: any) {
          const errorInfo = handleAPIError(error)
          set({ error: errorInfo.message })
          throw error
        }
      },

      updateCompany: async (id: string, name: string) => {
        try {
          const company = await companiesAPI.update(id, { name })
          set((state) => ({
            companies: state.companies.map(c => c.id === id ? company : c)
          }))
          return company
        } catch (error: any) {
          const errorInfo = handleAPIError(error)
          set({ error: errorInfo.message })
          throw error
        }
      },

      deleteCompany: async (id: string) => {
        try {
          await companiesAPI.delete(id)
          set((state) => ({
            companies: state.companies.filter(c => c.id !== id)
          }))
        } catch (error: any) {
          const errorInfo = handleAPIError(error)
          set({ error: errorInfo.message })
          throw error
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Initialize auth state on app start
export const initializeAuth = () => {
  const store = useAuthStore.getState()
  
  // Check for guest session
  const guestSession = localStorage.getItem('guest_session')
  if (guestSession && !store.user) {
    try {
      const { id, timestamp } = JSON.parse(guestSession)
      // Check if guest session is not too old (24 hours)
      if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
        store.loginAsGuest()
        return
      } else {
        localStorage.removeItem('guest_session')
      }
    } catch (error) {
      localStorage.removeItem('guest_session')
    }
  }
  
  // Check for regular auth
  const currentUser = localStorage.getItem('current_user')
  if (currentUser && !store.user) {
    store.getCurrentUser()
  }
}