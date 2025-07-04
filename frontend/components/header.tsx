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
      description: "Legal workflows",
    },
    {
      name: "Documents",
      href: "/documents",
      icon: FileText,
      description: "Legal documents",
    },
    {
      name: "Compliance",
      href: "/compliance",
      icon: Shield,
      description: "Legal compliance",
    },
    {
      name: "AI Assistant",
      href: "/assistant",
      icon: Bot,
      description: "Legal assistant",
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      description: "Account settings",
    },
    {
      name: "Billing",
      href: "/billing",
      icon: CreditCard,
      description: "Billing & plans",
    },
    {
      name: "Help",
      href: "/help",
      icon: HelpCircle,
      description: "Support center",
    },
  ]

  // Navigation items for unauthenticated users
  const publicNavItems = [
    { name: "Home", href: "/" },
    { name: "Practice Areas", href: "/features" },
    { name: "Our Attorneys", href: "/how-it-works" },
    { name: "About Us", href: "/technology" },
    { name: "Contact", href: "/market" },
  ]

  const isActivePage = (href: string) => {
    return pathname === href
  }

  return (
    <header className="sticky top-0 z-50 bg-[#F8F3EE]/95 backdrop-blur-sm border-b border-[#E8DDD1] transition-colors duration-300">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={user ? "/dashboard" : "/"} className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#8B7355] rounded-xl flex items-center justify-center shadow-lg">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-light text-[#2A2A2A] tracking-wide">LegalEase</span>
          </Link>

          {/* Desktop Navigation */}
          {user ? (
            // Authenticated User Navigation
            <nav className="hidden lg:flex items-center space-x-2">
              {authenticatedNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                      isActivePage(item.href)
                        ? "bg-[#8B7355] text-white shadow-md"
                        : "text-[#2A2A2A] hover:bg-[#E8DDD1] hover:text-[#2A2A2A]",
                    )}
                    title={item.description}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden xl:inline font-light">{item.name}</span>
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
                    "text-sm font-light transition-colors duration-200 tracking-wide",
                    isActivePage(item.href)
                      ? "text-[#8B7355] font-medium border-b-2 border-[#8B7355] pb-1"
                      : "text-[#2A2A2A] hover:text-[#8B7355]",
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />

            {user ? (
              // User Menu
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-3 h-auto p-3 hover:bg-[#E8DDD1] rounded-xl transition-colors duration-200">
                    <div className="w-8 h-8 bg-[#8B7355] rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-[#2A2A2A]">
                        {user.firstName} {user.lastName}
                      </span>
                      {user.isGuest && <span className="text-xs text-[#8B7355]">Guest Mode</span>}
                    </div>
                    <ChevronDown className="w-4 h-4 text-[#8B7355]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-white border border-[#E8DDD1] shadow-xl rounded-xl">
                  <div className="px-4 py-3 border-b border-[#E8DDD1]">
                    <p className="text-sm font-medium text-[#2A2A2A]">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-[#8B7355]">{user.email || "Guest User"}</p>
                    {user.isGuest && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-[#E8DDD1] text-[#8B7355]">
                          Guest Session
                        </span>
                      </div>
                    )}
                  </div>

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer text-[#2A2A2A] hover:bg-[#E8DDD1]">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  {!user.isGuest && (
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer text-[#2A2A2A] hover:bg-[#E8DDD1]">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {user.isGuest && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleUpgradeAccount} className="cursor-pointer text-[#8B7355] hover:bg-[#E8DDD1]">
                        <span className="font-medium">⭐ Upgrade Account</span>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 hover:bg-red-50">
                    <LogOut className="w-4 h-4 mr-2" />
                    {user.isGuest ? "End Session" : "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Login/Signup Buttons
              <div className="flex items-center space-x-3">
                <Button variant="ghost" asChild className="h-auto px-6 py-2 text-[#2A2A2A] hover:bg-[#E8DDD1] rounded-xl font-light transition-colors duration-200">
                  <Link href="/login">Login</Link>
                </Button>
                <Button className="h-auto px-6 py-2 bg-[#8B7355] hover:bg-[#7A6449] text-white rounded-xl font-light shadow-lg transition-all duration-200">
                  <Link href="/signup">Free Consultation</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <ThemeToggle />
            <button 
              className="text-[#2A2A2A] p-2 hover:bg-[#E8DDD1] rounded-xl transition-colors duration-200" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-6 pb-4 border-t border-[#E8DDD1]">
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
                          "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-light transition-colors",
                          isActivePage(item.href)
                            ? "bg-[#8B7355] text-white"
                            : "text-[#2A2A2A] hover:bg-[#E8DDD1]",
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icon className="w-4 h-4" />
                        <div>
                          <div>{item.name}</div>
                          <div className="text-xs opacity-70">{item.description}</div>
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
                        "px-4 py-3 text-sm font-light transition-colors rounded-xl",
                        isActivePage(item.href)
                          ? "bg-[#8B7355] text-white"
                          : "text-[#2A2A2A] hover:bg-[#E8DDD1]",
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </>
              )}

              {/* Mobile User Actions */}
              <div className="flex flex-col space-y-3 pt-4 border-t border-[#E8DDD1]">
                {user ? (
                  <>
                    <div className="flex items-center space-x-3 px-4 py-3 bg-[#E8DDD1] rounded-xl">
                      <div className="w-10 h-10 bg-[#8B7355] rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#2A2A2A]">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs text-[#8B7355]">{user.email || "Guest User"}</div>
                        {user.isGuest && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-white text-[#8B7355] mt-1">
                            Guest Mode
                          </span>
                        )}
                      </div>
                    </div>

                    {user.isGuest && (
                      <Button onClick={handleUpgradeAccount} className="bg-[#8B7355] hover:bg-[#7A6449] text-white rounded-xl font-light justify-start">
                        ⭐ Upgrade Account
                      </Button>
                    )}

                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className="justify-start text-red-600 hover:bg-red-50 rounded-xl font-light"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {user.isGuest ? "End Session" : "Logout"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" asChild className="justify-start hover:bg-[#E8DDD1] text-[#2A2A2A] rounded-xl font-light">
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button className="bg-[#8B7355] hover:bg-[#7A6449] text-white rounded-xl font-light justify-start">
                      <Link href="/signup">Free Consultation</Link>
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
