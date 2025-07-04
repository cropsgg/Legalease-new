"use client"

import type * as React from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
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
  Hash,
  Edit3,
  MessageCircle,
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
    title: "Onboarding",
    url: "/onboarding",
    icon: LayoutDashboard,
    description: "SME Overboarding",
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview & analytics",
  },
  {
    title: "Editor",
    url: "/editor",
    icon: Edit3,
    description: "AI-powered markdown editor",
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
    title: "Agents",
    url: "/agents",
    icon: Bot,
    description: "AI agent management",
  },
  {
    title: "Compliance",
    url: "/compliance",
    icon: Shield,
    description: "Track deadlines & alerts",
  },
  {
    title: "AI Automation",
    url: "/automation",
    icon: Bot,
    description: "Chat-based legal help",
  },
  {
    title: "Chat",
    url: "/chat",
    icon: MessageCircle,
    description: "Conversational AI interface",
  },
  {
    title: "Notary",
    url: "/notary",
    icon: Hash,
    description: "Blockchain document notarization",
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
    <Sidebar collapsible="icon" className="legal-sidebar" {...props}>
      <SidebarHeader className="border-b border-legal-border">
        <div className="flex items-center justify-between px-2 py-1">
          <SidebarTrigger className="h-8 w-8 p-0 hover:bg-legal-beige rounded-md transition-colors text-legal-secondary hover:text-legal-dark-text">
            <PanelLeft className="h-4 w-4" />
          </SidebarTrigger>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-legal-beige">
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg legal-icon-bg">
                  <Scale className="size-4 text-white" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-playfair font-semibold text-legal-dark-text">LegalEase</span>
                  <span className="truncate text-xs text-legal-secondary">AI Legal Platform</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="legal-bg-primary">
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
                        "transition-all duration-200 hover:bg-legal-beige text-legal-secondary hover:text-legal-dark-text",
                        isActive &&
                          "bg-legal-beige text-legal-dark-text border-r-2 border-legal-brown shadow-legal",
                      )}
                    >
                      <Link href={item.url}>
                        <Icon className="size-4" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-legal-border legal-bg-primary">
        <div className="flex items-center justify-center p-2">{/* Theme toggle removed - using legal theme only */}

          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-legal-beige data-[state=open]:text-legal-dark-text hover:bg-legal-beige"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src="/placeholder.svg"
                        alt={`${user.firstName} ${user.lastName}`}
                      />
                      <AvatarFallback className="rounded-lg legal-icon-bg text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-playfair font-semibold text-legal-dark-text">
                        {user.isGuest ? "Guest User" : `${user.firstName} ${user.lastName}`}
                      </span>
                      <span className="truncate text-xs text-legal-secondary">
                        {user.isGuest ? "Guest Mode" : user.email}
                      </span>
                    </div>
                    {user.isGuest && <Crown className="size-4 text-warning" />}
                    <ChevronUp className="ml-auto size-4 text-legal-secondary" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="legal-card w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <div className="p-2 border-b border-legal-border">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src="/placeholder.svg"
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                        <AvatarFallback className="legal-icon-bg text-white">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-legal-dark-text truncate">
                          {user.isGuest ? "Guest User" : `${user.firstName} ${user.lastName}`}
                        </p>
                        <p className="text-xs text-legal-secondary truncate">
                          {user.isGuest ? "Temporary Session" : user.email}
                        </p>
                        {user.isGuest && (
                          <div className="mt-1">
                            <span className="legal-badge">
                              <Crown className="w-3 h-3 mr-1" />
                              Guest Mode
                            </span>
                          </div>
                        )}
                        {user.companyName && (
                          <p className="text-xs text-legal-secondary truncate mt-1">{user.companyName}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer text-legal-dark-text hover:text-legal-dark-text">
                      <LayoutDashboard className="size-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  {!user.isGuest && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="cursor-pointer text-legal-dark-text hover:text-legal-dark-text">
                          <Settings className="size-4 mr-2" />
                          Account Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/billing" className="cursor-pointer text-legal-dark-text hover:text-legal-dark-text">
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
                        <Crown className="size-4 mr-2 text-warning" />
                        <span className="text-legal-accent font-medium">Upgrade to Full Account</span>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
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
