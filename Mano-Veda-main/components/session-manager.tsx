"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Play, RotateCcw, Clock, CheckCircle, AlertCircle, Sparkles, Activity } from "lucide-react"
import { useRealTimeAssessment } from "@/hooks/useRealTimeAssessment"

interface SessionManagerProps {
  userId?: string
  onStartAssessment: (resumeStep?: number) => void
  onResetSession: () => void
  currentStep?: number
}

export function SessionManager({
  userId = "demo-user",
  onStartAssessment,
  onResetSession,
  currentStep = 0,
}: SessionManagerProps) {
  const { metrics, getSessionStatus, resetSession } = useRealTimeAssessment(userId)
  const [sessionStatus, setSessionStatus] = useState({
    isNewSession: true,
    canResume: false,
    completionPercentage: 0,
  })

  useEffect(() => {
    setSessionStatus(getSessionStatus())
  }, [getSessionStatus])

  const handleStartNew = () => {
    resetSession()
    onResetSession()
    onStartAssessment(0)
  }

  const handleResume = () => {
    onStartAssessment(metrics.currentStep)
  }

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getStatusColor = () => {
    if (sessionStatus.completionPercentage === 0) return "gray"
    if (sessionStatus.completionPercentage < 30) return "red"
    if (sessionStatus.completionPercentage < 70) return "yellow"
    return "emerald"
  }

  const getStatusIcon = () => {
    if (sessionStatus.completionPercentage === 0) return <Brain className="h-5 w-5" />
    if (sessionStatus.completionPercentage < 100) return <Activity className="h-5 w-5" />
    return <CheckCircle className="h-5 w-5" />
  }

  const getStatusText = () => {
    if (sessionStatus.completionPercentage === 0) return "Ready to Start"
    if (sessionStatus.completionPercentage < 100) return "In Progress"
    return "Completed"
  }

  return (
    <div className="space-y-6">
      {/* Session Status Card */}
      <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 backdrop-blur-xl shadow-2xl">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="mr-3 h-6 w-6 text-blue-400" />
              Assessment Session Status
            </div>
            <Badge
              className={`bg-gradient-to-r from-${getStatusColor()}-500/20 to-${getStatusColor()}-600/20 text-${getStatusColor()}-300 border border-${getStatusColor()}-500/30 px-3 py-1`}
            >
              {getStatusIcon()}
              <span className="ml-2">{getStatusText()}</span>
            </Badge>
          </CardTitle>
          <CardDescription className="text-gray-300">
            {sessionStatus.isNewSession
              ? "Start your comprehensive cognitive health assessment"
              : "Continue your assessment from where you left off"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-medium">Progress</span>
                <span className="text-white font-bold">{sessionStatus.completionPercentage}%</span>
              </div>
              <Progress value={sessionStatus.completionPercentage} className="h-3" />
              <p className="text-xs text-gray-400">{metrics.completedTasks.length} of 12 tasks completed</p>
            </div>

            {/* Session Time */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-medium">Session Time</span>
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-white">{formatDuration(metrics.sessionDuration)}</div>
              <p className="text-xs text-gray-400">{metrics.sessionDuration > 0 ? "Active session" : "Not started"}</p>
            </div>

            {/* Overall Score */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-medium">Current Score</span>
                <Sparkles className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-white">{metrics.overallScore}/100</div>
              <p className="text-xs text-gray-400">{metrics.riskLevel} risk level</p>
            </div>
          </div>

          {/* Completed Tasks */}
          {metrics.completedTasks.length > 0 && (
            <div className="mb-8">
              <h4 className="text-white font-semibold mb-4 flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-emerald-400" />
                Completed Tasks ({metrics.completedTasks.length})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {metrics.completedTasks.map((task, index) => (
                  <Badge
                    key={index}
                    className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-2 justify-center"
                  >
                    <CheckCircle className="mr-1 h-3 w-3" />
                    {task.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {sessionStatus.canResume ? (
              <>
                <Button
                  onClick={handleResume}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg rounded-xl shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-500 transform hover:scale-105"
                >
                  <Play className="mr-3 h-5 w-5" />
                  Resume Assessment
                </Button>
                <Button
                  onClick={handleStartNew}
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-2 border-white/20 hover:border-white/40 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-xl"
                >
                  <RotateCcw className="mr-3 h-5 w-5" />
                  Start Over
                </Button>
              </>
            ) : (
              <Button
                onClick={() => onStartAssessment(0)}
                size="lg"
                className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-8 py-4 text-lg rounded-xl shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-500 transform hover:scale-105"
              >
                <Play className="mr-3 h-5 w-5" />
                Start Assessment
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <AlertCircle className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-blue-300 font-semibold mb-2">Assessment Information</h4>
              <ul className="text-blue-200 space-y-1 text-sm">
                <li>• Your progress is automatically saved and can be resumed anytime</li>
                <li>• The assessment takes approximately 15-20 minutes to complete</li>
                <li>• You can pause and return to continue where you left off</li>
                <li>• All data is stored locally and securely on your device</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
