"use client"
// header.tsx
import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
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
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#0d1117]/95 backdrop-blur-sm border-b border-amber-200 dark:border-amber-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href={user ? "/dashboard" : "/"}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 legal-icon-bg rounded-lg flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold legal-heading">LegalEase</span>
          </Link>

          {/* Desktop Navigation */}
          {user ? (
            // Authenticated User Navigation
            <nav className="hidden lg:flex items-center space-x-1">
              {authenticatedNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-legal-beige",
                      isActivePage(item.href)
                        ? "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800"
                        : "text-amber-900 dark:text-amber-100 hover:text-amber-800 dark:hover:text-amber-200",
                    )}
                    title={item.description}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden xl:inline">{item.name}</span>
                  </Link>
                );
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
                      ? "text-amber-800 dark:text-amber-200"
                      : "text-amber-900 dark:text-amber-100 hover:text-amber-800 dark:hover:text-amber-200",
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              // User Menu
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 h-9"
                  >
                    <div className="w-7 h-7 legal-icon-bg rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-legal-primary">
                        {user.firstName} {user.lastName}
                      </span>
                      {user.isGuest && <span className="text-xs text-amber-700 dark:text-amber-300">Guest Mode</span>}
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="px-3 py-2 border-b border-legal-border">
                    <p className="text-sm font-medium text-legal-primary">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs legal-text-muted">{user.email || "Guest User"}</p>
                    {user.isGuest && (
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200">
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
                        <span className="text-amber-700 dark:text-amber-300 font-medium">⭐ Upgrade Account</span>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 dark:text-red-400">
                    <LogOut className="w-4 h-4 mr-2" />
                    {user.isGuest ? "End Session" : "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Login/Signup Buttons
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  asChild
                  className="h-9 btn-legal-secondary"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button className="btn-legal-primary h-9">
                  <Link href="/signup">Free Consultation</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button className="text-amber-900 dark:text-amber-100 p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-legal-border">
            <nav className="flex flex-col space-y-2 mt-4">
              {user ? (
                // Mobile Authenticated Navigation
                <>
                  {authenticatedNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          isActivePage(item.href)
                            ? "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200"
                            : "text-amber-900 dark:text-amber-100 hover:text-amber-800 dark:hover:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/20",
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icon className="w-4 h-4" />
                        <div>
                          <div>{item.name}</div>
                          <div className="text-xs legal-text-muted">{item.description}</div>
                        </div>
                      </Link>
                    );
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
                          ? "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200"
                          : "text-amber-900 dark:text-amber-100 hover:text-amber-800 dark:hover:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/20",
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </>
              )}

              {/* Mobile User Actions */}
              <div className="flex flex-col space-y-2 pt-4 border-t border-legal-border">
                {user ? (
                  <>
                    <div className="flex items-center space-x-3 px-3 py-2 bg-legal-beige rounded-lg">
                      <div className="w-8 h-8 legal-icon-bg rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-legal-primary">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs legal-text-muted">{user.email || "Guest User"}</div>
                        {user.isGuest && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 mt-1">
                            Guest Mode
                          </span>
                        )}
                      </div>
                    </div>

                    {user.isGuest && (
                      <Button
                        onClick={handleUpgradeAccount}
                        className="btn-legal-primary justify-start"
                      >
                        ⭐ Upgrade Account
                      </Button>
                    )}

                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className="justify-start text-destructive"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {user.isGuest ? "End Session" : "Logout"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      asChild
                      className="justify-start btn-legal-secondary"
                    >
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button className="btn-legal-primary justify-start">
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
  );
}
