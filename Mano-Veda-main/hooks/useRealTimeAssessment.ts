"use client"

import { useState, useEffect, useCallback } from "react"

interface GameScore {
  game: string
  score: number
  maxScore: number
  timestamp: number
}

interface AssessmentMetrics {
  currentStep: number
  completedTasks: string[]
  sessionDuration: number
  overallScore: number
  riskLevel: string
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
  actualProgress: number
}

interface SessionStatus {
  isNewSession: boolean
  canResume: boolean
  completionPercentage: number
}

export function useRealTimeAssessment(userId = "demo-user") {
  const [metrics, setMetrics] = useState<AssessmentMetrics>({
    currentStep: 0,
    completedTasks: [],
    sessionDuration: 0,
    overallScore: 0,
    riskLevel: "Low",
    gameScores: [],
    voiceAnalysis: {
      clarity: 0,
      fluency: 0,
      pace: 0,
    },
    biometrics: {
      heartRate: 72,
      stressLevel: 25,
      focusLevel: 85,
    },
    actualProgress: 0,
  })

  const [isRecording, setIsRecording] = useState(false)
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null)

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem(`assessment_${userId}`)
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setMetrics(parsed)
        if (parsed.sessionDuration > 0) {
          setSessionStartTime(Date.now() - parsed.sessionDuration * 1000)
        }
      } catch (error) {
        console.error("Error loading saved assessment data:", error)
      }
    }
  }, [userId])

  // Save data whenever metrics change
  useEffect(() => {
    localStorage.setItem(`assessment_${userId}`, JSON.stringify(metrics))
  }, [metrics, userId])

  // Update session duration
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (sessionStartTime) {
      interval = setInterval(() => {
        const duration = Math.floor((Date.now() - sessionStartTime) / 1000)
        setMetrics((prev) => ({ ...prev, sessionDuration: duration }))
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [sessionStartTime])

  // Simulate biometric updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        biometrics: {
          heartRate: 65 + Math.floor(Math.random() * 20),
          stressLevel: Math.max(10, Math.min(90, prev.biometrics.stressLevel + (Math.random() - 0.5) * 10)),
          focusLevel: Math.max(60, Math.min(100, prev.biometrics.focusLevel + (Math.random() - 0.5) * 8)),
        },
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const updateCurrentStep = useCallback(
    (step: number) => {
      if (!sessionStartTime) {
        setSessionStartTime(Date.now())
      }

      setMetrics((prev) => {
        const progress = Math.round(((step + 1) / 14) * 100) // 14 total steps
        return {
          ...prev,
          currentStep: step,
          actualProgress: progress,
        }
      })
    },
    [sessionStartTime],
  )

  const recordGameScore = useCallback((game: string, score: number, maxScore: number) => {
    const gameScore: GameScore = {
      game,
      score,
      maxScore,
      timestamp: Date.now(),
    }

    setMetrics((prev) => {
      const existingIndex = prev.gameScores.findIndex((gs) => gs.game === game)
      let newGameScores: GameScore[]

      if (existingIndex >= 0) {
        newGameScores = [...prev.gameScores]
        newGameScores[existingIndex] = gameScore
      } else {
        newGameScores = [...prev.gameScores, gameScore]
      }

      // Calculate overall score
      const totalScore = newGameScores.reduce((sum, gs) => sum + (gs.score / gs.maxScore) * 100, 0)
      const averageScore = newGameScores.length > 0 ? totalScore / newGameScores.length : 0

      // Determine risk level
      let riskLevel = "Low"
      if (averageScore < 40) riskLevel = "High"
      else if (averageScore < 70) riskLevel = "Moderate"

      // Add to completed tasks
      const newCompletedTasks = [...prev.completedTasks]
      if (!newCompletedTasks.includes(game)) {
        newCompletedTasks.push(game)
      }

      return {
        ...prev,
        gameScores: newGameScores,
        overallScore: Math.round(averageScore),
        riskLevel,
        completedTasks: newCompletedTasks,
      }
    })
  }, [])

  const completeTask = useCallback((taskName: string) => {
    setMetrics((prev) => {
      if (!prev.completedTasks.includes(taskName)) {
        return {
          ...prev,
          completedTasks: [...prev.completedTasks, taskName],
        }
      }
      return prev
    })
  }, [])

  const startVoiceRecording = useCallback(() => {
    setIsRecording(true)
    // Simulate voice analysis updates
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        voiceAnalysis: {
          clarity: Math.min(100, prev.voiceAnalysis.clarity + Math.random() * 5),
          fluency: Math.min(100, prev.voiceAnalysis.fluency + Math.random() * 4),
          pace: Math.min(100, prev.voiceAnalysis.pace + Math.random() * 3),
        },
      }))
    }, 1000)

    // Store interval ID for cleanup
    ;(window as any).voiceAnalysisInterval = interval
  }, [])

  const stopVoiceRecording = useCallback(() => {
    setIsRecording(false)
    if ((window as any).voiceAnalysisInterval) {
      clearInterval((window as any).voiceAnalysisInterval)
      delete (window as any).voiceAnalysisInterval
    }
  }, [])

  const getSessionStatus = useCallback((): SessionStatus => {
    const hasProgress = metrics.completedTasks.length > 0 || metrics.sessionDuration > 0
    const completionPercentage = Math.round((metrics.completedTasks.length / 12) * 100) // 12 main tasks

    return {
      isNewSession: !hasProgress,
      canResume: hasProgress && completionPercentage < 100,
      completionPercentage,
    }
  }, [metrics.completedTasks.length, metrics.sessionDuration])

  const resetSession = useCallback(() => {
    const initialMetrics: AssessmentMetrics = {
      currentStep: 0,
      completedTasks: [],
      sessionDuration: 0,
      overallScore: 0,
      riskLevel: "Low",
      gameScores: [],
      voiceAnalysis: {
        clarity: 0,
        fluency: 0,
        pace: 0,
      },
      biometrics: {
        heartRate: 72,
        stressLevel: 25,
        focusLevel: 85,
      },
      actualProgress: 0,
    }

    setMetrics(initialMetrics)
    setSessionStartTime(null)
    setIsRecording(false)

    // Clear localStorage
    localStorage.removeItem(`assessment_${userId}`)

    // Clear any running intervals
    if ((window as any).voiceAnalysisInterval) {
      clearInterval((window as any).voiceAnalysisInterval)
      delete (window as any).voiceAnalysisInterval
    }
  }, [userId])

  return {
    metrics,
    isRecording,
    updateCurrentStep,
    recordGameScore,
    completeTask,
    startVoiceRecording,
    stopVoiceRecording,
    getSessionStatus,
    resetSession,
  }
}
