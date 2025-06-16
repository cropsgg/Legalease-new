"use client"

import type * as React from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  LayoutDashboard,
  Workflow,
  FileText,
  Shield,
  Bot,
  Settings,
  CreditCard,
  HelpCircle,
  LogOut,
  Scale,
  Crown,
  ChevronUp,
  PanelLeft,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

// Navigation items for the sidebar
const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview & analytics",
  },
  {
    title: "Workflows",
    url: "/workflows",
    icon: Workflow,
    description: "AI automation flows",
  },
  {
    title: "Documents",
    url: "/documents",
    icon: FileText,
    description: "Upload & AI analysis",
  },
  {
    title: "Compliance",
    url: "/compliance",
    icon: Shield,
    description: "Track deadlines & alerts",
  },
  {
    title: "AI Assistant",
    url: "/assistant",
    icon: Bot,
    description: "Chat-based legal help",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    description: "Account & preferences",
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
    description: "Plans & usage",
  },
  {
    title: "Help",
    url: "/help",
    icon: HelpCircle,
    description: "Support & guides",
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleUpgradeAccount = () => {
    router.push("/signup?upgrade=true")
  }

  const getUserInitials = () => {
    if (!user) return "U"
    if (user.isGuest) return "G"
    return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "U"
  }

  const isActivePage = (url: string) => {
    return pathname === url
  }

  if (!user) return null

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-1">
          <SidebarTrigger className="h-8 w-8 p-0 hover:bg-sidebar-accent rounded-md transition-colors">
            <PanelLeft className="h-4 w-4" />
          </SidebarTrigger>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground">
                  <Scale className="size-4 text-white" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">LegalEase</span>
                  <span className="truncate text-xs text-muted-foreground">AI Legal Platform</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = isActivePage(item.url)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.description}
                      className={cn(
                        "transition-all duration-200",
                        isActive &&
                          "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-500",
                      )}
                    >
                      <Link href={item.url}>
                        <Icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between p-2 border-t border-sidebar-border group-data-[collapsible=icon]:justify-center">
          <div className="group-data-[collapsible=icon]:hidden">
            <ThemeToggle />
          </div>
          <div className="hidden group-data-[collapsible=icon]:block">
            <ThemeToggle />
          </div>

          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={user.profileImage || "/placeholder.svg"}
                        alt={`${user.firstName} ${user.lastName}`}
                      />
                      <AvatarFallback className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user.isGuest ? "Guest User" : `${user.firstName} ${user.lastName}`}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user.isGuest ? "Guest Mode" : user.email}
                      </span>
                    </div>
                    {user.isGuest && <Crown className="size-4 text-yellow-500" />}
                    <ChevronUp className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={user.profileImage || "/placeholder.svg"}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user.isGuest ? "Guest User" : `${user.firstName} ${user.lastName}`}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.isGuest ? "Temporary Session" : user.email}
                        </p>
                        {user.isGuest && (
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400">
                              <Crown className="w-3 h-3 mr-1" />
                              Guest Mode
                            </span>
                          </div>
                        )}
                        {user.companyName && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">{user.companyName}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="size-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  {!user.isGuest && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="cursor-pointer">
                          <Settings className="size-4 mr-2" />
                          Account Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/billing" className="cursor-pointer">
                          <CreditCard className="size-4 mr-2" />
                          Billing & Plans
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {user.isGuest && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleUpgradeAccount} className="cursor-pointer">
                        <Crown className="size-4 mr-2 text-yellow-500" />
                        <span className="text-blue-600 dark:text-blue-400 font-medium">Upgrade to Full Account</span>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 dark:text-red-400">
                    <LogOut className="size-4 mr-2" />
                    {user.isGuest ? "End Guest Session" : "Sign Out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
