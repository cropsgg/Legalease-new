import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { authAPI, companiesAPI, handleAPIError } from './api'

// Types
export interface User {
  id: string
  email: string
  role: 'user' | 'admin'
  is_active: boolean
  is_superuser: boolean
  created_at: string
  updated_at?: string | null
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
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  companies: Company[]
  
  // Actions
  login: (email: string, password: string) => Promise<void>
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
  password: string
  firstName?: string
  lastName?: string
  companyName?: string
  companySize?: string
  role?: string
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      companies: [],

      // Login action
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        
        try {
          // Call login API
          const response = await authAPI.login({ username: email, password })
          const { access_token, token_type } = response
          
          // Store token
          localStorage.setItem('access_token', access_token)
          
          // Get user data
          const userData = await authAPI.getCurrentUser()
          
          set({
            user: { ...userData, isGuest: false },
            token: access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          
          // Clear any guest session
          localStorage.removeItem('guest_session')
          
        } catch (error: any) {
          const errorInfo = handleAPIError(error)
          set({
            isLoading: false,
            error: errorInfo.message,
            user: null,
            token: null,
            isAuthenticated: false,
          })
          throw error
        }
      },

      // Register action
      register: async (userData: RegisterData) => {
        set({ isLoading: true, error: null })
        
        try {
          // Register user
          const newUser = await authAPI.register(userData)
          
          // Auto-login after registration
          await get().login(userData.email, userData.password)
          
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
          role: 'user',
          is_active: true,
          is_superuser: false,
          created_at: new Date().toISOString(),
          firstName: 'Guest',
          lastName: 'User',
          isGuest: true,
        }
        
        set({
          user: guestUser,
          token: null,
          isAuthenticated: true,
          error: null,
        })
        
        // Store guest session
        localStorage.setItem('guest_session', JSON.stringify({
          id: guestUser.id,
          timestamp: Date.now(),
        }))
        
        // Clear any regular auth
        localStorage.removeItem('access_token')
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
          token: null,
          isAuthenticated: false,
          error: null,
          companies: [],
        })
      },

      // Get current user
      getCurrentUser: async () => {
        const token = localStorage.getItem('access_token')
        if (!token) return
        
        set({ isLoading: true })
        
        try {
          const userData = await authAPI.getCurrentUser()
          set({
            user: { ...userData, isGuest: false },
            token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          // Token might be invalid
          localStorage.removeItem('access_token')
          set({
            user: null,
            token: null,
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
        token: state.token,
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
  
  // Check for regular auth token
  const token = localStorage.getItem('access_token')
  if (token && !store.user) {
    store.getCurrentUser()
  }
}