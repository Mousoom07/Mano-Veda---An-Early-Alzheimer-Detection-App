"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Sparkles,
  ArrowRight,
  Shield,
  Globe,
  Users,
  Heart,
  Target,
  Star,
  CheckCircle,
  BarChart3,
  Activity,
  Phone,
  Mail,
  MapPin,
  User,
  MessageSquare,
  Quote,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { MannuAssistant } from "@/components/ai-assistant-mannu"

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [showMannu, setShowMannu] = useState(false)
  const [mounted, setMounted] = useState(false)
  type Particle = { left: number; top: number; width: number; height: number; animationDelay: number; animationDuration: number }
  const [particles, setParticles] = useState<Particle[]>([])

  // Ensure client-only rendering of random particles to avoid hydration mismatch
  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    if (!mounted) return
    const arr: Particle[] = Array.from({ length: 50 }).map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      width: Math.random() * 4 + 2,
      height: Math.random() * 4 + 2,
      animationDelay: i * 0.1,
      animationDuration: 3 + Math.random() * 4,
    }))
    setParticles(arr)
  }, [mounted])

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Neurologist, Mayo Clinic",
      content:
        "Mano Veda AI has revolutionized how we conduct preliminary cognitive assessments. The accuracy and depth of analysis is remarkable.",
      rating: 5,
      image: "/placeholder-user.jpg",
    },
    {
      name: "Michael Chen",
      role: "Patient, Age 67",
      content:
        "The assessment was comprehensive yet easy to understand. Mannu, the AI assistant, made me feel comfortable throughout the entire process.",
      rating: 5,
      image: "/placeholder-user.jpg",
    },
    {
      name: "Dr. Maria Rodriguez",
      role: "Geriatrician, Johns Hopkins",
      content:
        "The multilingual support and detailed reporting make this an invaluable tool for diverse patient populations.",
      rating: 5,
      image: "/placeholder-user.jpg",
    },
    {
      name: "James Wilson",
      role: "Caregiver",
      content:
        "Being able to monitor my father's cognitive health regularly has given our family peace of mind and early intervention opportunities.",
      rating: 5,
      image: "/placeholder-user.jpg",
    },
  ]

  const globalStats = [
    { label: "Alzheimer's Patients by 2030", value: "32M", icon: Users, color: "from-red-500 to-pink-500" },
    { label: "Early Detection Rate", value: "16%", icon: Activity, color: "from-orange-500 to-yellow-500" },
    { label: "Late Detection Rate", value: "60-70%", icon: TrendingUp, color: "from-blue-500 to-cyan-500" },
    { label: "AI Accuracy Rate", value: "94.7%", icon: Brain, color: "from-purple-500 to-pink-500" },
  ]

  const globalImpactStats = [
    {
      title: "Global Alzheimer's Crisis",
      stats: [
        { label: "Current Global Cases", value: "55M", description: "People living with dementia worldwide" },
        { label: "Projected by 2030", value: "78M", description: "Expected cases without intervention" },
        { label: "Economic Impact", value: "$1.3T", description: "Annual global cost of dementia care" },
        { label: "Undiagnosed Cases", value: "75%", description: "People with dementia lack proper diagnosis" },
      ],
    },
    {
      title: "Early Detection Impact",
      stats: [
        { label: "Detection Improvement", value: "60-70%", description: "Earlier than traditional methods" },
        { label: "Cost Reduction", value: "40%", description: "In long-term care expenses" },
        { label: "Quality of Life", value: "85%", description: "Improvement with early intervention" },
        { label: "Family Preparedness", value: "90%", description: "Better planning and support" },
      ],
    },
  ]

  const scientificFeatures = [
    {
      title: "AI-Powered Voice Analysis",
      description: "Advanced speech pattern recognition detects subtle cognitive changes through vocal biomarkers.",
      icon: Brain,
      accuracy: "94.7%",
    },
    {
      title: "Comprehensive Cognitive Battery",
      description:
        "12 validated assessment modules covering memory, attention, processing speed, and executive function.",
      icon: Target,
      accuracy: "91.2%",
    },
    {
      title: "Real-time Biometric Monitoring",
      description: "Continuous monitoring of stress levels, heart rate, and focus during assessment.",
      icon: Heart,
      accuracy: "89.5%",
    },
    {
      title: "Multilingual Processing",
      description: "Natural language processing in 12+ languages with cultural adaptation.",
      icon: Globe,
      accuracy: "96.3%",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900"></div>
        <div className="absolute inset-0 opacity-10">
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

        {/* Floating Particles (generated on client only) */}
        {mounted && particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-float opacity-20"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.width}px`,
              height: `${p.height}px`,
              animationDelay: `${p.animationDelay}s`,
              animationDuration: `${p.animationDuration}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 sm:space-x-4 group">
              <div className="relative">
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-500 group-hover:scale-110">
                  <Brain className="h-5 w-5 sm:h-8 sm:w-8 text-white animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full border-2 border-black animate-bounce">
                  <div className="w-full h-full bg-gradient-to-r from-emerald-400 to-green-400 rounded-full animate-ping" />
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Mano Veda
                </span>
                <div className="text-xs sm:text-sm text-gray-400 font-medium flex items-center">
                  <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                  AI-Powered Cognitive Health
                </div>
              </div>
              <div className="sm:hidden">
                <span className="text-xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Mano Veda
                </span>
              </div>
            </Link>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-white/20 text-white hover:bg-white/10 p-2"
              >
                <User className="h-4 w-4" />
              </Button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base">
                Features
              </a>
              <a href="#science" className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base">
                Science
              </a>
              <a href="#global-impact" className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base">
                Global Impact
              </a>
              <a href="#reviews" className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base">
                Reviews
              </a>
              <Link href="/subscription" className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base">
                Pricing
              </Link>
              <Button
                onClick={() => setShowMannu(true)}
                variant="outline"
                size="sm"
                className="bg-transparent border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
              >
                <MessageSquare className="mr-2 h-3 w-3" />
                <span className="hidden lg:inline">Chat with Mannu</span>
                <span className="lg:hidden">Mannu</span>
              </Button>
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              <Link href="/auth/login">
                <Button variant="outline" size="sm" className="bg-transparent border-white/20 text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
              <Link href="/patient-info">
                <Button size="sm" className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-2xl shadow-purple-500/25">
                  <span className="hidden lg:inline">Start Assessment</span>
                  <span className="lg:hidden">Start</span>
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden mt-4 pt-4 border-t border-white/10">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <Link href="/patient-info">
                  <Button size="sm" className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-2xl shadow-purple-500/25 btn-mobile">
                    <Brain className="mr-2 h-4 w-4" />
                    Start Assessment
                  </Button>
                </Link>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setShowMannu(true)}
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-purple-500/30 text-purple-300 hover:bg-purple-500/10 btn-mobile"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Mannu
                  </Button>
                  <Link href="/auth/login">
                    <Button variant="outline" size="sm" className="bg-transparent border-white/20 text-white hover:bg-white/10 btn-mobile">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                  Features
                </a>
                <a href="#science" className="text-gray-300 hover:text-white transition-colors">
                  Science
                </a>
                <Link href="/subscription" className="text-gray-300 hover:text-white transition-colors">
                  Pricing
                </Link>
                <a href="#reviews" className="text-gray-300 hover:text-white transition-colors">
                  Reviews
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-30 py-16 sm:py-24 lg:py-32 px-4">
        <div className="container mx-auto text-center max-w-6xl">
          <div className="relative mb-8 sm:mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full" />
            <h1 className="relative text-[clamp(2.5rem,10vw,4.5rem)] sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.03] tracking-tight">
              <span className="block text-white mb-0">Detect Alzheimer</span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Earlier
              </span>
            </h1>
          </div>

          <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12 lg:mb-16 font-light px-4">
            Revolutionary AI-powered cognitive assessment platform with real-time analysis, multilingual support, and
            personalized recommendations. Early detection saves lives and improves outcomes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 lg:mb-20 px-4">
            <Link href="/patient-info" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl rounded-2xl shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-500 transform hover:scale-105 border-0 btn-mobile"
              >
                <Brain className="mr-3 sm:mr-4 h-5 w-5 sm:h-6 sm:w-6" />
                Start Free Assessment
              </Button>
            </Link>
            <Button
              onClick={() => setShowMannu(true)}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto bg-transparent border-white/20 text-white hover:bg-white/10 px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl rounded-2xl backdrop-blur-xl btn-mobile"
            >
              <MessageSquare className="mr-3 sm:mr-4 h-5 w-5 sm:h-6 sm:w-6" />
              Meet Mannu AI
            </Button>
            <Link href="/consultation" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl rounded-2xl btn-mobile"
              >
                Want to Consult a Doctor?
              </Button>
            </Link>
          </div>

          {/* Critical Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-4">
            {globalStats.map((stat, index) => (
              <div key={index} className="text-center group hover:scale-105 sm:hover:scale-110 transition-all duration-500">
                <div
                  className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${stat.color} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-2xl group-hover:shadow-3xl transition-all duration-500`}
                >
                  <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-gray-400 text-xs sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-30 py-32 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-white mb-8">
              Advanced AI
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Technology
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Cutting-edge artificial intelligence meets clinical expertise to deliver the most comprehensive cognitive
              health assessment available.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI Voice Analysis",
                description:
                  "Advanced speech pattern recognition detects subtle cognitive changes through vocal biomarkers and linguistic patterns.",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Target,
                title: "12 Cognitive Tests",
                description:
                  "Comprehensive battery covering memory, attention, processing speed, executive function, and spatial reasoning.",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Globe,
                title: "Multilingual Support",
                description:
                  "Available in 12+ languages with cultural adaptations and native speaker voice recognition.",
                color: "from-emerald-500 to-green-500",
              },
              {
                icon: Heart,
                title: "Biometric Monitoring",
                description:
                  "Real-time tracking of heart rate, stress levels, and focus during assessment for comprehensive analysis.",
                color: "from-red-500 to-orange-500",
              },
              {
                icon: Shield,
                title: "HIPAA Compliant",
                description:
                  "Enterprise-grade security with end-to-end encryption and full compliance with healthcare privacy regulations.",
                color: "from-indigo-500 to-purple-500",
              },
              {
                icon: BarChart3,
                title: "Detailed Reports",
                description:
                  "Professional PDF reports with clinical insights, recommendations, and longitudinal tracking capabilities.",
                color: "from-yellow-500 to-orange-500",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 backdrop-blur-xl shadow-2xl hover:scale-105 transition-all duration-500 group"
              >
                <CardContent className="p-8">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-all duration-500`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Science Section */}
      <section id="science" className="relative z-30 py-32 px-4 bg-gradient-to-br from-gray-900/30 to-black/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-white mb-8">
              Scientific
              <span className="block bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Validation
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our AI models are trained on extensive clinical datasets and validated through rigorous scientific studies
              with leading medical institutions worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {scientificFeatures.map((feature, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 backdrop-blur-xl shadow-2xl"
              >
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                        <Badge className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-300 border border-emerald-500/30">
                          {feature.accuracy} Accuracy
                        </Badge>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Research Partners */}
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white mb-8">Developers</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {["Anwesa Banerjee", "Mousoom Samanta", "Dipanjan Basak", "Titli Dutta"].map((partner, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-white/10"
                >
                  <div className="text-white font-semibold">{partner}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Global Impact Section */}
      <section id="global-impact" className="relative z-30 py-32 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-white mb-8">
              Global Alzheimer's
              <span className="block bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Crisis & Impact
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Understanding the urgent need for early detection and intervention in the global fight against Alzheimer's
              disease.
            </p>
          </div>

          {/* Crisis Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {globalImpactStats.map((section, sectionIndex) => (
              <Card
                key={sectionIndex}
                className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 backdrop-blur-xl shadow-2xl"
              >
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                    {sectionIndex === 0 ? (
                      <AlertTriangle className="mr-3 h-6 w-6 text-red-400" />
                    ) : (
                      <TrendingUp className="mr-3 h-6 w-6 text-green-400" />
                    )}
                    {section.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    {section.stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div
                          className={`text-3xl font-black mb-2 ${
                            sectionIndex === 0 ? "text-red-400" : "text-green-400"
                          }`}
                        >
                          {stat.value}
                        </div>
                        <div className="text-white font-semibold text-sm mb-1">{stat.label}</div>
                        <div className="text-gray-400 text-xs">{stat.description}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Impact Stories */}
          <div className="bg-gradient-to-br from-gray-900/50 to-black/50 p-12 rounded-3xl border border-white/10 backdrop-blur-xl">
            <h3 className="text-3xl font-bold text-white mb-8 text-center">Real Impact Stories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                  <span className="text-white font-semibold">Early Detection Success</span>
                </div>
                <p className="text-gray-300">
                  "Mano Veda AI detected subtle cognitive changes 18 months before clinical symptoms appeared, allowing
                  for early intervention that significantly improved patient outcomes."
                </p>
                <div className="text-sm text-gray-400">- Dr. Jennifer Liu, Neurologist</div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Heart className="h-6 w-6 text-red-400" />
                  <span className="text-white font-semibold">Family Peace of Mind</span>
                </div>
                <p className="text-gray-300">
                  "Regular monitoring through Mano Veda has given our family confidence in managing my mother's
                  cognitive health. The detailed reports help us make informed care decisions."
                </p>
                <div className="text-sm text-gray-400">- Maria Santos, Caregiver</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="relative z-30 py-32 px-4 bg-gradient-to-br from-gray-900/30 to-black/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-white mb-8">
              What People
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Are Saying
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Trusted by healthcare professionals and patients worldwide for accurate, compassionate cognitive care.
            </p>
          </div>

          {/* Featured Testimonial */}
          <div className="mb-16">
            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 backdrop-blur-xl shadow-2xl max-w-4xl mx-auto">
              <CardContent className="p-12">
                <div className="flex items-center justify-center mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-8 w-8 text-yellow-400 fill-current" />
                  ))}
                </div>
                <Quote className="h-12 w-12 text-purple-400 mx-auto mb-6" />
                <blockquote className="text-2xl text-white text-center leading-relaxed mb-8">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">{testimonials[currentTestimonial].name}</div>
                    <div className="text-gray-400">{testimonials[currentTestimonial].role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Testimonial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className={`bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 backdrop-blur-xl transition-all duration-500 cursor-pointer ${index === currentTestimonial ? "ring-2 ring-purple-500 scale-105" : "hover:scale-105"}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">{testimonial.content}</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{testimonial.name}</div>
                      <div className="text-gray-400 text-xs">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-30 py-32 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="bg-gradient-to-br from-gray-900/50 to-black/50 p-16 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
            <h2 className="text-5xl font-black text-white mb-8">
              Ready to Transform
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Your Cognitive Health?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Join millions worldwide who trust Mano Veda AI for comprehensive cognitive health assessment. Early
              detection, personalized insights, and expert care - all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/patient-info">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-12 py-6 text-xl rounded-2xl shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-500 transform hover:scale-105 border-0"
                >
                  <Brain className="mr-4 h-6 w-6" />
                  Start Your Assessment
                </Button>
              </Link>
              <Button
                onClick={() => setShowMannu(true)}
                variant="outline"
                size="lg"
                className="bg-transparent border-white/20 text-white hover:bg-white/10 px-12 py-6 text-xl rounded-2xl backdrop-blur-xl"
              >
                <MessageSquare className="mr-4 h-6 w-6" />
                Talk to Mannu AI
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-30 border-t border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Mano Veda
                </span>
              </div>
              <p className="text-gray-400">
                Revolutionizing cognitive healthcare with AI-powered early detection and personalized care.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <div className="space-y-2">
                <Link href="/assessment" className="block text-gray-400 hover:text-white transition-colors">
                  Assessment
                </Link>
                <Link href="/results" className="block text-gray-400 hover:text-white transition-colors">
                  Results
                </Link>
                <Link href="/patient-info" className="block text-gray-400 hover:text-white transition-colors">
                  Patient Portal
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Help Center
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Documentation
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-400">
                  <Mail className="h-4 w-4" />
                  <span>support@manoveda.ai</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <Phone className="h-4 w-4" />
                  <span>1-800-MANO-VEDA</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span>Global Healthcare Solutions</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Mano Veda Healthcare Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Mannu AI Assistant */}
      {showMannu && <MannuAssistant isFixed={true} onClose={() => setShowMannu(false)} />}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
