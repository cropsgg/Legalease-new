"use client"

import React, { createContext, useContext, useEffect } from "react"
import { useAuthStore, initializeAuth } from "@/lib/auth-store"

// Re-export the auth hook for backward compatibility
export const useAuth = () => {
  const store = useAuthStore()

  // Initialize auth on first load
  useEffect(() => {
    initializeAuth()
  }, [])

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

    // Legacy methods for backward compatibility
    signup: store.register,
  }
}

// Auth context for providers (optional, keeping for compatibility)
const AuthContext = createContext<ReturnType<typeof useAuth> | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth()

  useEffect(() => {
    // Initialize auth when provider mounts
    initializeAuth()
  }, [])

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
