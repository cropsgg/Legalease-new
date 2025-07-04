"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Scale, Eye, EyeOff, Mail, Lock, UserCheck, AlertCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useForm, useToast } from "@/hooks/use-api"

interface LoginFormData {
  email: string
  password: string // Dummy field
  rememberMe: boolean
}

const loginValidation = (values: LoginFormData) => {
  const errors: Record<string, string> = {}
  
  if (!values.email) {
    errors.email = "Email is required"
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Email is invalid"
  }
  
  // Password is dummy field, no validation needed
  
  return errors
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { login, loginAsGuest, isLoading, error, clearError } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()

  const form = useForm<LoginFormData>(
    {
      email: "",
      password: "dummy", // Dummy password
      rememberMe: false,
    },
    loginValidation
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.validate()) {
      showToast("Please enter a valid email address", "error")
      return
    }

    try {
      clearError()
      // Only pass email to login function
      await login(form.values.email)
      showToast("Login successful!", "success")
      router.push("/dashboard")
    } catch (error: any) {
      // Error handling is done in the auth store
      // If user not found, it will show signup message
      if (error.response?.status === 401) {
        showToast("Email not found. Please sign up first.", "error")
      } else {
        showToast("Login failed. Please try again.", "error")
      }
    }
  }

  const handleGuestLogin = () => {
    try {
      loginAsGuest()
      showToast("Welcome! You're now browsing as a guest.", "success")
      router.push("/dashboard")
    } catch (error: any) {
      showToast("Failed to start guest session", "error")
    }
  }

  return (
    <div className="min-h-screen legal-bg-primary">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="flex items-center justify-center p-6 pt-20 pb-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 legal-icon-bg rounded-2xl flex items-center justify-center">
                <Scale className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl legal-heading">LegalEase</h1>
            </div>

            <h2 className="text-2xl legal-heading mb-3">Welcome back</h2>
            <p className="text-legal-secondary legal-body">Enter your email to access your account</p>
          </div>

          {/* Login Form */}
          <div className="legal-form-section">
            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <div>
                  <p className="text-destructive text-sm legal-body">{error}</p>
                  {error.includes('not found') && (
                    <p className="text-sm text-legal-secondary mt-1">
                      <Link href="/signup" className="text-legal-accent hover:underline">
                        Create an account here
                      </Link>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Guest Login Option */}
            <div className="mb-6">
              <Button
                onClick={handleGuestLogin}
                disabled={isLoading}
                className="w-full bg-success hover:bg-success/90 text-white font-semibold py-4 text-base shadow-legal hover:shadow-legal-lg transition-all duration-300 rounded-2xl"
              >
                <UserCheck className="w-5 h-5 mr-2" />
                Continue as Guest
              </Button>
              <p className="text-xs text-legal-secondary text-center mt-2 legal-body">
                Explore all features without creating an account
              </p>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-legal-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 legal-bg-primary text-legal-secondary legal-body">
                  Or sign in with your email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-legal-dark-text font-medium legal-body">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-legal-secondary" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.values.email}
                    onChange={form.handleInputChange}
                    onBlur={() => form.setFieldTouched('email')}
                    className={`legal-input pl-12 py-3 ${
                      form.errors.email && form.touched.email ? 'border-destructive' : ''
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {form.errors.email && form.touched.email && (
                  <p className="text-destructive text-sm legal-body">{form.errors.email}</p>
                )}
              </div>

              {/* Password Field - Dummy field for UX */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-legal-dark-text font-medium legal-body">
                  Password <span className="text-legal-secondary text-xs">(not required)</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-legal-secondary" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.values.password}
                    onChange={form.handleInputChange}
                    className="legal-input pl-12 pr-12 py-3 opacity-60"
                    placeholder="Not required for login"
                    disabled
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-legal-secondary hover:text-legal-dark-text transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-legal-secondary">
                  We use email-only authentication for your security
                </p>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    name="rememberMe"
                    checked={form.values.rememberMe}
                    onCheckedChange={(checked) => form.setValue('rememberMe', checked as boolean)}
                    className="border-legal-border data-[state=checked]:bg-legal-brown data-[state=checked]:border-legal-brown"
                  />
                  <Label htmlFor="rememberMe" className="text-sm text-legal-secondary cursor-pointer legal-body">
                    Remember me
                  </Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-legal-accent hover:text-legal-brown transition-colors legal-body"
                >
                  Need help?
                </Link>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isLoading || !form.values.email} 
                className="btn-legal-primary w-full py-4 text-base font-semibold"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-legal-secondary legal-body">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-legal-accent hover:text-legal-brown font-semibold transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
