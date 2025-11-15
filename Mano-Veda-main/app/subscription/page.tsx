"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Check,
  Star,
  Crown,
  Zap,
  Shield,
  Users,
  Globe,
  Heart,
  Target,
  ArrowRight,
  Sparkles,
  MessageSquare,
  BarChart3,
  Clock,
  Phone,
  Mail,
  CheckCircle,
  X,
} from "lucide-react"
import Link from "next/link"
import { MannuAssistant } from "@/components/ai-assistant-mannu"

interface PricingPlan {
  id: string
  name: string
  price: number
  originalPrice?: number
  period: string
  description: string
  features: string[]
  limitations?: string[]
  popular?: boolean
  enterprise?: boolean
  color: string
  icon: any
  buttonText: string
  assessments: string
  support: string
  reports: string
}

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>("personal")
  const [showMannu, setShowMannu] = useState(false)

  const plans: PricingPlan[] = [
    {
      id: "personal",
      name: "Personal",
      price: 2500,
      period: "month",
      description: "Unlimited personal cognitive health assessments with AI-driven insights",
      features: [
        "Up to 50 assessments/month",
        "Easy-to-understand reports with AI-driven insights",
        "Early detection alerts with lifestyle recommendations",
        "Secure data storage with full privacy control",
        "Optional caregiver/family sharing feature",
        "Basic analytics dashboard",
        "Email support",
        "Mobile & web app access",
      ],
      popular: true,
      color: "from-blue-500 to-purple-500",
      icon: Brain,
      buttonText: "Subscribe Now",
      assessments: "50/month",
      support: "Email",
      reports: "AI-Driven",
    },
    {
      id: "research",
      name: "Research",
      price: 0,
      period: "custom",
      description: "Access anonymized cognitive health datasets for large-scale studies (Scholarship available)",
      features: [
        "Unlimited assessments",
        "Access anonymized cognitive health datasets for large-scale studies",
        "Advanced analysis dashboards with export capabilities",
        "Customizable cognitive assessments for experimental protocols",
        "Collaboration features for multi-center studies",
        "Dedicated researcher support and data compliance assistance",
        "Advanced analytics",
        "HIPAA-compliant reports",
        "Priority support",
      ],
      color: "from-emerald-500 to-green-500",
      icon: BarChart3,
      buttonText: "Contact for Pricing",
      assessments: "Unlimited",
      support: "Priority",
      reports: "HIPAA-Compliant",
    },
    {
      id: "enterprise",
      name: "Hospital or Organization",
      price: 0,
      period: "custom",
      description: "Scalable cognitive assessments for patients and staff with enterprise features",
      features: [
        "Scalable cognitive assessments for patients and staff",
        "HIPAA-compliant reporting integrated into existing workflows",
        "Multilingual support for diverse patient populations",
        "Priority support + training for medical teams",
        "Enterprise options: on-premise deployment, custom integrations",
        "24/7 support",
        "Custom integrations",
        "Dedicated account manager",
        "On-premise deployment option",
        "24/7 premium support",
      ],
      enterprise: true,
      color: "from-purple-500 to-pink-500",
      icon: Crown,
      buttonText: "Contact Sales",
      assessments: "Unlimited",
      support: "24/7 Premium",
      reports: "Enterprise Grade",
    },
  ]

  const features = [
    {
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze speech patterns, cognitive responses, and behavioral markers",
      icon: Brain,
    },
    {
      title: "Real-Time Monitoring",
      description: "Continuous biometric tracking during assessments for comprehensive health insights",
      icon: Heart,
    },
    {
      title: "Global Accessibility",
      description: "Available in 12+ languages with cultural adaptations for accurate assessments worldwide",
      icon: Globe,
    },
    {
      title: "Clinical Grade Security",
      description: "HIPAA-compliant infrastructure with enterprise-grade encryption and data protection",
      icon: Shield,
    },
  ]

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
    // Here you would typically integrate with a payment processor or contact form
    if (planId === "personal") {
      // Redirect to payment processor for Personal plan
      console.log(`Selected plan: ${planId}`)
    } else {
      // Redirect to contact form for Research and Enterprise plans
      console.log(`Contact requested for plan: ${planId}`)
    }
  }

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
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
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

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                onClick={() => setShowMannu(true)}
                variant="outline"
                size="sm"
                className="bg-transparent border-purple-500/30 text-purple-300 hover:bg-purple-500/10 btn-mobile"
              >
                <MessageSquare className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Chat with Mannu</span>
                <span className="sm:hidden">Mannu</span>
              </Button>
              <Link href="/auth/login">
                <Button variant="outline" size="sm" className="bg-transparent border-white/20 text-white hover:bg-white/10 btn-mobile">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-30 py-12 sm:py-16 lg:py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Hero Section */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="relative mb-6 sm:mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full" />
              <h1 className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
                <span className="block text-white mb-2 sm:mb-4">Subscription for</span>
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Businesses
                </span>
              </h1>
            </div>
            <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12 lg:mb-16 px-4">
              Empower your healthcare practice with AI-powered cognitive assessments tailored for organizations of all sizes.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 lg:mb-20">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative overflow-hidden border-0 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl transition-all duration-500 hover:scale-105 ${
                  plan.popular ? "ring-2 ring-purple-500/50 shadow-2xl shadow-purple-500/25" : ""
                } ${selectedPlan === plan.id ? "ring-2 ring-blue-500/50" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-2 text-sm font-bold">
                    <Star className="inline w-4 h-4 mr-1" />
                    MOST POPULAR
                  </div>
                )}

                <CardHeader className={`text-center ${plan.popular ? "pt-12 sm:pt-16" : "pt-6 sm:pt-8"} px-4 sm:px-6`}>
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${plan.color} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-2xl`}>
                    <plan.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-white mb-2">{plan.name}</CardTitle>
                  <div className="mb-3 sm:mb-4">
                    <div className="flex items-baseline justify-center">
                      {plan.price === 0 ? (
                        <span className="text-lg sm:text-2xl lg:text-3xl font-black text-white text-center">Need to discuss</span>
                      ) : (
                        <>
                          <span className="text-xl sm:text-2xl font-black text-white">₹{plan.price}</span>
                          <span className="text-gray-400 ml-2 text-sm sm:text-base">/{plan.period}</span>
                        </>
                      )}
                    </div>
                    {plan.id === "research" && (
                      <div className="text-emerald-400 text-xs sm:text-sm font-medium mt-1">
                        (Scholarship available)
                      </div>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-6 sm:pb-8">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="flex justify-between items-center py-2 sm:py-3 px-3 sm:px-4 bg-white/5 rounded-lg">
                      <span className="text-gray-400 text-xs sm:text-sm">Assessments</span>
                      <span className="text-white font-medium text-xs sm:text-sm">{plan.assessments}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 sm:py-3 px-3 sm:px-4 bg-white/5 rounded-lg">
                      <span className="text-gray-400 text-xs sm:text-sm">Support</span>
                      <span className="text-white font-medium text-xs sm:text-sm">{plan.support}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 sm:py-3 px-3 sm:px-4 bg-white/5 rounded-lg">
                      <span className="text-gray-400 text-xs sm:text-sm">Reports</span>
                      <span className="text-white font-medium text-xs sm:text-sm">{plan.reports}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 sm:space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-xs sm:text-sm leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limitations */}
                  {plan.limitations && (
                    <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-white/10">
                      <h4 className="text-gray-400 text-xs sm:text-sm font-medium">Limitations:</h4>
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                          <X className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-500 text-xs sm:text-sm leading-relaxed">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    onClick={() => handlePlanSelect(plan.id)}
                    className={`w-full py-4 sm:py-6 text-base sm:text-lg font-medium rounded-xl transition-all duration-300 btn-mobile ${
                      plan.popular
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-2xl shadow-blue-500/25"
                        : plan.id === "research"
                        ? "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-2xl shadow-emerald-500/25"
                        : plan.enterprise
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-2xl shadow-purple-500/25"
                        : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                    }`}
                  >
                    {plan.buttonText}
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Section */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-white mb-4">
                Why Choose
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Mano Veda AI?
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Advanced technology meets clinical expertise to deliver the most comprehensive cognitive health platform available.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border-0 hover:scale-105 transition-all duration-500">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-white mb-8">
              Frequently Asked
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {[
                {
                  question: "How accurate is the AI assessment?",
                  answer: "Our AI achieves 94.7% accuracy in cognitive assessment, validated through clinical trials with over 10,000 participants."
                },
                {
                  question: "Is my data secure and private?",
                  answer: "Yes, we use HIPAA-compliant infrastructure with end-to-end encryption and never share personal data with third parties."
                },
                {
                  question: "Can I cancel my subscription anytime?",
                  answer: "Absolutely. You can cancel your subscription at any time with no cancellation fees or penalties."
                },
                {
                  question: "Do you offer family plans?",
                  answer: "Yes, our Professional plan includes family sharing for up to 4 members at no additional cost."
                },
                {
                  question: "What languages are supported?",
                  answer: "We support 12+ languages including English, Spanish, French, German, Chinese, Japanese, and more."
                },
                {
                  question: "How long does an assessment take?",
                  answer: "A complete assessment typically takes 45-60 minutes, but you can pause and resume at any time."
                }
              ].map((faq, index) => (
                <Card key={index} className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border-0 text-left">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-white mb-3">{faq.question}</h3>
                    <p className="text-gray-300">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl border-0 max-w-4xl mx-auto">
              <CardContent className="p-12">
                <h2 className="text-4xl font-black text-white mb-6">
                  Ready to Start Your
                  <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Cognitive Health Journey?
                  </span>
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Join thousands of users who trust Mano Veda AI for comprehensive cognitive health monitoring and early detection.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/patient-info">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg rounded-xl shadow-2xl shadow-purple-500/25"
                    >
                      <Brain className="mr-3 h-6 w-6" />
                      Start Free Assessment
                    </Button>
                  </Link>
                  <Button
                    onClick={() => setShowMannu(true)}
                    variant="outline"
                    size="lg"
                    className="bg-transparent border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-xl"
                  >
                    <MessageSquare className="mr-3 h-6 w-6" />
                    Talk to Mannu AI
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Mannu Assistant */}
      {showMannu && <MannuAssistant onClose={() => setShowMannu(false)} />}
    </div>
  )
}