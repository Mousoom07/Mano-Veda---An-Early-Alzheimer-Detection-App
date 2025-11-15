"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Brain,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  User,
  Phone,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the terms and conditions")
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      setSuccess(true)
      setIsLoading(false)
      // Redirect after success
      setTimeout(() => {
        window.location.href = "/auth/login"
      }, 2000)
    }, 1500)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black text-white overflow-hidden relative flex items-center justify-center">
        {/* Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900"></div>
        </div>

        <div className="relative z-10 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/25 animate-pulse">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4">Account Created!</h1>
          <p className="text-gray-300 text-lg mb-8">Welcome to Mano Veda. Redirecting you to login...</p>
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative flex items-center justify-center py-8">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900"></div>

        {/* Floating Particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-4 group mb-6">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-500 group-hover:scale-110">
                <Brain className="h-8 w-8 text-white animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full border-2 border-black animate-bounce">
                <div className="w-full h-full bg-gradient-to-r from-emerald-400 to-green-400 rounded-full animate-ping" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Mano Veda
              </span>
              <div className="text-xs text-gray-400 font-medium flex items-center">
                <Sparkles className="w-3 h-3 mr-1" />
                AI-Powered Cognitive Health
              </div>
            </div>
          </Link>

          <h1 className="text-3xl font-black text-white mb-3">Create Account</h1>
          <p className="text-gray-300 text-base font-light">Join thousands taking control of their brain health</p>
        </div>

        {/* Signup Card */}
        <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 backdrop-blur-xl shadow-2xl">
          <CardContent className="space-y-6 p-6">
            <form onSubmit={handleSignup} className="space-y-5">
              {error && (
                <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-4 flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <span className="text-red-300 text-sm">{error}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-300 font-medium text-sm">
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="pl-10 bg-gray-800/50 border-white/10 text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 h-12 rounded-xl text-sm"
                      placeholder="John"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-300 font-medium text-sm">
                    Last Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="pl-10 bg-gray-800/50 border-white/10 text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 h-12 rounded-xl text-sm"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300 font-medium text-sm">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 bg-gray-800/50 border-white/10 text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 h-12 rounded-xl text-sm"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-300 font-medium text-sm">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-10 bg-gray-800/50 border-white/10 text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 h-12 rounded-xl text-sm"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300 font-medium text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 bg-gray-800/50 border-white/10 text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 h-12 rounded-xl text-sm"
                    placeholder="Create a strong password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300 font-medium text-sm">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 bg-gray-800/50 border-white/10 text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 h-12 rounded-xl text-sm"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-1 rounded border-white/20 bg-gray-800/50 text-blue-500 focus:ring-blue-500/20"
                  required
                />
                <label htmlFor="agreeToTerms" className="text-gray-300 text-sm leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full group relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white text-base px-8 py-3 h-12 rounded-xl shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-500 transform hover:scale-105 border-0 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center justify-center z-10">
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </div>
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-gray-400 text-sm">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
