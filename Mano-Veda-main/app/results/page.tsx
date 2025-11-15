"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import PDFGenerator from "@/components/pdf-generator"
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Heart,
  Mic,
  Eye,
  Target,
  Zap,
  Puzzle,
  BookOpen,
  Calculator,
  Timer,
  Calendar,
  User,
  Sparkles,
  ArrowRight,
  Star,
  Shield,
  Lightbulb,
} from "lucide-react"

interface GameScore {
  game: string
  score: number
  maxScore: number
}

interface AssessmentResults {
  completedAt: string | number | Date
  sessionDuration: number // seconds
  overallScore: number
  riskLevel: string
  completedTasks: string[]
  gameScores: GameScore[]
  voiceAnalysis: {
    clarity: number
    fluency: number
    pace: number
  }
  biometrics: {
    heartRate: number
    stressLevel: number
    focusLevel: number
  }
}

export default function ResultsPage(): JSX.Element {
  const [results, setResults] = useState<AssessmentResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [showRiskPopup, setShowRiskPopup] = useState(false)
  const [voice, setVoice] = useState<any | null>(null)

  useEffect(() => {
    try {
      const storedResults = localStorage.getItem("assessmentResults")
      if (storedResults) {
        const parsed = JSON.parse(storedResults) as any
        setResults(parsed)
        if (parsed?.voiceAnalysis) setVoice(parsed.voiceAnalysis)
      } else {
        // fallback demo data
        const demo = {
          overallScore: 78,
          riskLevel: "High",
          completedTasks: ["voice-analysis", "memory-matching", "attention-focus"],
          gameScores: [
            { game: "Memory", score: 85, maxScore: 100 },
            { game: "Attention", score: 78, maxScore: 100 },
            { game: "Processing", score: 82, maxScore: 100 },
            { game: "Spatial", score: 76, maxScore: 100 },
            { game: "Working", score: 85, maxScore: 100 },
            { game: "Sequence", score: 73, maxScore: 100 },
            { game: "Recall", score: 80, maxScore: 100 },
            { game: "Trail", score: 82, maxScore: 100 },
            { game: "Clock", score: 77, maxScore: 100 },
            { game: "Verbal", score: 88, maxScore: 100 },
            { game: "Mmse", score: 90, maxScore: 100 },
          ],
          voiceAnalysis: { clarity: 85, fluency: 78, pace: 82, label: 'neutral', confidence: 0.75 },
          biometrics: { heartRate: 72, stressLevel: 25, focusLevel: 85 },
          sessionDuration: 1200,
          completedAt: new Date().toISOString(),
        }
        setResults(demo as any)
        setVoice(demo.voiceAnalysis)
      }
    } catch (error) {
      console.error("Error loading results:", error)
      setResults(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!results) return
    const isHigh = results.riskLevel?.toLowerCase() === "high"
    setShowRiskPopup(isHigh)
  }, [results])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-white text-xl">Loading your results...</div>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 backdrop-blur-xl max-w-md">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-300 mb-4">No Results Found</h2>
            <p className="text-red-200 mb-6">Please complete the assessment first.</p>
            <Link href="/assessment">
              <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">
                Start Assessment
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // helpers
  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "low":
        return "from-emerald-500 to-green-500"
      case "moderate":
        return "from-yellow-500 to-orange-500"
      case "high":
        return "from-red-500 to-pink-500"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case "low":
        return <CheckCircle className="h-8 w-8" />
      case "moderate":
        return <AlertTriangle className="h-8 w-8" />
      case "high":
        return <AlertTriangle className="h-8 w-8" />
      default:
        return <Activity className="h-8 w-8" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getPerformanceLevel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    return "Needs Work"
  }

  const cognitiveIcons: Record<string, React.ComponentType<any>> = {
    Memory: Eye,
    Attention: Target,
    Processing: Zap,
    Spatial: Puzzle,
    Working: BookOpen,
    Sequence: Calculator,
    Recall: BookOpen,
    Trail: Target,
    Clock: Timer,
    Verbal: Mic,
    Mmse: Brain,
  }

  // Performance distribution
  const excellent = results.gameScores.filter((g) => g.score >= 80).length
  const good = results.gameScores.filter((g) => g.score >= 60 && g.score < 80).length
  const needsWork = results.gameScores.filter((g) => g.score < 60).length

  // Cognitive domains
  const domains = [
    {
      name: "Memory & Learning",
      icon: Brain,
      color: "from-blue-500 to-cyan-500",
      scores: results.gameScores.filter((g) => ["Memory", "Recall", "Working"].includes(g.game)),
    },
    {
      name: "Attention & Focus",
      icon: Target,
      color: "from-purple-500 to-pink-500",
      scores: results.gameScores.filter((g) => ["Attention", "Trail"].includes(g.game)),
    },
    {
      name: "Processing Speed",
      icon: Zap,
      color: "from-orange-500 to-red-500",
      scores: results.gameScores.filter((g) => ["Processing", "Sequence"].includes(g.game)),
    },
    {
      name: "Visuospatial Skills",
      icon: Puzzle,
      color: "from-green-500 to-emerald-500",
      scores: results.gameScores.filter((g) => ["Spatial", "Clock"].includes(g.game)),
    },
    {
      name: "Language & Verbal",
      icon: Mic,
      color: "from-indigo-500 to-purple-500",
      scores: results.gameScores.filter((g) => ["Verbal", "Mmse"].includes(g.game)),
    },
  ]

  const safeCompletedAt = (val: string | number | Date) => {
    try {
      return new Date(val).toLocaleDateString()
    } catch (e) {
      return String(val)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900" />
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
      </div>

      {/* High Risk Popup */}
      {showRiskPopup && (
        <div className="fixed inset-0 z-[80] bg-black/70 flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-slate-900 border border-red-500/30 rounded-2xl p-6 shadow-2xl">
            <button
              aria-label="Close"
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              onClick={() => setShowRiskPopup(false)}
            >
              ✕
            </button>
            <div className="text-xl font-bold text-red-300 mb-2">You may be at high risk of Alzheimer’s</div>
            <p className="text-gray-200 mb-4">Would you like to consult a specialist?</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/consultation?specialization=Neurologist" className="w-full sm:w-auto">
                <Button className="w-full bg-gradient-to-r from-red-500 to-pink-500">Book Neurologist</Button>
              </Link>
              <Link href="/alzheimers-care" className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full bg-white/10">Alzheimer’s Care Page</Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-500 group-hover:scale-110">
                  <Brain className="h-8 w-8 text-white animate-pulse" />
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
                  AI-Powered Assessment Results
                </div>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <Badge className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-500/30 px-4 py-2 font-bold backdrop-blur-sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                Assessment Complete
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-30 py-12 px-4">
        <div className="container mx-auto max-w-7xl space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-8">
            <div className="relative inline-block">
              <div
                className={`w-32 h-32 bg-gradient-to-br ${getRiskColor(results.riskLevel)} rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-purple-500/25 animate-pulse`}
              >
                {getRiskIcon(results.riskLevel)}
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-bounce">
                <Star className="h-6 w-6 text-white" />
              </div>
            </div>

            <div>
              <h1 className="text-6xl font-black text-white mb-4">
                Your Cognitive
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Assessment Results
                </span>
              </h1>
              <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Comprehensive AI-powered analysis of your cognitive performance across multiple domains
              </p>
            </div>

            {/* Overall Score Card */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-white/20 backdrop-blur-xl max-w-4xl mx-auto shadow-2xl">
              <CardContent className="p-12">
                <div className="grid md:grid-cols-3 gap-8 items-center">
                  <div className="text-center">
                    <div className="text-7xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                      {results.overallScore}
                    </div>
                    <div className="text-2xl text-gray-300 font-bold">Overall Score</div>
                    <div className="text-sm text-gray-400">out of 100</div>
                  </div>

                  <div className="text-center">
                    <div
                      className={`inline-flex items-center px-6 py-3 rounded-2xl bg-gradient-to-r ${getRiskColor(results.riskLevel)} text-white font-bold text-xl shadow-lg`}
                    >
                      {getRiskIcon(results.riskLevel)}
                      <span className="ml-2">{results.riskLevel} Risk</span>
                    </div>
                    <div className="text-sm text-gray-400 mt-2">Cognitive Risk Level</div>
                  </div>

                  <div className="text-center">
                    <div className="text-4xl font-black text-emerald-400 mb-2">{results.gameScores.length}</div>
                    <div className="text-xl text-gray-300 font-bold">Tests Completed</div>
                    <div className="text-sm text-gray-400">Comprehensive Battery</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Overview */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Individual Test Scores */}
            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 backdrop-blur-xl shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-white/10">
                <CardTitle className="flex items-center text-white text-2xl">
                  <BarChart3 className="mr-4 h-8 w-8 text-blue-400" />
                  Individual Test Performance
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg">Detailed breakdown of each cognitive assessment</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {results.gameScores.map((game, index) => {
                    const IconComponent = cognitiveIcons[game.game] || Activity
                    const percentage = Math.round((game.score / game.maxScore) * 100)

                    return (
                      <div key={index} className="group">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <IconComponent className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <div className="font-bold text-white text-lg">{game.game}</div>
                              <div className="text-sm text-gray-400">{getPerformanceLevel(percentage)}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-black ${getScoreColor(percentage)}`}>{percentage}%</div>
                            <div className="text-sm text-gray-400">
                              {game.score}/{game.maxScore}
                            </div>
                          </div>
                        </div>
                        <div className="relative">
                          <Progress value={percentage} className="h-3 bg-gray-800/50" />
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-20 blur-sm"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Performance Distribution */}
            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 backdrop-blur-xl shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-b border-white/10">
                <CardTitle className="flex items-center text-white text-2xl">
                  <PieChart className="mr-4 h-8 w-8 text-emerald-400" />
                  Performance Distribution
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg">Overview of your cognitive performance levels</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-8">
                  {/* Pie Chart Visualization */}
                  <div className="relative w-64 h-64 mx-auto">
                    <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                      {/* Excellent - Green */}
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="20"
                        strokeDasharray={`${(excellent / results.gameScores.length) * 502.4} 502.4`}
                        strokeDashoffset="0"
                        className="transition-all duration-1000"
                      />
                      {/* Good - Yellow */}
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="20"
                        strokeDasharray={`${(good / results.gameScores.length) * 502.4} 502.4`}
                        strokeDashoffset={`-${(excellent / results.gameScores.length) * 502.4}`}
                        className="transition-all duration-1000"
                      />
                      {/* Needs Work - Red */}
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="20"
                        strokeDasharray={`${(needsWork / results.gameScores.length) * 502.4} 502.4`}
                        strokeDashoffset={`-${((excellent + good) / results.gameScores.length) * 502.4}`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-black text-white">{results.gameScores.length}</div>
                        <div className="text-sm text-gray-400">Tests</div>
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-emerald-500 rounded-full" />
                        <span className="text-emerald-300 font-bold">Excellent (80-100%)</span>
                      </div>
                      <span className="text-2xl font-black text-emerald-400">{excellent}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                        <span className="text-yellow-300 font-bold">Good (60-79%)</span>
                      </div>
                      <span className="text-2xl font-black text-yellow-400">{good}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-red-500 rounded-full" />
                        <span className="text-red-300 font-bold">Needs Work (&lt;60%)</span>
                      </div>
                      <span className="text-2xl font-black text-red-400">{needsWork}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cognitive Domains */}
          <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 backdrop-blur-xl shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-white/10">
              <CardTitle className="flex items-center text-white text-2xl">
                <Brain className="mr-4 h-8 w-8 text-purple-400" />
                Cognitive Domain Analysis
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg">Performance breakdown by cognitive function areas</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {domains.map((domain, index) => {
                  if (domain.scores.length === 0) return null

                  const avgScore = Math.round(domain.scores.reduce((sum, s) => sum + s.score, 0) / domain.scores.length)
                  const IconComponent = domain.icon

                  return (
                    <Card
                      key={index}
                      className={`bg-gradient-to-br ${domain.color}/10 border border-white/10 backdrop-blur-xl hover:scale-105 transition-all duration-300 cursor-pointer group`}
                      onClick={() => setSelectedDomain(selectedDomain === domain.name ? null : domain.name)}
                    >
                      <CardContent className="p-6">
                        <div className="text-center space-y-4">
                          <div
                            className={`w-16 h-16 bg-gradient-to-br ${domain.color} rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}
                          >
                            <IconComponent className="h-8 w-8 text-white" />
                          </div>

                          <div>
                            <h3 className="font-bold text-white text-lg mb-2">{domain.name}</h3>
                            <div className={`text-3xl font-black ${getScoreColor(avgScore)} mb-2`}>{avgScore}%</div>
                            <div className="text-sm text-gray-400 mb-4">{domain.scores.length} test{domain.scores.length > 1 ? "s" : ""}</div>
                          </div>

                          <div className="relative">
                            <Progress value={avgScore} className="h-2 bg-gray-800/50" />
                            <div
                              className={`absolute inset-0 bg-gradient-to-r ${domain.color} rounded-full opacity-60 blur-sm`}
                              style={{ width: `${avgScore}%` }}
                            />
                          </div>

                          {selectedDomain === domain.name && (
                            <div className="mt-4 space-y-2 text-left">
                              {domain.scores.map((score, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span className="text-gray-300">{score.game}</span>
                                  <span className={getScoreColor(score.score)}>{score.score}%</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Voice Analysis & Biometrics */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Voice Analysis */}
            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 backdrop-blur-xl shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-white/10">
                <CardTitle className="flex items-center text-white text-2xl">
                  <Mic className="mr-4 h-8 w-8 text-cyan-400" />
                  AI Voice Analysis
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg">Speech pattern and fluency assessment</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Label + Confidence (if available) */}
                  {voice && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-white font-semibold">Predicted Label: <span className="text-cyan-300 font-bold capitalize">{voice.label || '—'}</span></div>
                      <div className="text-gray-300">Confidence: <span className="font-bold text-cyan-400">{Math.round((voice.confidence || 0) * 100)}%</span></div>
                    </div>
                  )}

                  {[
                    { label: "Speech Clarity", value: results.voiceAnalysis.clarity, color: "from-blue-500 to-cyan-500" },
                    { label: "Speech Fluency", value: results.voiceAnalysis.fluency, color: "from-purple-500 to-pink-500" },
                    { label: "Speech Pace", value: results.voiceAnalysis.pace, color: "from-emerald-500 to-green-500" },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-bold">{item.label}</span>
                        <span className={`text-xl font-black ${getScoreColor(item.value)}`}>{item.value}%</span>
                      </div>
                      <div className="relative">
                        <Progress value={item.value} className="h-3 bg-gray-800/50" />
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-full opacity-60 blur-sm`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Biometric Data */}
            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 backdrop-blur-xl shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border-b border-white/10">
                <CardTitle className="flex items-center text-white text-2xl">
                  <Heart className="mr-4 h-8 w-8 text-red-400" />
                  Biometric Monitoring
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg">Physiological indicators during assessment</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                      <AlertTriangle className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-2xl font-black text-orange-400 mb-1">{results.biometrics.stressLevel}%</div>
                    <div className="text-sm text-gray-400">Stress</div>
                    <div className="text-xs text-gray-500 mt-1">Level</div>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                      <Target className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-2xl font-black text-emerald-400 mb-1">{results.biometrics.focusLevel}%</div>
                    <div className="text-sm text-gray-400">Focus</div>
                    <div className="text-xs text-gray-500 mt-1">Level</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 backdrop-blur-xl shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-b border-white/10">
              <CardTitle className="flex items-center text-white text-2xl">
                <Lightbulb className="mr-4 h-8 w-8 text-cyan-400" />
                Next Steps
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg">Consult with a doctor to discuss your assessment</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link href="/consultation" className="w-full sm:w-auto">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">Consult with a Doctor</Button>
                </Link>
                <Link href="/alzheimers-care" className="w-full sm:w-auto">
                  <Button variant="secondary" className="w-full bg-white/10">Learn about Alzheimer’s Care</Button>
                </Link>
              </div>
              {/* Recommendations */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <TrendingUp className="mr-3 h-6 w-6 text-green-400" />
                    Strengths
                  </h3>
                  {results.gameScores
                    .filter((g) => g.score >= 80)
                    .slice(0, 3)
                    .map((game, index) => (
                      <div key={index} className="flex items-center space-x-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                        <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                        <div>
                          <div className="font-bold text-green-300">{game.game} Performance</div>
                          <div className="text-sm text-green-200">Excellent score of {game.score}% demonstrates strong cognitive ability in this area.</div>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <Target className="mr-3 h-6 w-6 text-orange-400" />
                    Areas for Improvement
                  </h3>
                  {results.gameScores
                    .filter((g) => g.score < 80)
                    .slice(0, 3)
                    .map((game, index) => (
                      <div key={index} className="flex items-center space-x-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                        <AlertTriangle className="h-6 w-6 text-orange-400 flex-shrink-0" />
                        <div>
                          <div className="font-bold text-orange-300">{game.game} Enhancement</div>
                          <div className="text-sm text-orange-200">Consider targeted exercises to improve performance in this cognitive domain.</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Items */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* PDF Report */}
            <div>
              <PDFGenerator />
            </div>

            {/* Next Steps */}
            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 backdrop-blur-xl shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-white/10">
                <CardTitle className="flex items-center text-white text-2xl">
                  <Calendar className="mr-4 h-8 w-8 text-indigo-400" />
                  Next Steps
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg">Recommended actions based on your results</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1"><span className="text-white font-bold text-sm">1</span></div>
                    <div>
                      <div className="font-bold text-blue-300 mb-2">Share with Healthcare Provider</div>
                      <div className="text-blue-200 text-sm">Discuss these results with your doctor or neurologist for professional interpretation.</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1"><span className="text-white font-bold text-sm">2</span></div>
                    <div>
                      <div className="font-bold text-purple-300 mb-2">Follow-up Assessment</div>
                      <div className="text-purple-200 text-sm">Schedule a follow-up assessment in 6 months to track cognitive changes over time.</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1"><span className="text-white font-bold text-sm">3</span></div>
                    <div>
                      <div className="font-bold text-emerald-300 mb-2">Lifestyle Optimization</div>
                      <div className="text-emerald-200 text-sm">Implement brain-healthy habits: regular exercise, quality sleep, and cognitive training.</div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Link href="/assessment">
                      <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-4 text-lg rounded-xl shadow-lg">
                        <ArrowRight className="mr-2 h-5 w-5" />
                        Take Another Assessment
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Session Info */}
          <Card className="bg-gradient-to-br from-gray-900/30 to-black/30 border border-white/5 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Assessment ID: {String(results.completedAt).slice(0, 8)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Completed: {safeCompletedAt(results.completedAt)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Timer className="h-4 w-4" />
                    <span>Duration: {Math.round(results.sessionDuration / 60)} minutes</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Powered by Mano Veda AI</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}