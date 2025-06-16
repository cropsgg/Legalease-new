"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { AppSidebar } from "@/components/app-sidebar"
import Header from "@/components/header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Authenticated users get sidebar layout
  if (user) {
    return (
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset>
          <main className="flex-1 overflow-auto">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  // Unauthenticated users get header layout
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  )
}
