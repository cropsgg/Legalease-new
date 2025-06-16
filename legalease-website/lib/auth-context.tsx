"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type UserRole = "guest" | "user" | "admin"

type User = {
  id: string
  email?: string
  firstName?: string
  lastName?: string
  companyName?: string
  role: UserRole
  isGuest: boolean
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (userData: any) => Promise<void>
  loginAsGuest: () => void
  logout: () => void
  upgradeGuestToUser: (userData: any) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem("legalease-user")
    const guestSession = localStorage.getItem("legalease-guest-session")

    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else if (guestSession) {
      const guestData = JSON.parse(guestSession)
      setUser({
        id: guestData.id,
        firstName: "Guest",
        lastName: "User",
        role: "guest",
        isGuest: true,
      })
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const userData: User = {
      id: "user_" + Date.now(),
      email,
      firstName: "John",
      lastName: "Doe",
      companyName: "TechCorp",
      role: "user",
      isGuest: false,
    }

    setUser(userData)
    localStorage.setItem("legalease-user", JSON.stringify(userData))
    localStorage.removeItem("legalease-guest-session") // Clear any guest session
    setIsLoading(false)
  }

  const signup = async (userData: any) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newUser: User = {
      id: "user_" + Date.now(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      companyName: userData.companyName,
      role: "user",
      isGuest: false,
    }

    setUser(newUser)
    localStorage.setItem("legalease-user", JSON.stringify(newUser))
    localStorage.removeItem("legalease-guest-session") // Clear any guest session
    setIsLoading(false)
  }

  const loginAsGuest = () => {
    const guestId = "guest_" + Date.now()
    const guestUser: User = {
      id: guestId,
      firstName: "Guest",
      lastName: "User",
      role: "guest",
      isGuest: true,
    }

    setUser(guestUser)
    localStorage.setItem("legalease-guest-session", JSON.stringify({ id: guestId, timestamp: Date.now() }))
    localStorage.removeItem("legalease-user") // Clear any regular user session
  }

  const upgradeGuestToUser = async (userData: any) => {
    if (!user?.isGuest) return

    setIsLoading(true)

    // Simulate API call to upgrade guest to user
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const upgradedUser: User = {
      id: "user_" + Date.now(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      companyName: userData.companyName,
      role: "user",
      isGuest: false,
    }

    setUser(upgradedUser)
    localStorage.setItem("legalease-user", JSON.stringify(upgradedUser))
    localStorage.removeItem("legalease-guest-session")
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("legalease-user")
    localStorage.removeItem("legalease-guest-session")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        loginAsGuest,
        logout,
        upgradeGuestToUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
