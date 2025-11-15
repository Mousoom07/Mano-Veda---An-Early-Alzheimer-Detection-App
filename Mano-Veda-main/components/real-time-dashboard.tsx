"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Activity,
  Heart,
  Target,
  TrendingUp,
  Clock,
  Zap,
  Eye,
  Mic,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Sparkles,
} from "lucide-react"
import { useRealTimeAssessment } from "@/hooks/useRealTimeAssessment"

interface RealTimeDashboardProps {
  userId?: string
}

export function RealTimeDashboard({ userId = "demo-user" }: RealTimeDashboardProps) {
  const { metrics } = useRealTimeAssessment(userId)
  const [animatedScores, setAnimatedScores] = useState({
    overall: 0,
    memory: 0,
    attention: 0,
    processing: 0,
  })

  // Animate score changes
  useEffect(() => {
    const memoryScore = metrics.gameScores.find((g) => g.game === "memory")?.score || 0
    const attentionScore = metrics.gameScores.find((g) => g.game === "attention")?.score || 0
    const processingScore = metrics.gameScores.find((g) => g.game === "processing")?.score || 0

    const animateScore = (target: number, current: number, setter: (value: number) => void) => {
      const diff = target - current
      const step = diff / 20
      let currentValue = current

      const interval = setInterval(() => {
        currentValue += step
        if ((step > 0 && currentValue >= target) || (step < 0 && currentValue <= target)) {
          currentValue = target
          clearInterval(interval)
        }
        setter(Math.round(currentValue))
      }, 50)
    }

    animateScore(metrics.overallScore, animatedScores.overall, (value) =>
      setAnimatedScores((prev) => ({ ...prev, overall: value })),
    )
    animateScore(memoryScore, animatedScores.memory, (value) =>
      setAnimatedScores((prev) => ({ ...prev, memory: value })),
    )
    animateScore(attentionScore, animatedScores.attention, (value) =>
      setAnimatedScores((prev) => ({ ...prev, attention: value })),
    )
    animateScore(processingScore, animatedScores.processing, (value) =>
      setAnimatedScores((prev) => ({ ...prev, processing: value })),
    )
  }, [metrics.overallScore, metrics.gameScores])

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "from-emerald-500 to-green-500"
    if (score >= 60) return "from-yellow-500 to-orange-500"
    return "from-red-500 to-pink-500"
  }

  const getScoreStatus = (score: number) => {
    if (score >= 80) return { text: "Excellent", icon: CheckCircle, color: "text-emerald-400" }
    if (score >= 60) return { text: "Good", icon: Target, color: "text-yellow-400" }
    return { text: "Needs Attention", icon: AlertCircle, color: "text-red-400" }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 backdrop-blur-xl shadow-2xl">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="mr-3 h-6 w-6 text-blue-400" />
              Real-Time Assessment Dashboard
            </div>
            <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 px-3 py-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse" />
              Live Monitoring
            </Badge>
          </CardTitle>
          <CardDescription className="text-gray-300">
            Real-time cognitive performance tracking powered by Mano Veda AI
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Overall Score */}
            <div className="text-center space-y-3">
              <div className="relative">
                <div className="w-24 h-24 mx-auto">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="transparent" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#gradient-overall)"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${(animatedScores.overall / 100) * 251.2} 251.2`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="gradient-overall" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{animatedScores.overall}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-white font-semibold">Overall Score</div>
                <div className="text-gray-400 text-sm">{metrics.riskLevel} Risk</div>
              </div>
            </div>

            {/* Session Duration */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{formatDuration(metrics.sessionDuration)}</div>
                <div className="text-gray-400 text-sm">Session Time</div>
              </div>
            </div>

            {/* Completed Tasks */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{metrics.completedTasks.length}/12</div>
                <div className="text-gray-400 text-sm">Tasks Complete</div>
              </div>
            </div>

            {/* Focus Level */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                <Target className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{metrics.biometrics.focusLevel}%</div>
                <div className="text-gray-400 text-sm">Focus Level</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Biometric Monitoring */}
      <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 backdrop-blur-xl shadow-2xl">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="text-white flex items-center">
            <Heart className="mr-3 h-6 w-6 text-red-400" />
            Biometric Monitoring
          </CardTitle>
          <CardDescription className="text-gray-300">Real-time physiological indicators</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-medium flex items-center">
                  <Heart className="mr-2 h-4 w-4 text-red-400" />
                  Heart Rate
                </span>
                <span className="text-white font-bold">{metrics.biometrics.heartRate} BPM</span>
              </div>
              <Progress value={(metrics.biometrics.heartRate / 120) * 100} className="h-3" />
              <p className="text-xs text-gray-400">Normal range: 60-100 BPM</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-medium flex items-center">
                  <AlertCircle className="mr-2 h-4 w-4 text-orange-400" />
                  Stress Level
                </span>
                <span className="text-white font-bold">{metrics.biometrics.stressLevel}%</span>
              </div>
              <Progress value={metrics.biometrics.stressLevel} className="h-3" />
              <p className="text-xs text-gray-400">Lower is better</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-medium flex items-center">
                  <Target className="mr-2 h-4 w-4 text-blue-400" />
                  Focus Level
                </span>
                <span className="text-white font-bold">{metrics.biometrics.focusLevel}%</span>
              </div>
              <Progress value={metrics.biometrics.focusLevel} className="h-3" />
              <p className="text-xs text-gray-400">Higher is better</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 backdrop-blur-xl shadow-2xl">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="mr-3 h-6 w-6 text-green-400" />
            Performance Insights
          </CardTitle>
          <CardDescription className="text-gray-300">AI-powered analysis of your cognitive performance</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Voice Analysis */}
            {metrics.voiceAnalysis.clarity > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 font-medium flex items-center">
                    <Mic className="mr-2 h-4 w-4 text-purple-400" />
                    Voice Analysis
                  </span>
                  <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30">
                    AI Analyzed
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{metrics.voiceAnalysis.clarity}%</div>
                    <div className="text-xs text-gray-400">Clarity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{metrics.voiceAnalysis.fluency}%</div>
                    <div className="text-xs text-gray-400">Fluency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{metrics.voiceAnalysis.pace}%</div>
                    <div className="text-xs text-gray-400">Pace</div>
                  </div>
                </div>
              </div>
            )}

            {/* Game Scores */}
            {metrics.gameScores.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-white font-semibold flex items-center">
                  <BarChart3 className="mr-2 h-4 w-4 text-blue-400" />
                  Cognitive Domain Scores
                </h4>
                <div className="space-y-3">
                  {metrics.gameScores.map((game, index) => {
                    const percentage = Math.round((game.score / game.maxScore) * 100)
                    const status = getScoreStatus(percentage)
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 capitalize">{game.game.replace(/-/g, " ")} Assessment</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-bold">
                              {game.score}/{game.maxScore}
                            </span>
                            <status.icon className={`h-4 w-4 ${status.color}`} />
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2" />
                        <div className="text-xs text-gray-400 text-right">{status.text}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* AI Recommendations */}
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 rounded-2xl border border-blue-500/20">
              <h4 className="text-blue-300 font-semibold mb-3 flex items-center">
                <Sparkles className="mr-2 h-4 w-4" />
                Mano Veda AI Insights
              </h4>
              <div className="space-y-2 text-blue-200 text-sm">
                {metrics.overallScore >= 80 ? (
                  <>
                    <p>• Excellent cognitive performance across all domains</p>
                    <p>• Continue current lifestyle and cognitive activities</p>
                    <p>• Consider advanced cognitive challenges for continued growth</p>
                  </>
                ) : metrics.overallScore >= 60 ? (
                  <>
                    <p>• Good cognitive performance with room for improvement</p>
                    <p>• Focus on areas showing lower scores</p>
                    <p>• Regular cognitive exercises recommended</p>
                  </>
                ) : (
                  <>
                    <p>• Some cognitive areas may benefit from attention</p>
                    <p>• Consider consulting with healthcare provider</p>
                    <p>• Implement targeted cognitive training program</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assessment Timeline */}
      <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 backdrop-blur-xl shadow-2xl">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="text-white flex items-center">
            <Clock className="mr-3 h-6 w-6 text-cyan-400" />
            Assessment Timeline
          </CardTitle>
          <CardDescription className="text-gray-300">Progress through cognitive assessment stages</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-4">
            {[
              { name: "voice-analysis", title: "Voice Analysis", icon: Mic },
              { name: "memory-matching", title: "Memory Matching", icon: Brain },
              { name: "attention-focus", title: "Attention Focus", icon: Target },
              { name: "processing-speed", title: "Processing Speed", icon: Zap },
              { name: "spatial-reasoning", title: "Spatial Reasoning", icon: Eye },
            ].map((task, index) => {
              const isCompleted = metrics.completedTasks.includes(task.name)
              const isCurrent = index === metrics.currentStep - 1
              return (
                <div key={task.name} className="flex items-center space-x-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? "bg-gradient-to-r from-emerald-500 to-green-500"
                        : isCurrent
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"
                          : "bg-gray-700"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-white" />
                    ) : (
                      <task.icon className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium ${isCompleted ? "text-emerald-300" : "text-gray-300"}`}>
                      {task.title}
                    </div>
                    <div className="text-xs text-gray-400">
                      {isCompleted ? "Completed" : isCurrent ? "In Progress" : "Pending"}
                    </div>
                  </div>
                  {isCompleted && (
                    <Badge className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-500/30">
                      ✓ Done
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
