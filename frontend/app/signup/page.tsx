"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Scale, Eye, EyeOff, Mail, Lock, User, Building, UserCheck, AlertCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useForm, useToast } from "@/hooks/use-api"
import { RegisterData } from "@/lib/auth-store"

interface SignupFormData extends RegisterData {
  confirmPassword: string
  agreeToTerms: boolean
  subscribeNewsletter: boolean
}

const signupValidation = (values: SignupFormData) => {
  const errors: Record<string, string> = {}
  
  if (!values.firstName) {
    errors.firstName = "First name is required"
  }
  
  if (!values.lastName) {
    errors.lastName = "Last name is required"
  }
  
  if (!values.email) {
    errors.email = "Email is required"
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Email is invalid"
  }
  
  if (!values.companyName) {
    errors.companyName = "Company name is required"
  }
  
  if (!values.companySize) {
    errors.companySize = "Company size is required"
  }
  
  if (!values.password) {
    errors.password = "Password is required"
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters"
  }
  
  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirm password is required"
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords don't match"
  }
  
  if (!values.agreeToTerms) {
    errors.agreeToTerms = "You must agree to the terms and conditions"
  }
  
  return errors
}

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isUpgrade, setIsUpgrade] = useState(false)
  
  const { register, upgradeGuestToUser, loginAsGuest, user, isLoading, error, clearError } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  const form = useForm<SignupFormData>(
    {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      companySize: "",
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
      
      const userData: RegisterData = {
        email: form.values.email,
        password: form.values.password,
        firstName: form.values.firstName,
        lastName: form.values.lastName,
        companyName: form.values.companyName,
        companySize: form.values.companySize,
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
      showToast("Registration failed. Please try again.", "error")
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
        <div className="w-full max-w-2xl">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 legal-icon-bg rounded-2xl flex items-center justify-center">
                <Scale className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl legal-heading">LegalEase</h1>
            </div>

            <h2 className="text-2xl legal-heading mb-3">
              {isUpgrade ? "Upgrade your account" : "Create your account"}
            </h2>
            <p className="text-legal-secondary legal-body">
              {isUpgrade
                ? "Convert your guest session to a full account to save your progress"
                : "Join thousands of startups automating their legal work"}
            </p>
          </div>

          {/* Signup Form */}
          <div className="legal-form-section">
            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <p className="text-destructive text-sm legal-body">{error}</p>
              </div>
            )}

            {!isUpgrade && (
              <>
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
                      Or create a full account
                    </span>
                  </div>
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-legal-dark-text font-medium legal-body">
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-legal-secondary" />
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={form.values.firstName}
                      onChange={form.handleInputChange}
                      onBlur={() => form.setFieldTouched('firstName')}
                      className={`legal-input pl-12 py-3 ${
                        form.errors.firstName && form.touched.firstName ? 'border-destructive' : ''
                      }`}
                      placeholder="John"
                    />
                  </div>
                  {form.errors.firstName && form.touched.firstName && (
                    <p className="text-destructive text-sm legal-body">{form.errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-legal-dark-text font-medium legal-body">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={form.values.lastName}
                    onChange={form.handleInputChange}
                    onBlur={() => form.setFieldTouched('lastName')}
                    className={`legal-input py-3 ${
                      form.errors.lastName && form.touched.lastName ? 'border-destructive' : ''
                    }`}
                    placeholder="Doe"
                  />
                  {form.errors.lastName && form.touched.lastName && (
                    <p className="text-destructive text-sm legal-body">{form.errors.lastName}</p>
                  )}
                </div>
              </div>

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
                    placeholder="john@example.com"
                  />
                </div>
                {form.errors.email && form.touched.email && (
                  <p className="text-destructive text-sm legal-body">{form.errors.email}</p>
                )}
              </div>

              {/* Company Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-legal-dark-text font-medium legal-body">
                    Company Name
                  </Label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-legal-secondary" />
                    <Input
                      id="companyName"
                      name="companyName"
                      type="text"
                      required
                      value={form.values.companyName}
                      onChange={form.handleInputChange}
                      onBlur={() => form.setFieldTouched('companyName')}
                      className={`legal-input pl-12 py-3 ${
                        form.errors.companyName && form.touched.companyName ? 'border-destructive' : ''
                      }`}
                      placeholder="Your Company"
                    />
                  </div>
                  {form.errors.companyName && form.touched.companyName && (
                    <p className="text-destructive text-sm legal-body">{form.errors.companyName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companySize" className="text-legal-dark-text font-medium legal-body">
                    Company Size
                  </Label>
                  <Select onValueChange={(value) => form.handleSelectChange("companySize", value)}>
                    <SelectTrigger className={`legal-input py-3 ${
                      form.errors.companySize && form.touched.companySize ? 'border-destructive' : ''
                    }`}>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent className="legal-card">
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="200+">200+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.errors.companySize && form.touched.companySize && (
                    <p className="text-destructive text-sm legal-body">{form.errors.companySize}</p>
                  )}
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-legal-dark-text font-medium legal-body">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-legal-secondary" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={form.values.password}
                      onChange={form.handleInputChange}
                      onBlur={() => form.setFieldTouched('password')}
                      className={`legal-input pl-12 pr-12 py-3 ${
                        form.errors.password && form.touched.password ? 'border-destructive' : ''
                      }`}
                      placeholder="Create password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-legal-secondary hover:text-legal-dark-text transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {form.errors.password && form.touched.password && (
                    <p className="text-destructive text-sm legal-body">{form.errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-legal-dark-text font-medium legal-body">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-legal-secondary" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={form.values.confirmPassword}
                      onChange={form.handleInputChange}
                      onBlur={() => form.setFieldTouched('confirmPassword')}
                      className={`legal-input pl-12 pr-12 py-3 ${
                        form.errors.confirmPassword && form.touched.confirmPassword ? 'border-destructive' : ''
                      }`}
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-legal-secondary hover:text-legal-dark-text transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {form.errors.confirmPassword && form.touched.confirmPassword && (
                    <p className="text-destructive text-sm legal-body">{form.errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={form.values.agreeToTerms}
                    onCheckedChange={(checked) => form.setValue('agreeToTerms', checked as boolean)}
                    className="border-legal-border data-[state=checked]:bg-legal-brown data-[state=checked]:border-legal-brown mt-1"
                    required
                  />
                  <Label
                    htmlFor="agreeToTerms"
                    className="text-sm text-legal-secondary cursor-pointer leading-relaxed legal-body"
                  >
                    I agree to the{" "}
                    <Link href="/terms" className="text-legal-accent hover:text-legal-brown hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-legal-accent hover:text-legal-brown hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                  {form.errors.agreeToTerms && (
                    <p className="text-destructive text-sm legal-body">{form.errors.agreeToTerms}</p>
                  )}
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="subscribeNewsletter"
                    name="subscribeNewsletter"
                    checked={form.values.subscribeNewsletter}
                    onCheckedChange={(checked) => form.setValue('subscribeNewsletter', checked as boolean)}
                    className="border-legal-border data-[state=checked]:bg-legal-brown data-[state=checked]:border-legal-brown mt-1"
                  />
                  <Label
                    htmlFor="subscribeNewsletter"
                    className="text-sm text-legal-secondary cursor-pointer leading-relaxed legal-body"
                  >
                    Subscribe to our newsletter for legal compliance tips and product updates
                  </Label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !form.values.agreeToTerms}
                className="btn-legal-primary w-full py-4 text-base font-semibold"
              >
                {isLoading
                  ? isUpgrade
                    ? "Upgrading Account..."
                    : "Creating Account..."
                  : isUpgrade
                    ? "Upgrade Account"
                    : "Create Account"}
              </Button>

              {!isUpgrade && (
                <>
                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-legal-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 legal-bg-primary text-legal-secondary legal-body">
                        Or sign up with
                      </span>
                    </div>
                  </div>

                  {/* Social Signup */}
                  <div className="grid grid-cols-2 gap-4">
                    <Button type="button" className="btn-legal-secondary py-3" disabled={isLoading}>
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span className="legal-body">Google</span>
                    </Button>
                    <Button type="button" className="btn-legal-secondary py-3" disabled={isLoading}>
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.017z" />
                      </svg>
                      <span className="legal-body">GitHub</span>
                    </Button>
                  </div>
                </>
              )}
            </form>

            {/* Login Link */}
            {!isUpgrade && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
