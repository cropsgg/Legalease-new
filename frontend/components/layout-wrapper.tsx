"use client"

import { useAuth } from "@/lib/auth-context"
import Header from "@/components/header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const pathname = usePathname()
  console.log(pathname)
  // Check if we're on a page that should show the sidebar
  const showSidebar = user && pathname && ![
    "/",
    "/features",
    "/how-it-works",
    "/technology",
    "/market",
    "/pricing",
    "/login",
    "/onboarding",
    "/signup"
  ].includes(pathname)

  if (isLoading) {
    return (
      <div className="min-h-screen legal-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-legal-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-legal-secondary legal-body">Loading...</p>
        </div>
      </div>
    )
  }

  if (showSidebar) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full legal-bg-primary">
        <AppSidebar />
          <div className="flex-1 flex flex-col">
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    )
  }

  return (
    <div className="min-h-screen legal-bg-primary">
      <Header />
      <main>{children}</main>
    </div>
  )
}
