"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/lib/auth-context"
import {
  Menu,
  X,
  Scale,
  User,
  LogOut,
  LayoutDashboard,
  Workflow,
  FileText,
  Shield,
  Bot,
  Settings,
  CreditCard,
  HelpCircle,
  ChevronDown,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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

  // Navigation items for authenticated users
  const authenticatedNavItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      description: "Overview & quick stats",
    },
    {
      name: "Workflows",
      href: "/workflows",
      icon: Workflow,
      description: "AI automation flows",
    },
    {
      name: "Documents",
      href: "/documents",
      icon: FileText,
      description: "Upload & AI analysis",
    },
    {
      name: "Compliance",
      href: "/compliance",
      icon: Shield,
      description: "Track deadlines & alerts",
    },
    {
      name: "AI Assistant",
      href: "/assistant",
      icon: Bot,
      description: "Chat-based legal help",
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      description: "Account & preferences",
    },
    {
      name: "Billing",
      href: "/billing",
      icon: CreditCard,
      description: "Plans & usage",
    },
    {
      name: "Help",
      href: "/help",
      icon: HelpCircle,
      description: "Support & guides",
    },
  ]

  // Navigation items for unauthenticated users
  const publicNavItems = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Technology", href: "/technology" },
    { name: "Market", href: "/market" },
  ]

  const isActivePage = (href: string) => {
    return pathname === href
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#0d1117]/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">LegalEase</span>
          </Link>

          {/* Desktop Navigation */}
          {user ? (
            // Authenticated User Navigation
            <nav className="hidden lg:flex items-center space-x-1">
              {authenticatedNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800",
                      isActivePage(item.href)
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
                    )}
                    title={item.description}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden xl:inline">{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          ) : (
            // Public Navigation
            <nav className="hidden md:flex items-center space-x-8">
              {publicNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActivePage(item.href)
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />

            {user ? (
              // User Menu
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 h-9">
                    <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">
                        {user.firstName} {user.lastName}
                      </span>
                      {user.isGuest && <span className="text-xs text-blue-600 dark:text-blue-400">Guest Mode</span>}
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email || "Guest User"}</p>
                    {user.isGuest && (
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                          Guest Session
                        </span>
                      </div>
                    )}
                  </div>

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  {!user.isGuest && (
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {user.isGuest && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleUpgradeAccount} className="cursor-pointer">
                        <span className="text-blue-600 dark:text-blue-400 font-medium">⭐ Upgrade to Full Account</span>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 dark:text-red-400">
                    <LogOut className="w-4 h-4 mr-2" />
                    {user.isGuest ? "End Guest Session" : "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Login/Signup Buttons
              <div className="flex items-center space-x-3">
                <Button variant="ghost" asChild className="h-9">
                  <Link href="/login">Login</Link>
                </Button>
                <Button className="btn-primary h-9">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button className="text-gray-600 dark:text-gray-300 p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-800">
            <nav className="flex flex-col space-y-2 mt-4">
              {user ? (
                // Mobile Authenticated Navigation
                <>
                  {authenticatedNavItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          isActivePage(item.href)
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800",
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icon className="w-4 h-4" />
                        <div>
                          <div>{item.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                        </div>
                      </Link>
                    )
                  })}
                </>
              ) : (
                // Mobile Public Navigation
                <>
                  {publicNavItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "px-3 py-2 text-sm font-medium transition-colors rounded-lg",
                        isActivePage(item.href)
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800",
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </>
              )}

              {/* Mobile User Actions */}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                {user ? (
                  <>
                    <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{user.email || "Guest User"}</div>
                        {user.isGuest && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 mt-1">
                            Guest Mode
                          </span>
                        )}
                      </div>
                    </div>

                    {user.isGuest && (
                      <Button onClick={handleUpgradeAccount} className="btn-primary justify-start">
                        ⭐ Upgrade to Full Account
                      </Button>
                    )}

                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className="justify-start text-red-600 dark:text-red-400"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {user.isGuest ? "End Guest Session" : "Logout"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" asChild className="justify-start">
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button className="btn-primary justify-start">
                      <Link href="/signup">Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
