"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  User,
  Building2,
  GraduationCap,
} from "lucide-react"
import Link from "next/link"

type UserType = "patient" | "researcher" | "hospital" | ""

interface LoginForm {
  userType: UserType
  email: string
  password: string
  // Patient specific
  patientId?: string
  // Researcher specific
  researcherId?: string
  institution?: string
  researchArea?: string
  credentials?: File | null
  // Hospital specific
  hospitalId?: string
  hospitalName?: string
  department?: string
  licenseNumber?: string
  hospitalProof?: File | null
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loginForm, setLoginForm] = useState<LoginForm>({
    userType: "",
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState(1) // 1: Select user type, 2: Login form, 3: Additional info

  const handleInputChange = (field: keyof LoginForm, value: string | File | null) => {
    setLoginForm((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  const handleUserTypeSelect = (userType: UserType) => {
    setLoginForm((prev) => ({ ...prev, userType }))
    setStep(2)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call
    setTimeout(() => {
      // Demo credentials for different user types
      const demoCredentials = {
        patient: { email: "patient@manoveda.com", password: "patient123" },
        researcher: { email: "researcher@university.edu", password: "research123" },
        hospital: { email: "admin@hospital.com", password: "hospital123" },
      }

      const demo = demoCredentials[loginForm.userType as keyof typeof demoCredentials]

      if (loginForm.email === demo?.email && loginForm.password === demo?.password) {
        // Store user type and redirect accordingly
        localStorage.setItem("userType", loginForm.userType)
        localStorage.setItem("userInfo", JSON.stringify(loginForm))

        switch (loginForm.userType) {
          case "patient":
            window.location.href = "/patient-info"
            break
          case "researcher":
            window.location.href = "/researcher-dashboard"
            break
          case "hospital":
            window.location.href = "/hospital-dashboard"
            break
        }
      } else {
        setError("Invalid credentials for selected user type")
      }
      setIsLoading(false)
    }, 1500)
  }

  const handleFileUpload = (field: keyof LoginForm, file: File | null) => {
    setLoginForm((prev) => ({ ...prev, [field]: file }))
  }

  const renderUserTypeSelection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-black text-white mb-4">Choose Your Role</h2>
        <p className="text-gray-300 text-lg">Select how you'll be using Mano Veda</p>
      </div>

      <div className="grid gap-6">
        {/* Patient Option */}
        <Card
          className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 backdrop-blur-xl hover:border-blue-500/40 transition-all duration-300 cursor-pointer group"
          onClick={() => handleUserTypeSelect("patient")}
        >
          <CardContent className="p-8">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                <User className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">Patient</h3>
                <p className="text-blue-200 mb-4">Take cognitive assessments and track your brain health</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30">Cognitive Testing</Badge>
                  <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30">Health Tracking</Badge>
                  <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30">AI Analysis</Badge>
                </div>
              </div>
              <ArrowRight className="h-6 w-6 text-blue-400 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </CardContent>
        </Card>

        {/* Researcher Option */}
        <Card
          className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-xl hover:border-purple-500/40 transition-all duration-300 cursor-pointer group"
          onClick={() => handleUserTypeSelect("researcher")}
        >
          <CardContent className="p-8">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">Researcher</h3>
                <p className="text-purple-200 mb-4">Access research data and conduct cognitive studies</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30">Data Analysis</Badge>
                  <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Study Management
                  </Badge>
                  <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30">Research Tools</Badge>
                </div>
              </div>
              <ArrowRight className="h-6 w-6 text-purple-400 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </CardContent>
        </Card>

        {/* Hospital Option */}
        <Card
          className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 backdrop-blur-xl hover:border-emerald-500/40 transition-all duration-300 cursor-pointer group"
          onClick={() => handleUserTypeSelect("hospital")}
        >
          <CardContent className="p-8">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">Hospital/Clinic</h3>
                <p className="text-emerald-200 mb-4">Manage patient assessments and clinical workflows</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Patient Management
                  </Badge>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Clinical Reports
                  </Badge>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    EMR Integration
                  </Badge>
                </div>
              </div>
              <ArrowRight className="h-6 w-6 text-emerald-400 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button
          onClick={() => setStep(1)}
          variant="outline"
          className="bg-transparent border-white/20 text-white hover:bg-white/10"
        >
          Back to Selection
        </Button>
      </div>
    </div>
  )

  const renderLoginForm = () => {
    const userTypeConfig = {
      patient: {
        title: "Patient Login",
        icon: User,
        color: "from-blue-500 to-cyan-500",
        description: "Access your cognitive health dashboard",
      },
      researcher: {
        title: "Researcher Login",
        icon: GraduationCap,
        color: "from-purple-500 to-pink-500",
        description: "Access research tools and data",
      },
      hospital: {
        title: "Hospital Login",
        icon: Building2,
        color: "from-emerald-500 to-green-500",
        description: "Access clinical management system",
      },
    }

    const config = userTypeConfig[loginForm.userType as keyof typeof userTypeConfig]

    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div
              className={`w-16 h-16 bg-gradient-to-br ${config.color} rounded-2xl flex items-center justify-center shadow-xl`}
            >
              <config.icon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-white">{config.title}</h2>
              <p className="text-gray-300 text-lg">{config.description}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-4 flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span className="text-red-300">{error}</span>
            </div>
          )}

          {/* Additional fields based on user type */}
          {loginForm.userType === "patient" && (
            <div className="space-y-2">
              <Label htmlFor="patientId" className="text-gray-300 font-medium">
                Patient ID (Optional)
              </Label>
              <Input
                id="patientId"
                value={loginForm.patientId || ""}
                onChange={(e) => handleInputChange("patientId", e.target.value)}
                className="bg-gray-800/50 border-white/10 text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 h-14 rounded-xl"
                placeholder="Enter your patient ID if you have one"
              />
            </div>
          )}

          {loginForm.userType === "researcher" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="researcherId" className="text-gray-300 font-medium">
                  Researcher ID
                </Label>
                <Input
                  id="researcherId"
                  value={loginForm.researcherId || ""}
                  onChange={(e) => handleInputChange("researcherId", e.target.value)}
                  className="bg-gray-800/50 border-white/10 text-white placeholder-gray-400 focus:border-purple-500/50 focus:ring-purple-500/20 h-14 rounded-xl"
                  placeholder="Enter your researcher ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution" className="text-gray-300 font-medium">
                  Institution/University
                </Label>
                <Input
                  id="institution"
                  value={loginForm.institution || ""}
                  onChange={(e) => handleInputChange("institution", e.target.value)}
                  className="bg-gray-800/50 border-white/10 text-white placeholder-gray-400 focus:border-purple-500/50 focus:ring-purple-500/20 h-14 rounded-xl"
                  placeholder="Your institution name"
                />
              </div>
            </>
          )}

          {loginForm.userType === "hospital" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="hospitalId" className="text-gray-300 font-medium">
                  Hospital ID
                </Label>
                <Input
                  id="hospitalId"
                  value={loginForm.hospitalId || ""}
                  onChange={(e) => handleInputChange("hospitalId", e.target.value)}
                  className="bg-gray-800/50 border-white/10 text-white placeholder-gray-400 focus:border-emerald-500/50 focus:ring-emerald-500/20 h-14 rounded-xl"
                  placeholder="Enter your hospital ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hospitalName" className="text-gray-300 font-medium">
                  Hospital/Clinic Name
                </Label>
                <Input
                  id="hospitalName"
                  value={loginForm.hospitalName || ""}
                  onChange={(e) => handleInputChange("hospitalName", e.target.value)}
                  className="bg-gray-800/50 border-white/10 text-white placeholder-gray-400 focus:border-emerald-500/50 focus:ring-emerald-500/20 h-14 rounded-xl"
                  placeholder="Your hospital/clinic name"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300 font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={loginForm.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="pl-12 bg-gray-800/50 border-white/10 text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 h-14 rounded-xl"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300 font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={loginForm.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="pl-12 pr-12 bg-gray-800/50 border-white/10 text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 h-14 rounded-xl"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className={`w-full group relative bg-gradient-to-r ${config.color} hover:opacity-90 text-white text-lg px-8 py-4 h-14 rounded-xl shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center justify-center z-10">
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </div>
          </Button>

          {/* Demo Credentials */}
          <div
            className={`bg-gradient-to-r ${config.color.replace("to-", "to-").replace("from-", "from-")}/10 border border-opacity-20 rounded-xl p-4`}
          >
            <h4 className="font-bold mb-2 flex items-center">
              <Sparkles className="mr-2 h-4 w-4" />
              Demo Credentials
            </h4>
            <div className="text-sm space-y-1">
              <p>
                <strong>Email:</strong>{" "}
                {loginForm.userType === "patient"
                  ? "patient@manoveda.com"
                  : loginForm.userType === "researcher"
                    ? "researcher@university.edu"
                    : "admin@hospital.com"}
              </p>
              <p>
                <strong>Password:</strong>{" "}
                {loginForm.userType === "patient"
                  ? "patient123"
                  : loginForm.userType === "researcher"
                    ? "research123"
                    : "hospital123"}
              </p>
            </div>
          </div>
        </form>

        <div className="text-center">
          <Button
            onClick={() => setStep(1)}
            variant="outline"
            className="bg-transparent border-white/20 text-white hover:bg-white/10"
          >
            Change User Type
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative flex items-center justify-center">
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

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-4xl px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center space-x-4 group mb-8">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-500 group-hover:scale-110">
                <Brain className="h-9 w-9 text-white animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full border-2 border-black animate-bounce">
                <div className="w-full h-full bg-gradient-to-r from-emerald-400 to-green-400 rounded-full animate-ping" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Mano Veda
              </span>
              <div className="text-sm text-gray-400 font-medium flex items-center">
                <Sparkles className="w-3 h-3 mr-1" />
                AI-Powered Cognitive Health
              </div>
            </div>
          </Link>

          {step === 1 && (
            <>
              <h1 className="text-4xl font-black text-white mb-4">Welcome Back</h1>
              <p className="text-gray-300 text-lg font-light">Choose your role to access the platform</p>
            </>
          )}
        </div>

        {/* Login Card */}
        <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-12">{step === 1 ? renderUserTypeSelection() : renderLoginForm()}</CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Sign up here
            </Link>
          </p>
        </div>
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
