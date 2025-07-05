"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Scale, Mail, User, AlertCircle, UserPlus, Eye, EyeOff, Lock } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useForm, useToast } from "@/hooks/use-api"

interface SignupFormData {
  email: string
  fullName: string
  password: string // Dummy field
  companyName: string
  agreeToTerms: boolean
  subscribeNewsletter: boolean
}

const signupValidation = (values: SignupFormData) => {
  const errors: Record<string, string> = {}
  
  if (!values.email) {
    errors.email = "Email is required"
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Email is invalid"
  }
  
  if (!values.fullName) {
    errors.fullName = "Full name is required"
  } else if (values.fullName.length < 2) {
    errors.fullName = "Full name must be at least 2 characters"
  }
  
  if (!values.agreeToTerms) {
    errors.agreeToTerms = "You must agree to the terms and conditions"
  }
  
  return errors
}

export default function SignupPage() {
  const [isUpgrade, setIsUpgrade] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const { register, upgradeGuestToUser, loginAsGuest, user, isLoading, error, clearError } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  const form = useForm<SignupFormData>(
    {
      email: "",
      fullName: "",
      password: "dummy", // Dummy password
      companyName: "",
      agreeToTerms: false,
      subscribeNewsletter: false,
    },
    signupValidation
  )

  useEffect(() => {
    const upgrade = searchParams.get("upgrade")
    if (upgrade === "true") {
      setIsUpgrade(true)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.validate()) {
      showToast("Please fix the errors in the form", "error")
      return
    }

    try {
      clearError()
      
      const userData = {
        email: form.values.email,
        full_name: form.values.fullName,
        companyName: form.values.companyName,
      }

      if (isUpgrade && user?.isGuest) {
        await upgradeGuestToUser(userData)
        showToast("Account upgraded successfully!", "success")
      } else {
        await register(userData)
        showToast("Account created successfully!", "success")
      }
      
      router.push("/dashboard")
    } catch (error: any) {
      if (error.response?.status === 400 && error.response?.data?.detail?.includes("already registered")) {
        showToast("Email already registered. Please try logging in.", "error")
      } else {
        showToast("Registration failed. Please try again.", "error")
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

            <h2 className="text-2xl legal-heading mb-3">
              {isUpgrade ? "Upgrade Your Account" : "Join LegalEase"}
            </h2>
            <p className="text-legal-secondary legal-body">
              {isUpgrade 
                ? "Complete your profile to access all features"
                : "Enter your details to create your account"
              }
            </p>
          </div>

          {/* Signup Form */}
          <div className="legal-form-section">
            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <div>
                  <p className="text-destructive text-sm legal-body">{error}</p>
                  {error.includes('already registered') && (
                    <p className="text-sm text-legal-secondary mt-1">
                      <Link href="/login" className="text-legal-accent hover:underline">
                        Login instead
                      </Link>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Guest Login Option (only if not upgrading) */}
            {!isUpgrade && (
              <>
                <div className="mb-6">
                  <Button
                    onClick={handleGuestLogin}
                    disabled={isLoading}
                    className="w-full bg-success hover:bg-success/90 text-white font-semibold py-4 text-base shadow-legal hover:shadow-legal-lg transition-all duration-300 rounded-2xl"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Continue as Guest
                  </Button>
                  <p className="text-xs text-legal-secondary text-center mt-2 legal-body">
                    Try LegalEase without creating an account
                  </p>
                </div>

                {/* Divider */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-legal-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 legal-bg-primary text-legal-secondary legal-body">
                      Or create an account
                    </span>
                  </div>
                </div>
              </>
            )}

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

              {/* Full Name Field */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-legal-dark-text font-medium legal-body">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-legal-secondary" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={form.values.fullName}
                    onChange={form.handleInputChange}
                    onBlur={() => form.setFieldTouched('fullName')}
                    className={`legal-input pl-12 py-3 ${
                      form.errors.fullName && form.touched.fullName ? 'border-destructive' : ''
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {form.errors.fullName && form.touched.fullName && (
                  <p className="text-destructive text-sm legal-body">{form.errors.fullName}</p>
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
                    placeholder="Not required for signup"
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

              {/* Company Name Field (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-legal-dark-text font-medium legal-body">
                  Company Name <span className="text-legal-secondary text-xs">(optional)</span>
                </Label>
                <div className="relative">
                  <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-legal-secondary" />
                  <Input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={form.values.companyName}
                    onChange={form.handleInputChange}
                    className="legal-input pl-12 py-3"
                    placeholder="Enter your company name"
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={form.values.agreeToTerms}
                    onCheckedChange={(checked) => form.setValue('agreeToTerms', checked as boolean)}
                    className="mt-1 border-legal-border data-[state=checked]:bg-legal-brown data-[state=checked]:border-legal-brown"
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm text-legal-dark-text cursor-pointer legal-body">
                    I agree to the{" "}
                    <Link href="/terms" className="text-legal-accent hover:underline">
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-legal-accent hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {form.errors.agreeToTerms && form.touched.agreeToTerms && (
                  <p className="text-destructive text-sm legal-body">{form.errors.agreeToTerms}</p>
                )}

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="subscribeNewsletter"
                    name="subscribeNewsletter"
                    checked={form.values.subscribeNewsletter}
                    onCheckedChange={(checked) => form.setValue('subscribeNewsletter', checked as boolean)}
                    className="mt-1 border-legal-border data-[state=checked]:bg-legal-brown data-[state=checked]:border-legal-brown"
                  />
                  <Label htmlFor="subscribeNewsletter" className="text-sm text-legal-secondary cursor-pointer legal-body">
                    Send me updates about new features and legal insights
                  </Label>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isLoading || !form.values.email || !form.values.fullName || !form.values.agreeToTerms} 
                className="btn-legal-primary w-full py-4 text-base font-semibold"
              >
                {isLoading 
                  ? (isUpgrade ? "Upgrading..." : "Creating Account...")
                  : (isUpgrade ? "Upgrade Account" : "Create Account")
                }
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-legal-secondary legal-body">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-legal-accent hover:text-legal-brown font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
