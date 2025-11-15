"use client"
import { Badge } from "@/components/ui/badge"
import React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Brain,
  Mic,
  ArrowRight,
  ArrowLeft,
  Timer,
  Target,
  Zap,
  Eye,
  Calculator,
  BookOpen,
  Puzzle,
  BarChart3,
  CheckCircle,
  Sparkles,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  X,
} from "lucide-react"
import Link from "next/link"
import { useRealTimeAssessment } from "@/hooks/useRealTimeAssessment"
import { RealTimeDashboard } from "@/components/real-time-dashboard"
import { SessionManager } from "@/components/session-manager"
import { MannuAssistant } from "@/components/ai-assistant-mannu"
import { useRouter } from "next/navigation"
import { assessmentQuestions } from "@/lib/assessment-data"

interface AssessmentResponse {
  questionId: string
  answer: string
  timeSpent: number
}

export default function AssessmentPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<AssessmentResponse[]>([])
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showSessionManager, setShowSessionManager] = useState(true)
  const [recordingTime, setRecordingTime] = useState(0)
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; size: number; opacity: number }>
  >([])
  const [gameScores, setGameScores] = useState({
    memory: 0,
    attention: 0,
    processing: 0,
    spatial: 0,
    working: 0,
    sequence: 0,
    recall: 0,
    trail: 0,
    clock: 0,
    verbal: 0,
    mmse: 0,
  })

  // Patient info validation
  const [hasPatientInfo, setHasPatientInfo] = useState(false)

  // Memory Game State
  const [memoryCards, setMemoryCards] = useState([
    { id: 1, content: "🍎", matched: false, flipped: false },
    { id: 2, content: "🍎", matched: false, flipped: false },
    { id: 3, content: "🌟", matched: false, flipped: false },
    { id: 4, content: "🌟", matched: false, flipped: false },
    { id: 5, content: "🎵", matched: false, flipped: false },
    { id: 6, content: "🎵", matched: false, flipped: false },
    { id: 7, content: "🌸", matched: false, flipped: false },
    { id: 8, content: "🌸", matched: false, flipped: false },
  ])
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [memoryGameCompleted, setMemoryGameCompleted] = useState(false)
  const [memoryAttempts, setMemoryAttempts] = useState(0)

  // Attention Game State
  const [attentionTarget, setAttentionTarget] = useState({ x: 50, y: 50 })
  const [attentionScore, setAttentionScore] = useState(0)
  const [attentionTime, setAttentionTime] = useState(30)
  const [attentionGameCompleted, setAttentionGameCompleted] = useState(false)
  const [attentionHits, setAttentionHits] = useState(0)

  // Processing Speed Game State
  const [currentSymbol, setCurrentSymbol] = useState("◆")
  const [targetSymbol, setTargetSymbol] = useState("◆")
  const [processingScore, setProcessingScore] = useState(0)
  const [processingTime, setProcessingTime] = useState(60)
  const [processingGameCompleted, setProcessingGameCompleted] = useState(false)
  const [processingCorrect, setProcessingCorrect] = useState(0)
  const [processingTotal, setProcessingTotal] = useState(0)

  // Spatial Game State
  const [spatialPattern, setSpatialPattern] = useState([1, 3, 5, 7])
  const [spatialUserPattern, setSpatialUserPattern] = useState<number[]>([])
  const [showSpatialPattern, setShowSpatialPattern] = useState(true)
  const [spatialTimer, setSpatialTimer] = useState(5)
  const [spatialCompleted, setSpatialCompleted] = useState(false)

  // Working Memory State
  const [workingMemorySequence] = useState([7, 3, 9, 2, 8])
  const [workingMemoryInput, setWorkingMemoryInput] = useState(["", "", "", "", ""])
  const [showWorkingMemorySequence, setShowWorkingMemorySequence] = useState(true)
  const [workingMemoryTimer, setWorkingMemoryTimer] = useState(30)
  const [workingMemoryCompleted, setWorkingMemoryCompleted] = useState(false)

  // Number Sequence State
  const [numberSequence] = useState([2, 4, 8, 16])
  const [numberSequenceAnswer, setNumberSequenceAnswer] = useState("")
  const [numberSequenceCompleted, setNumberSequenceCompleted] = useState(false)

  // Word Recall State
  const [wordRecallWords] = useState(["OCEAN", "GUITAR", "MOUNTAIN", "BUTTERFLY", "TELESCOPE"])
  const [showWordRecallWords, setShowWordRecallWords] = useState(true)
  const [wordRecallTimer, setWordRecallTimer] = useState(30)
  const [wordRecallInput, setWordRecallInput] = useState("")
  const [wordRecallCompleted, setWordRecallCompleted] = useState(false)

  // Trail Making State
  const [trailNumbers] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  const [trailCurrentNumber, setTrailCurrentNumber] = useState(1)
  const [trailStartTime, setTrailStartTime] = useState<number | null>(null)
  const [trailCompleted, setTrailCompleted] = useState(false)
  const [trailErrors, setTrailErrors] = useState(0)

  // Clock Drawing State
  const [clockDrawingCompleted, setClockDrawingCompleted] = useState(false)
  const [clockDrawingPath, setClockDrawingPath] = useState<Array<{ x: number; y: number }>>([])
  const [isDrawing, setIsDrawing] = useState(false)

  // Verbal Fluency State
  const [verbalFluencyInput, setVerbalFluencyInput] = useState("")
  const [verbalFluencyTime, setVerbalFluencyTime] = useState(60)
  const [verbalFluencyStarted, setVerbalFluencyStarted] = useState(false)
  const [verbalFluencyCompleted, setVerbalFluencyCompleted] = useState(false)

  // MMSE Test State
  const [mmseQuestions] = useState([
    { question: "What year is it?", answer: new Date().getFullYear().toString(), points: 1 },
    { question: "What season is it?", answer: "", points: 1 },
    { question: "What month is it?", answer: "", points: 1 },
    { question: "What is today's date?", answer: new Date().getDate().toString(), points: 1 },
    { question: "What day of the week is it?", answer: "", points: 1 },
    { question: "What country are we in?", answer: "", points: 1 },
    { question: "What state/province are we in?", answer: "", points: 1 },
    { question: "What city are we in?", answer: "", points: 1 },
    { question: "What floor are we on?", answer: "", points: 1 },
    { question: "What building are we in?", answer: "", points: 1 },
  ])
  const [mmseAnswers, setMmseAnswers] = useState<string[]>(new Array(10).fill(""))
  const [mmseCurrentQuestion, setMmseCurrentQuestion] = useState(0)
  const [mmseCompleted, setMmseCompleted] = useState(false)

  // Voice/audio upload state
  const [voiceRecordingCompleted, setVoiceRecordingCompleted] = useState(false)
  const [uploadedAudio, setUploadedAudio] = useState<File | null>(null)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [wavBlob, setWavBlob] = useState<Blob | null>(null)
  const [isConvertingAudio, setIsConvertingAudio] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)

  const steps = [
    {
      title: "Welcome",
      description: "Get started with your comprehensive assessment",
      icon: Brain,
      color: "from-blue-500 to-purple-500",
    },
    {
      title: "Voice Analysis",
      description: "Upload your audio for speech pattern analysis",
      icon: Mic,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Memory Matching",
      description: "Test your visual memory and recognition",
      icon: Eye,
      color: "from-pink-500 to-red-500",
    },
    {
      title: "Attention Focus",
      description: "Measure sustained attention and reaction time",
      icon: Target,
      color: "from-red-500 to-orange-500",
    },
    {
      title: "Processing Speed",
      description: "Assess cognitive processing efficiency",
      icon: Zap,
      color: "from-orange-500 to-yellow-500",
    },
    {
      title: "Spatial Reasoning",
      description: "Evaluate spatial memory and pattern recognition",
      icon: Puzzle,
      color: "from-yellow-500 to-green-500",
    },
    {
      title: "Working Memory",
      description: "Test short-term memory capacity",
      icon: BookOpen,
      color: "from-green-500 to-teal-500",
    },
    {
      title: "Number Sequence",
      description: "Assess logical reasoning and pattern detection",
      icon: Calculator,
      color: "from-teal-500 to-cyan-500",
    },
    {
      title: "Word Recall",
      description: "Evaluate verbal memory and recall ability",
      icon: BookOpen,
      color: "from-cyan-500 to-blue-500",
    },
    {
      title: "Trail Making",
      description: "Test visual attention and task switching",
      icon: Target,
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "Clock Reading",
      description: "Test time recognition and visuospatial skills",
      icon: Timer,
      color: "from-indigo-500 to-purple-500",
      
    },
    {
      title: "Verbal Fluency",
      description: "Measure language production and executive function",
      icon: BookOpen,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "MMSE Test",
      description: "Mini-Mental State Examination for cognitive screening",
      icon: Brain,
      color: "from-pink-500 to-red-500",
    },
    {
      title: "Results",
      description: "View your comprehensive cognitive assessment",
      icon: BarChart3,
      color: "from-red-500 to-orange-500",
    },
  ]

  const {
    metrics,
    recordGameScore,
    startVoiceRecording,
    stopVoiceRecording,
    updateCurrentStep,
    completeTask,
    isRecording,
  } = useRealTimeAssessment()

  useEffect(() => {
    setStartTime(Date.now())
  }, [currentQuestion])

  const handleAnswerChange = (value: string) => {
    setCurrentAnswer(value)
  }

  const handleNext = () => {
    if (!currentAnswer.trim()) return

    const timeSpent = Date.now() - startTime
    const newResponse: AssessmentResponse = {
      questionId: assessmentQuestions[currentQuestion].id,
      answer: currentAnswer,
      timeSpent,
    }

    const updatedResponses = [...responses]
    const existingIndex = updatedResponses.findIndex((r) => r.questionId === newResponse.questionId)

    if (existingIndex >= 0) {
      updatedResponses[existingIndex] = newResponse
    } else {
      updatedResponses.push(newResponse)
    }

    setResponses(updatedResponses)

    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setCurrentAnswer("")
    } else {
      handleSubmit(updatedResponses)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      const previousResponse = responses.find((r) => r.questionId === assessmentQuestions[currentQuestion - 1].id)
      setCurrentAnswer(previousResponse?.answer || "")
    }
  }

  const handleSubmit = async (finalResponses: AssessmentResponse[]) => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Store results in localStorage for demo purposes
      localStorage.setItem(
        "assessmentResults",
        JSON.stringify({
          responses: finalResponses,
          completedAt: new Date().toISOString(),
          totalQuestions: assessmentQuestions.length,
        }),
      )

      router.push("/results")
    } catch (error) {
      console.error("Error submitting assessment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    // Check if patient info exists
    const patientInfo = localStorage.getItem("patientInfo")
    setHasPatientInfo(!!patientInfo)

    // Generate floating particles
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.3 + 0.1,
    }))
    setParticles(newParticles)
  }, [])

  useEffect(() => {
    updateCurrentStep(currentStep)
  }, [currentStep, updateCurrentStep])

  // Recording timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (interval) {
        clearInterval(interval)
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isRecording])

  // Game timers and logic
  useEffect(() => {
    if (currentStep === 6 && showWorkingMemorySequence && workingMemoryTimer > 0) {
      const timer = setTimeout(() => setWorkingMemoryTimer(workingMemoryTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else if (workingMemoryTimer === 0 && showWorkingMemorySequence) {
      setShowWorkingMemorySequence(false)
    }
  }, [workingMemoryTimer, currentStep, showWorkingMemorySequence])

  useEffect(() => {
    if (currentStep === 8 && showWordRecallWords && wordRecallTimer > 0) {
      const timer = setTimeout(() => setWordRecallTimer(wordRecallTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else if (wordRecallTimer === 0 && showWordRecallWords) {
      setShowWordRecallWords(false)
    }
  }, [wordRecallTimer, currentStep, showWordRecallWords])

  useEffect(() => {
    if (currentStep === 5 && showSpatialPattern && spatialTimer > 0) {
      const timer = setTimeout(() => setSpatialTimer(spatialTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else if (spatialTimer === 0 && showSpatialPattern) {
      setShowSpatialPattern(false)
    }
  }, [spatialTimer, currentStep, showSpatialPattern])

  useEffect(() => {
    if (attentionTime > 0 && currentStep === 3 && !attentionGameCompleted) {
      const timer = setTimeout(() => setAttentionTime(attentionTime - 1), 1000)
      return () => clearTimeout(timer)
    } else if (attentionTime === 0 && !attentionGameCompleted) {
      setAttentionGameCompleted(true)
      const accuracy = attentionHits > 0 ? attentionScore / attentionHits : 0
      const finalScore = Math.min(Math.round(attentionScore + accuracy * 10), 100)
      setGameScores((prev) => ({ ...prev, attention: finalScore }))
      recordGameScore("attention", finalScore, 100)
    }
  }, [attentionTime, currentStep, attentionGameCompleted, attentionScore, attentionHits, recordGameScore])

  useEffect(() => {
    if (processingTime > 0 && currentStep === 4 && !processingGameCompleted) {
      const timer = setTimeout(() => setProcessingTime(processingTime - 1), 1000)
      return () => clearTimeout(timer)
    } else if (processingTime === 0 && !processingGameCompleted) {
      setProcessingGameCompleted(true)
      const accuracy = processingTotal > 0 ? (processingCorrect / processingTotal) * 100 : 0
      const finalScore = Math.min(Math.round(accuracy + processingCorrect * 2), 100)
      setGameScores((prev) => ({ ...prev, processing: finalScore }))
      recordGameScore("processing", finalScore, 100)
    }
  }, [processingTime, currentStep, processingGameCompleted, processingCorrect, processingTotal, recordGameScore])

  useEffect(() => {
    if (verbalFluencyTime > 0 && verbalFluencyStarted && !verbalFluencyCompleted) {
      const timer = setTimeout(() => setVerbalFluencyTime(verbalFluencyTime - 1), 1000)
      return () => clearTimeout(timer)
    } else if (verbalFluencyTime === 0 && verbalFluencyStarted && !verbalFluencyCompleted) {
      setVerbalFluencyCompleted(true)
      const animals = verbalFluencyInput.split(",").filter((animal) => animal.trim().length > 0)
      const score = Math.min(animals.length * 4 + (animals.length > 15 ? 20 : 0), 100)
      setGameScores((prev) => ({ ...prev, verbal: score }))
      recordGameScore("verbal", score, 100)
    }
  }, [verbalFluencyTime, verbalFluencyStarted, verbalFluencyCompleted, verbalFluencyInput, recordGameScore])

  // Game handlers
  const handleMemoryCardClick = (cardId: number) => {
    if (memoryGameCompleted) return

    if (
      selectedCards.length < 2 &&
      !selectedCards.includes(cardId) &&
      !memoryCards.find((c) => c.id === cardId)?.matched
    ) {
      const newSelected = [...selectedCards, cardId]
      setSelectedCards(newSelected)

      setMemoryCards((prev) => prev.map((card) => (card.id === cardId ? { ...card, flipped: true } : card)))

      if (newSelected.length === 2) {
        setMemoryAttempts((prev) => prev + 1)
        const [first, second] = newSelected
        const firstCard = memoryCards.find((c) => c.id === first)
        const secondCard = memoryCards.find((c) => c.id === second)

        if (firstCard?.content === secondCard?.content) {
          setTimeout(() => {
            setMemoryCards((prev) =>
              prev.map((card) => (newSelected.includes(card.id) ? { ...card, matched: true } : card)),
            )
            const baseScore = 25
            const efficiencyBonus = Math.max(0, 15 - memoryAttempts)
            const newScore = gameScores.memory + baseScore + efficiencyBonus
            setGameScores((prev) => ({ ...prev, memory: Math.min(newScore, 100) }))
            setSelectedCards([])

            const updatedCards = memoryCards.map((card) =>
              newSelected.includes(card.id) ? { ...card, matched: true } : card,
            )
            if (updatedCards.every((card) => card.matched)) {
              setMemoryGameCompleted(true)
              recordGameScore("memory", Math.min(newScore, 100), 100)
            }
          }, 800)
        } else {
          setTimeout(() => {
            setMemoryCards((prev) =>
              prev.map((card) => (newSelected.includes(card.id) ? { ...card, flipped: false } : card)),
            )
            setSelectedCards([])
          }, 600)
        }
      }
    }
  }

  const handleAttentionClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (attentionGameCompleted) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    const distance = Math.sqrt(Math.pow(x - attentionTarget.x, 2) + Math.pow(y - attentionTarget.y, 2))
    if (distance < 10) {
      const accuracy = Math.max(0, 10 - distance)
      const points = Math.round(10 + accuracy)
      setAttentionScore((prev) => prev + points)
      setAttentionHits((prev) => prev + 1)
      setAttentionTarget({ x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 })
    }
  }

  const handleProcessingResponse = (isMatch: boolean) => {
    if (processingGameCompleted) return

    setProcessingTotal((prev) => prev + 1)
    const correct = (currentSymbol === targetSymbol) === isMatch
    if (correct) {
      setProcessingCorrect((prev) => prev + 1)
      const timeBonus = Math.max(0, Math.floor(processingTime / 10))
      const points = 5 + timeBonus
      setProcessingScore((prev) => prev + points)
    } else {
      setProcessingScore((prev) => Math.max(0, prev - 2))
    }

    const symbols = ["◆", "●", "▲", "■", "★"]
    setCurrentSymbol(symbols[Math.floor(Math.random() * symbols.length)])
  }

  const handleSpatialClick = (index: number) => {
    if (showSpatialPattern || spatialCompleted) return

    const newPattern = [...spatialUserPattern, index]
    setSpatialUserPattern(newPattern)

    if (newPattern.length === spatialPattern.length) {
      const isCorrect = JSON.stringify(newPattern) === JSON.stringify(spatialPattern)
      const score = isCorrect
        ? 100
        : Math.max(
            0,
            100 - (spatialPattern.length - newPattern.filter((val, i) => val === spatialPattern[i]).length) * 25,
          )
      setGameScores((prev) => ({ ...prev, spatial: score }))
      setSpatialCompleted(true)
      recordGameScore("spatial", score, 100)
    }
  }

  const handleTrailNumberClick = (number: number) => {
    if (trailCompleted) return

    if (!trailStartTime) {
      setTrailStartTime(Date.now())
    }

    if (number === trailCurrentNumber) {
      setTrailCurrentNumber(number + 1)
      if (number === 10) {
        const completionTime = Date.now() - (trailStartTime || Date.now())
        const timeScore = Math.max(0, 60 - Math.floor(completionTime / 1000))
        const errorPenalty = trailErrors * 10
        const score = Math.max(0, Math.min(100, timeScore + 40 - errorPenalty))
        setGameScores((prev) => ({ ...prev, trail: score }))
        setTrailCompleted(true)
        recordGameScore("trail", score, 100)
      }
    } else {
      setTrailErrors((prev) => prev + 1)
    }
  }

  const handleWorkingMemorySubmit = () => {
    const correctReverse = [8, 2, 9, 3, 7]
    const userInput = workingMemoryInput.map((val) => Number.parseInt(val)).filter((val) => !isNaN(val))
    const isCorrect = JSON.stringify(userInput) === JSON.stringify(correctReverse)

    let score = 0
    if (isCorrect) {
      score = 100
    } else {
      correctReverse.forEach((correct, index) => {
        if (userInput[index] === correct) {
          score += 20
        }
      })
    }

    setGameScores((prev) => ({ ...prev, working: score }))
    setWorkingMemoryCompleted(true)
    recordGameScore("working", score, 100)
  }

  const handleNumberSequenceSubmit = () => {
    const correctAnswer = 32 // Next number in sequence: 2, 4, 8, 16, 32
    const userAnswer = Number.parseInt(numberSequenceAnswer)
    const score = userAnswer === correctAnswer ? 100 : 0
    setGameScores((prev) => ({ ...prev, sequence: score }))
    setNumberSequenceCompleted(true)
    recordGameScore("sequence", score, 100)
  }

  const handleWordRecallSubmit = () => {
    const userWords = wordRecallInput
      .toLowerCase()
      .split(",")
      .map((w) => w.trim())
      .filter((w) => w.length > 0)
    const correctWords = wordRecallWords.map((w) => w.toLowerCase())
    const correctCount = userWords.filter((word) => correctWords.includes(word)).length

    let score = Math.round((correctCount / wordRecallWords.length) * 80)
    if (correctCount === wordRecallWords.length) {
      score = 100
    } else if (correctCount >= wordRecallWords.length * 0.8) {
      score += 10
    }

    setGameScores((prev) => ({ ...prev, recall: score }))
    setWordRecallCompleted(true)
    recordGameScore("recall", score, 100)
  }

  const handleClockDrawingSubmit = () => {
    // Simple scoring based on drawing complexity
    const score = Math.min(clockDrawingPath.length > 20 ? 100 : clockDrawingPath.length * 5, 100)
    setGameScores((prev) => ({ ...prev, clock: score }))
    setClockDrawingCompleted(true)
    recordGameScore("clock", score, 100)
  }

  const handleMmseAnswer = (questionIndex: number, answer: string) => {
    const newAnswers = [...mmseAnswers]
    newAnswers[questionIndex] = answer
    setMmseAnswers(newAnswers)
  }

  const handleMmseSubmit = () => {
    let score = 0
    mmseQuestions.forEach((q, index) => {
      const userAnswer = mmseAnswers[index].toLowerCase().trim()
      const correctAnswer = q.answer.toLowerCase().trim()

      if (index === 0) {
        if (userAnswer === correctAnswer) score += 1
      } else if (index === 1) {
        const seasons = ["spring", "summer", "fall", "autumn", "winter"]
        if (seasons.includes(userAnswer)) score += 1
      } else if (index === 2) {
        const months = [
          "january",
          "february",
          "march",
          "april",
          "may",
          "june",
          "july",
          "august",
          "september",
          "october",
          "november",
          "december",
        ]
        if (months.includes(userAnswer)) score += 1
      } else if (index === 3) {
        if (userAnswer === correctAnswer) score += 1
      } else if (index === 4) {
        const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
        if (days.includes(userAnswer)) score += 1
      } else {
        if (userAnswer.length > 0) score += 1
      }
    })

    const finalScore = (score / 10) * 100
    setGameScores((prev) => ({ ...prev, mmse: finalScore }))
    setMmseCompleted(true)
    recordGameScore("mmse", finalScore, 100)
  }

  const startVerbalFluency = () => {
    setVerbalFluencyStarted(true)
  }

  const nextStep = async () => {
    if (!canProceedToNextStep()) {
      return
    }

    // If on Voice Analysis step (index 1), fire background analysis if WAV exists
    if (currentStep === 1 && wavBlob) {
      try {
        const form = new FormData()
        if (uploadedAudio) form.append('original', uploadedAudio)
        form.append('wav', wavBlob, 'audio.wav')

        // Non-blocking fire-and-forget: do not await navigation; run promise in background
        ;(async () => {
          try {
            const res = await fetch('/api/voice/analyze', { method: 'POST', body: form })
            if (res.ok) {
              const data = await res.json()
              // Merge into assessmentResults in localStorage
              const stored = localStorage.getItem('assessmentResults')
              const base = stored ? JSON.parse(stored) : {}
              const updated = {
                ...base,
                voiceAnalysis: {
                  label: data.label,
                  confidence: data.confidence,
                  clarity: data.clarity,
                  fluency: data.fluency,
                  pace: data.pace,
                  featuresSummary: data.featuresSummary,
                },
              }
              localStorage.setItem('assessmentResults', JSON.stringify(updated))
            }
          } catch (e) {
            console.error('Background voice analysis failed', e)
          }
        })()
      } catch (e) {
        console.error('Error preparing voice analysis request', e)
      }
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 0:
        return hasPatientInfo
      case 1:
        // Either successful upload+conversion OR legacy recording flow reaching 10s
        return voiceRecordingCompleted && (!!wavBlob || recordingTime >= 10)
      case 2:
        return memoryGameCompleted
      case 3:
        return attentionGameCompleted
      case 4:
        return processingGameCompleted
      case 5:
        return spatialCompleted
      case 6:
        return workingMemoryCompleted
      case 7:
        return numberSequenceCompleted
      case 8:
        return wordRecallCompleted
      case 9:
        return trailCompleted
      case 10:
        return clockDrawingCompleted
      case 11:
        return verbalFluencyCompleted
      case 12:
        return mmseCompleted
      default:
        return true
    }
  }

  const handleRecordingToggle = () => {
    if (isRecording) {
      stopVoiceRecording()
      if (recordingTime >= 10) {
        setVoiceRecordingCompleted(true)
      }
    } else {
      setRecordingTime(0)
      startVoiceRecording()
    }
  }

  const handleStartAssessment = (resumeStep = 0) => {
    setCurrentStep(resumeStep)
    setShowSessionManager(false)
  }

  const handleResetSession = () => {
    setCurrentStep(0)
    setGameScores({
      memory: 0,
      attention: 0,
      processing: 0,
      spatial: 0,
      working: 0,
      sequence: 0,
      recall: 0,
      trail: 0,
      clock: 0,
      verbal: 0,
      mmse: 0,
    })
    // Reset all game states
  const emojis = ["🍎", "🌟", "🎵", "🌸", "🐱", "🚀", "🍕", "⚽"];

const generateCards = () => {
  return [...emojis, ...emojis] // duplicate the set
    .map((content, index) => ({
      id: index + 1,
      content,
      matched: false,
      flipped: false
    }))
    .sort(() => Math.random() - 0.5); // shuffle
};

// In your React component:
setMemoryCards(generateCards());


    setSelectedCards([])
    setMemoryGameCompleted(false)
    setMemoryAttempts(0)
    setAttentionScore(0)
    setAttentionTime(30)
    setAttentionGameCompleted(false)
    setAttentionHits(0)
    setProcessingScore(0)
    setProcessingTime(60)
    setProcessingGameCompleted(false)
    setProcessingCorrect(0)
    setProcessingTotal(0)
    setSpatialUserPattern([])
    setShowSpatialPattern(true)
    setSpatialTimer(5)
    setSpatialCompleted(false)
    setWorkingMemoryInput(["", "", "", "", ""])
    setShowWorkingMemorySequence(true)
    setWorkingMemoryTimer(30)
    setWorkingMemoryCompleted(false)
    setNumberSequenceAnswer("")
    setNumberSequenceCompleted(false)
    setShowWordRecallWords(true)
    setWordRecallTimer(30)
    setWordRecallInput("")
    setWordRecallCompleted(false)
    setTrailCurrentNumber(1)
    setTrailStartTime(null)
    setTrailCompleted(false)
    setTrailErrors(0)
    setClockDrawingPath([])
    setClockDrawingCompleted(false)
    setIsDrawing(false)
    setVerbalFluencyInput("")
    setVerbalFluencyTime(60)
    setVerbalFluencyStarted(false)
    setVerbalFluencyCompleted(false)
    setMmseAnswers(new Array(10).fill(""))
    setMmseCurrentQuestion(0)
    setMmseCompleted(false)
    setRecordingTime(0)
    setVoiceRecordingCompleted(false)
  }

  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100
  const question = assessmentQuestions[currentQuestion]

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-8 sm:space-y-12 px-4">
            {!hasPatientInfo && (
              <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 backdrop-blur-xl max-w-3xl mx-auto">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="text-red-300 font-bold text-lg sm:text-xl mb-3 flex items-center justify-center">
                    <AlertCircle className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                    Patient Information Required
                  </div>
                  <p className="text-red-400 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                    Please complete the patient information form before starting the assessment.
                  </p>
                  <Link href="/patient-info">
                    <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 px-6 sm:px-8 py-3 text-base sm:text-lg rounded-xl btn-mobile w-full sm:w-auto">
                      Complete Patient Info
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {hasPatientInfo && (
              <>
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-purple-500/25 animate-pulse">
                    <Brain className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full flex items-center justify-center animate-bounce">
                    <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>

                <div className="px-4">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-6xl font-black text-white mb-4 sm:mb-6 lg:mb-8 leading-tight">
                    Comprehensive Cognitive
                    <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Assessment
                    </span>
                  </h2>
                  <p className="text-sm sm:text-base lg:text-lg xl:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
                    This scientifically-validated assessment combines AI-powered voice analysis with multiple cognitive
                    games to evaluate your brain health across 8 key domains including MMSE screening.
                    <span className="block mt-2 sm:mt-4 text-purple-400 text-xs sm:text-sm lg:text-base xl:text-lg">✨ Powered by Mano Veda AI</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto px-4">
                  {[
                    {
                      icon: Mic,
                      title: "Voice Analysis",
                      desc: "Speech pattern & fluency assessment with Mano Veda AI",
                      color: "from-blue-500 to-cyan-500",
                    },
                    {
                      icon: Puzzle,
                      title: "Cognitive Games",
                      desc: "8 validated cognitive assessments",
                      color: "from-purple-500 to-pink-500",
                    },
                    {
                      icon: Brain,
                      title: "AI Analysis + MMSE",
                      desc: "Comprehensive risk assessment with MMSE",
                      color: "from-emerald-500 to-green-500",
                    },
                  ].map((item, index) => (
                    <Card
                      key={index}
                      className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all duration-500 hover:scale-105 group card-mobile"
                    >
                      <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
                        <div
                          className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${item.color} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}
                        >
                          <item.icon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                        </div>
                        <h3 className="font-bold text-white mb-2 sm:mb-3 text-base sm:text-lg lg:text-xl leading-tight">{item.title}</h3>
                        <p className="text-gray-400 text-xs sm:text-sm lg:text-base leading-relaxed">{item.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 backdrop-blur-xl max-w-3xl mx-auto">
                  <CardContent className="p-8">
                    <h3 className="font-bold text-amber-300 mb-6 text-2xl flex items-center justify-center">
                      <Timer className="mr-3 h-6 w-6" />
                      Assessment Duration: 20-25 minutes
                    </h3>
                    <div className="grid grid-cols-2 gap-6 text-amber-200">
                      {[
                        "✓ Voice recording (3 min)",
                        "✓ Memory games (4 min)",
                        "✓ Attention tests (3 min)",
                        "✓ Processing speed (2 min)",
                        "✓ Spatial reasoning (2 min)",
                        "✓ MMSE screening (5 min)",
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <div className="mt-16">
                  <RealTimeDashboard userId="demo-user" />
                </div>
              </>
            )}
          </div>
        )

      case 1:
        return (
          <div className="text-center space-y-6 sm:space-y-8 px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <Mic className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white leading-tight">Voice Analysis</h2>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Upload an audio file (any common format). We'll convert it to WAV internally. You can preview it before sending for analysis.
            </p>

            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-purple-500/20 backdrop-blur-xl max-w-3xl mx-auto">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="space-y-4 sm:space-y-6">
                  <div className="text-left text-sm sm:text-base lg:text-lg text-gray-200 leading-relaxed p-4 sm:p-6 bg-gray-800/30 rounded-xl">
                    <p className="mb-2 font-semibold text-purple-300">Instructions</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Upload clear speech of at least 10 seconds.</li>
                      <li>Supported: .mp3, .m4a, .aac, .wav, .webm, .ogg and more.</li>
                      <li>We will convert it to WAV automatically.</li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => {
                        setAudioError(null)
                        const file = e.target.files?.[0] || null
                        setUploadedAudio(file)
                        if (audioURL) URL.revokeObjectURL(audioURL)
                        setAudioURL(file ? URL.createObjectURL(file) : null)
                        setWavBlob(null)
                        setVoiceRecordingCompleted(false)
                      }}
                      className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                    />
                    <Button
                      type="button"
                      disabled={!uploadedAudio || isConvertingAudio}
                      onClick={async () => {
                        if (!uploadedAudio) return
                        try {
                          setIsConvertingAudio(true)
                          setAudioError(null)

                          // If it's already a WAV, just use it as-is
                          const isWav = (
                            uploadedAudio.type?.toLowerCase().includes('wav') ||
                            uploadedAudio.name?.toLowerCase().endsWith('.wav')
                          )
                          if (isWav) {
                            setWavBlob(uploadedAudio)
                            setVoiceRecordingCompleted(true)
                            return
                          }

                          const arrayBuffer = await uploadedAudio.arrayBuffer()
                          // Convert to WAV using WebAudio API (client-side)
                          const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext
                          const audioCtx = new AudioCtx()
                          const decoded = await audioCtx.decodeAudioData(arrayBuffer)
                          const numOfChan = decoded.numberOfChannels

                          // Interleave channels
                          const channels: Float32Array[] = []
                          for (let i = 0; i < numOfChan; i++) channels.push(decoded.getChannelData(i))
                          const interleaved = new Float32Array(decoded.length * numOfChan)
                          for (let i = 0; i < decoded.length; i++) {
                            for (let ch = 0; ch < numOfChan; ch++) {
                              interleaved[i * numOfChan + ch] = channels[ch][i]
                            }
                          }

                          // Allocate proper buffer: header (44) + data (samples * 2 bytes)
                          const wavBuffer = new ArrayBuffer(44 + interleaved.length * 2)
                          const view = new DataView(wavBuffer)

                          const writeString = (offset: number, str: string) => {
                            for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i))
                          }

                          const bitDepth = 16
                          const byteRate = decoded.sampleRate * numOfChan * (bitDepth / 8)
                          const blockAlign = numOfChan * (bitDepth / 8)

                          // RIFF header
                          writeString(0, 'RIFF')
                          view.setUint32(4, 36 + interleaved.length * 2, true)
                          writeString(8, 'WAVE')

                          // fmt chunk
                          writeString(12, 'fmt ')
                          view.setUint32(16, 16, true) // Subchunk1Size (16 for PCM)
                          view.setUint16(20, 1, true)  // AudioFormat (1 = PCM)
                          view.setUint16(22, numOfChan, true)
                          view.setUint32(24, decoded.sampleRate, true)
                          view.setUint32(28, byteRate, true)
                          view.setUint16(32, blockAlign, true)
                          view.setUint16(34, bitDepth, true)

                          // data chunk
                          writeString(36, 'data')
                          view.setUint32(40, interleaved.length * 2, true)

                          // PCM samples
                          let offset = 44
                          for (let i = 0; i < interleaved.length; i++, offset += 2) {
                            let s = Math.max(-1, Math.min(1, interleaved[i]))
                            view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
                          }

                          // Close context to release resources
                          if (audioCtx && audioCtx.close) await audioCtx.close()

                          const wav = new Blob([new Uint8Array(wavBuffer)], { type: 'audio/wav' })
                          setWavBlob(wav)
                          setVoiceRecordingCompleted(true)
                        } catch (err: any) {
                          console.error(err)
                          setAudioError('Audio conversion failed. Please try a different file.')
                          setVoiceRecordingCompleted(false)
                        } finally {
                          setIsConvertingAudio(false)
                        }
                      }}
                      className="sm:w-48"
                    >
                      {isConvertingAudio ? 'Converting…' : 'Convert to WAV'}
                    </Button>
                  </div>

                  {audioURL && (
                    <div className="rounded-xl p-4 bg-gray-800/40 border border-gray-700">
                      <p className="text-sm text-gray-300 mb-2">Preview uploaded audio</p>
                      <audio controls src={audioURL} className="w-full" />
                    </div>
                  )}

                  {wavBlob && (
                    <div className="rounded-xl p-4 bg-gray-800/40 border border-gray-700">
                      <p className="text-sm text-gray-300 mb-2">Converted WAV (preview)</p>
                      <audio controls src={URL.createObjectURL(wavBlob)} className="w-full" />
                    </div>
                  )}

                  {audioError && (
                    <div className="text-red-400 text-sm">{audioError}</div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Removed Send for Analysis button - analysis now triggers automatically on Continue */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 2:
        return (
          <div className="text-center space-y-8">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <Eye className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white">Memory Matching Game</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Click on cards to flip them and find matching pairs. Test your visual memory and pattern recognition.
            </p>

            <div className="max-w-2xl mx-auto px-4">
              <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
                {memoryCards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => handleMemoryCardClick(card.id)}
                    className={`aspect-square rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center text-2xl sm:text-3xl lg:text-4xl ${
                      card.flipped || card.matched
                        ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white transform scale-105"
                        : "bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700"
                    } ${card.matched ? "ring-2 sm:ring-4 ring-green-400" : ""}`}
                  >
                    {card.flipped || card.matched ? card.content : "?"}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center text-sm sm:text-base lg:text-lg gap-2 sm:gap-0">
                <div className="text-blue-400">
                  Score: <span className="font-bold">{gameScores.memory}</span>
                </div>
                <div className="text-purple-400">
                  Attempts: <span className="font-bold">{memoryAttempts}</span>
                </div>
                <div className="text-green-400">
                  Matches: <span className="font-bold">{memoryCards.filter((card) => card.matched).length / 2}</span>/8
                </div>
              </div>

              {memoryGameCompleted && (
                <div className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                  <div className="text-green-300 font-bold text-xl mb-2">🎉 Excellent Work!</div>
                  <div className="text-green-200">Memory game completed with {memoryAttempts} attempts!</div>
                </div>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="text-center space-y-6 sm:space-y-8 px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <Target className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white leading-tight">Attention Focus Test</h2>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-300 max-w-2xl mx-auto px-4 leading-relaxed">
              Click on the moving target as quickly and accurately as possible. This tests sustained attention and
              reaction time.
            </p>

            <div className="max-w-2xl mx-auto">
              <div
                onClick={handleAttentionClick}
                className="relative w-full h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-2 border-gray-600 cursor-crosshair overflow-hidden"
              >
                {!attentionGameCompleted && (
                  <div
                    className="absolute w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000"
                    style={{
                      left: `${attentionTarget.x}%`,
                      top: `${attentionTarget.y}%`,
                    }}
                  />
                )}
                {attentionGameCompleted && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                      <div className="text-2xl font-bold text-green-300">Test Complete!</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center text-sm sm:text-base lg:text-lg mt-4 sm:mt-6 gap-2 sm:gap-0">
                <div className="text-blue-400">
                  Score: <span className="font-bold">{attentionScore}</span>
                </div>
                <div className="text-purple-400">
                  Time: <span className="font-bold">{attentionTime}s</span>
                </div>
                <div className="text-green-400">
                  Hits: <span className="font-bold">{attentionHits}</span>
                </div>
              </div>

              {attentionGameCompleted && (
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                  <div className="text-green-300 font-bold text-lg sm:text-xl mb-2">🎯 Great Focus!</div>
                  <div className="text-green-200 text-sm sm:text-base">Final Score: {gameScores.attention}/100</div>
                </div>
              )}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="text-center space-y-8">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <Zap className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white">Processing Speed Test</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Quickly determine if the current symbol matches the target symbol. This measures cognitive processing
              speed.
            </p>

            <div className="max-w-2xl mx-auto">
              <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-orange-500/20 backdrop-blur-xl">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="text-sm text-gray-400 mb-2">Target Symbol:</div>
                    <div className="text-6xl font-bold text-orange-400 mb-6">{targetSymbol}</div>

                    <div className="text-sm text-gray-400 mb-2">Current Symbol:</div>
                    <div className="text-6xl font-bold text-white mb-8">{currentSymbol}</div>
                  </div>

                  {!processingGameCompleted && (
                    <div className="flex gap-4 justify-center">
                      <Button
                        onClick={() => handleProcessingResponse(true)}
                        size="lg"
                        className="bg-green-500 hover:bg-green-600 px-8 py-4 text-xl"
                      >
                        <CheckCircle className="mr-2 h-6 w-6" />
                        MATCH
                      </Button>
                      <Button
                        onClick={() => handleProcessingResponse(false)}
                        size="lg"
                        className="bg-red-500 hover:bg-red-600 px-8 py-4 text-xl"
                      >
                        <X className="mr-2 h-6 w-6" />
                        NO MATCH
                      </Button>
                    </div>
                  )}

                  {processingGameCompleted && (
                    <div className="text-center">
                      <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                      <div className="text-2xl font-bold text-green-300 mb-2">Test Complete!</div>
                      <div className="text-green-200">
                        Accuracy: {processingTotal > 0 ? Math.round((processingCorrect / processingTotal) * 100) : 0}%
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-between items-center text-lg mt-6">
                <div className="text-blue-400">
                  Score: <span className="font-bold">{processingScore}</span>
                </div>
                <div className="text-purple-400">
                  Time: <span className="font-bold">{processingTime}s</span>
                </div>
                <div className="text-green-400">
                  Correct:{" "}
                  <span className="font-bold">
                    {processingCorrect}/{processingTotal}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )

   case 5:
        return (
          <div className="text-center space-y-8">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <Puzzle className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white">Spatial Reasoning Test</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {showSpatialPattern
                ? `Memorize the pattern shown below. You have ${spatialTimer} seconds.`
                : "Now click the squares in the same order you saw them."}
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
                {Array.from({ length: 9 }, (_, i) => (
                  <div
                    key={i}
                    onClick={() => handleSpatialClick(i)}
                    className={`aspect-square rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center text-2xl font-bold ${
                      showSpatialPattern && spatialPattern.includes(i)
                        ? "bg-gradient-to-br from-yellow-500 to-green-500 text-white animate-pulse"
                        : spatialUserPattern.includes(i)
                          ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white"
                          : "bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-gray-400"
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>

              {showSpatialPattern && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">{spatialTimer}</div>
                  <div className="text-gray-400">Memorize the highlighted pattern</div>
                </div>
              )}

              {!showSpatialPattern && !spatialCompleted && (
                <div className="text-center">
                  <div className="text-lg text-gray-300 mb-4">
                    Click the squares in order: {spatialUserPattern.length}/{spatialPattern.length}
                  </div>
                  <Button
                    onClick={() => setSpatialUserPattern([])}
                    variant="outline"
                    className="bg-transparent border-gray-500 text-gray-300"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              )}

              {spatialCompleted && (
                <div className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                  <div className="text-green-300 font-bold text-xl mb-2">🧩 Pattern Complete!</div>
                  <div className="text-green-200">Spatial reasoning score: {gameScores.spatial}/100</div>
                </div>
              )}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="text-center space-y-8">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white">Working Memory Test</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {showWorkingMemorySequence
                ? `Memorize this number sequence: ${workingMemorySequence.join(", ")}. Time remaining: ${workingMemoryTimer}s`
                : "Now enter the numbers in REVERSE order:"}
            </p>

            <div className="max-w-2xl mx-auto">
              {showWorkingMemorySequence ? (
                <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-green-500/20 backdrop-blur-xl">
                  <CardContent className="p-8">
                    <div className="text-6xl font-bold text-green-400 mb-6 tracking-wider">
                      {workingMemorySequence.join("  ")}
                    </div>
                    <div className="text-2xl font-bold text-green-300">{workingMemoryTimer}</div>
                    <div className="text-gray-400">seconds remaining</div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-green-500/20 backdrop-blur-xl">
                  <CardContent className="p-8">
                    <div className="text-lg text-gray-300 mb-6">Enter the numbers in REVERSE order (backwards):</div>
                    <div className="flex gap-4 justify-center mb-8">
                      {workingMemoryInput.map((value, index) => (
                        <Input
                          key={index}
                          value={value}
                          onChange={(e) => {
                            const newInput = [...workingMemoryInput]
                            newInput[index] = e.target.value
                            setWorkingMemoryInput(newInput)
                          }}
                          className="w-16 h-16 text-center text-2xl font-bold bg-gray-800 border-gray-600 text-white"
                          maxLength={1}
                        />
                      ))}
                    </div>
                    {!workingMemoryCompleted && (
                      <Button
                        onClick={handleWorkingMemorySubmit}
                        size="lg"
                        className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                      >
                        Submit Answer
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              {workingMemoryCompleted && (
                <div className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                  <div className="text-green-300 font-bold text-xl mb-2">🧠 Memory Test Complete!</div>
                  <div className="text-green-200">Working memory score: {gameScores.working}/100</div>
                </div>
              )}
            </div>
          </div>
        )

      case 7:
        return (
          <div className="text-center space-y-8">
            <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <Calculator className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white">Number Sequence Test</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Look at the number sequence below and determine what the next number should be.
            </p>

            <div className="max-w-2xl mx-auto">
              <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-cyan-500/20 backdrop-blur-xl">
                <CardContent className="p-8">
                  <div className="text-4xl font-bold text-cyan-400 mb-8 tracking-wider">
                    {numberSequence.join("  ,  ")} , ?
                  </div>

                  {!numberSequenceCompleted ? (
                    <div className="space-y-6">
                      <Input
                        value={numberSequenceAnswer}
                        onChange={(e) => setNumberSequenceAnswer(e.target.value)}
                        placeholder="Enter the next number"
                        className="w-32 h-16 text-center text-2xl font-bold bg-gray-800 border-gray-600 text-white mx-auto"
                        type="number"
                      />
                      <Button
                        onClick={handleNumberSequenceSubmit}
                        size="lg"
                        className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                      >
                        Submit Answer
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                      <div className="text-2xl font-bold text-green-300 mb-2">
                        {gameScores.sequence === 100 ? "Correct!" : "Good Try!"}
                      </div>
                      <div className="text-green-200">The answer was 32 (each number doubles)</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {numberSequenceCompleted && (
                <div className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                  <div className="text-green-300 font-bold text-xl mb-2">🔢 Sequence Complete!</div>
                  <div className="text-green-200">Pattern recognition score: {gameScores.sequence}/100</div>
                </div>
              )}
            </div>
          </div>
        )

      case 8:
        return (
          <div className="text-center space-y-8">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white">Word Recall Test</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {showWordRecallWords
                ? `Memorize these words. Time remaining: ${wordRecallTimer}s`
                : "Now type all the words you remember, separated by commas:"}
            </p>

            <div className="max-w-2xl mx-auto">
              {showWordRecallWords ? (
                <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-blue-500/20 backdrop-blur-xl">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mb-6">
                      {wordRecallWords.map((word, index) => (
                        <div
                          key={index}
                          className="text-xl sm:text-2xl font-bold text-blue-400 p-3 sm:p-4 bg-gray-800/50 rounded-lg whitespace-nowrap text-center"
                        >
                          {word}
                        </div>
                      ))}
                    </div>
                    <div className="text-3xl font-bold text-blue-300">{wordRecallTimer}</div>
                    <div className="text-gray-400">seconds remaining</div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-blue-500/20 backdrop-blur-xl">
                  <CardContent className="p-8">
                    <Textarea
                      value={wordRecallInput}
                      onChange={(e) => setWordRecallInput(e.target.value)}
                      placeholder="Enter the words you remember, separated by commas..."
                      className="w-full h-32 text-lg bg-gray-800 border-gray-600 text-white mb-6"
                    />
                    {!wordRecallCompleted && (
                      <Button
                        onClick={handleWordRecallSubmit}
                        size="lg"
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                      >
                        Submit Words
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              {wordRecallCompleted && (
                <div className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                  <div className="text-green-300 font-bold text-xl mb-2">📝 Word Recall Complete!</div>
                  <div className="text-green-200">Verbal memory score: {gameScores.recall}/100</div>
                </div>
              )}
            </div>
          </div>
        )

      case 9:
        return (
          <div className="text-center space-y-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <Target className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white">Trail Making Test</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Click the numbers in order from 1 to 10 as quickly as possible. This tests visual attention and task
              switching.
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="relative w-full h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-2 border-gray-600 overflow-hidden">
                {trailNumbers.map((number) => (
                  <div
                    key={number}
                    onClick={() => handleTrailNumberClick(number)}
                    className={`absolute w-12 h-12 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center font-bold text-lg transform -translate-x-1/2 -translate-y-1/2 ${
                      number < trailCurrentNumber
                        ? "bg-green-500 text-white"
                        : number === trailCurrentNumber
                          ? "bg-blue-500 text-white animate-pulse scale-110"
                          : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                    }`}
                    style={{
                      left: `${15 + (number - 1) * 8 + Math.random() * 20}%`,
                      top: `${20 + Math.random() * 60}%`,
                    }}
                  >
                    {number}
                  </div>
                ))}

                {trailCompleted && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-center">
                      <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                      <div className="text-2xl font-bold text-green-300">Trail Complete!</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center text-lg mt-6">
                <div className="text-blue-400">
                  Next: <span className="font-bold">{trailCurrentNumber > 10 ? "Complete!" : trailCurrentNumber}</span>
                </div>
                <div className="text-purple-400">
                  Errors: <span className="font-bold">{trailErrors}</span>
                </div>
                <div className="text-green-400">
                  Progress: <span className="font-bold">{trailCurrentNumber - 1}/10</span>
                </div>
              </div>

              {trailCompleted && (
                <div className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                  <div className="text-green-300 font-bold text-xl mb-2">🎯 Trail Complete!</div>
                  <div className="text-green-200">Visual attention score: {gameScores.trail}/100</div>
                </div>
              )}
            </div>
          </div>
        )

      case 10:
        return (
          <div className="text-center space-y-8">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <Timer className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white">Clock Reading Test</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Look at the clock below and select the correct time it shows.
            </p>

            <div className="max-w-2xl mx-auto">
              <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-purple-500/20 backdrop-blur-xl">
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <div className="w-64 h-64 mx-auto bg-white rounded-full border-8 border-gray-300 flex items-center justify-center relative">
                      {/* Clock face with numbers */}
                      <div className="absolute inset-4 rounded-full border-2 border-gray-400">
                        {/* Hour markers */}
{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((hour) => {
  // Shift so 12 is at the top
  const angle = (hour - 3) * (Math.PI / 6); // 30° per hour
  const radius = 35; // distance from center

  return (
    <div
      key={hour}
      className="absolute text-lg font-bold text-gray-800"
      style={{
        top: `${50 + radius * Math.sin(angle)}%`,
        left: `${50 + radius * Math.cos(angle)}%`,
        transform: "translate(-50%, -50%)",
          } as React.CSSProperties}

    >
      {hour}
    </div>
  );
})}


                    {/* Hour hand */}
<div
  className="absolute w-1 bg-gray-800 origin-bottom"
  style={{
    height: "25%",
    top: "25%",
    left: "49.5%",
    transform: "rotate(97.5deg)",
    transformOrigin: "bottom center",
  }}
/>

{/* Minute hand */}
<div
  className="absolute w-0.5 bg-gray-600 origin-bottom"
  style={{
    height: "35%",
    top: "15%",
    left: "49.75%",
    transform: "rotate(90deg)",
    transformOrigin: "bottom center",
  }}
/>


                        {/* Center dot */}
                        <div className="absolute w-3 h-3 bg-gray-800 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="text-lg text-gray-300 mb-6">What time does this clock show?</div>

                    {!clockDrawingCompleted && (
                      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                        {["2:15", "3:15", "3:45", "4:15"].map((time) => (
                          <Button
                            key={time}
                            onClick={() => {
                              const isCorrect = time === "3:15"
                              const score = isCorrect ? 100 : 0
                              setGameScores((prev) => ({ ...prev, clock: score }))
                              setClockDrawingCompleted(true)
                              recordGameScore("clock", score, 100)
                            }}
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-3 text-lg"
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {clockDrawingCompleted && (
                <div className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                  <div className="text-green-300 font-bold text-xl mb-2">🕒 Clock Reading Complete!</div>
                  <div className="text-green-200">Time reading score: {gameScores.clock}/100</div>
                </div>
              )}
            </div>
          </div>
        )

      case 11:
        return (
          <div className="text-center space-y-8">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white">Verbal Fluency Test</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Name as many animals as you can in 60 seconds. Type them separated by commas.
            </p>

            <div className="max-w-2xl mx-auto">
              <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-pink-500/20 backdrop-blur-xl">
                <CardContent className="p-8">
                  {!verbalFluencyStarted ? (
                    <div className="text-center">
                      <div className="text-lg text-gray-300 mb-6">
                        When you click start, you'll have 60 seconds to name as many animals as possible.
                      </div>
                      <Button
                        onClick={startVerbalFluency}
                        size="lg"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        <Play className="mr-2 h-6 w-6" />
                        Start Test
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-pink-400 mb-2">{verbalFluencyTime}</div>
                        <div className="text-gray-400">seconds remaining</div>
                      </div>

                      <Textarea
                        value={verbalFluencyInput}
                        onChange={(e) => setVerbalFluencyInput(e.target.value)}
                        placeholder="Type animal names separated by commas (e.g., dog, cat, elephant...)"
                        className="w-full h-32 text-lg bg-gray-800 border-gray-600 text-white"
                        disabled={verbalFluencyCompleted}
                      />

                      <div className="text-center text-gray-300">
                        Animals named:{" "}
                        {verbalFluencyInput.split(",").filter((animal) => animal.trim().length > 0).length}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {verbalFluencyCompleted && (
                <div className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                  <div className="text-green-300 font-bold text-xl mb-2">🗣️ Verbal Fluency Complete!</div>
                  <div className="text-green-200">Language fluency score: {gameScores.verbal}/100</div>
                </div>
              )}
            </div>
          </div>
        )

      case 12:
        return (
          <div className="text-center space-y-8">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <Brain className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white">MMSE Screening</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Mini-Mental State Examination - Answer the following questions to complete your cognitive screening.
            </p>

            <div className="max-w-2xl mx-auto">
              <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-red-500/20 backdrop-blur-xl">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {mmseQuestions.map((q, index) => (
                      <div key={index} className="text-left">
                        <label className="block text-lg font-medium text-gray-200 mb-2">
                          {index + 1}. {q.question}
                        </label>
                        <Input
                          value={mmseAnswers[index]}
                          onChange={(e) => handleMmseAnswer(index, e.target.value)}
                          className="w-full bg-gray-800 border-gray-600 text-white"
                          placeholder="Your answer..."
                        />
                      </div>
                    ))}

                    {!mmseCompleted && (
                      <Button
                        onClick={handleMmseSubmit}
                        size="lg"
                        className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 mt-8"
                      >
                        Complete MMSE
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {mmseCompleted && (
                <div className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                  <div className="text-green-300 font-bold text-xl mb-2">🧠 MMSE Complete!</div>
                  <div className="text-green-200">Cognitive screening score: {gameScores.mmse}/100</div>
                </div>
              )}
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center space-y-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <Brain className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white">Assessment Step {currentStep + 1}</h2>
            <p className="text-xl text-gray-300">This step is under development.</p>
            <div className="text-purple-400 text-sm">✨ Mano Veda AI is preparing this assessment</div>
          </div>
        )
    }
  }

  // Show session manager if not started
  if (showSessionManager) {
    return (
      <div className="min-h-screen bg-black text-white overflow-hidden relative">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900"></div>

          {/* Floating Particles */}
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-float"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity,
                animationDelay: `${particle.id * 0.1}s`,
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
        </div>

        {/* Header */}
        <header className="relative z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-6 flex items-center justify-between">
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
                  AI-Powered Assessment
                </div>
              </div>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-30 py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <SessionManager
              userId="demo-user"
              onStartAssessment={handleStartAssessment}
              onResetSession={handleResetSession}
              currentStep={currentStep}
            />
          </div>
        </main>

        {/* Mannu AI Assistant */}
        <MannuAssistant currentStep={currentStep} isFixed={true} />

        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(180deg);
            }
          }

          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900"></div>

        {/* Floating Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animationDelay: `${particle.id * 0.1}s`,
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
                  AI-Powered Assessment
                </div>
              </div>
              <div className="sm:hidden">
                <span className="text-xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Mano Veda
                </span>
              </div>
            </Link>
            
            <div className="flex items-center">
              <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-bold backdrop-blur-sm">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mr-1 sm:mr-2 animate-pulse" />
                <span className="hidden sm:inline">Assessment in Progress</span>
                <span className="sm:hidden">In Progress</span>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Section */}
      <div className="relative z-40 bg-gradient-to-r from-gray-900/50 via-black/50 to-gray-900/50 border-b border-white/10 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4 sm:gap-0">
            <div className="flex items-center space-x-3 sm:space-x-6">
              <div
                className={`w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br ${steps[currentStep].color} rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl animate-pulse`}
              >
                {React.createElement(steps[currentStep].icon, { className: "h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white" })}
              </div>
              <div>
                <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-black text-white leading-tight">{steps[currentStep].title}</h3>
                <p className="text-gray-300 text-xs sm:text-sm lg:text-base xl:text-lg font-light leading-relaxed mt-1">{steps[currentStep].description}</p>
              </div>
            </div>
            <div className="text-right sm:text-right">
              <div className="text-xs sm:text-sm font-bold text-gray-400 mb-1 sm:mb-2">
                Step {currentStep + 1} of {steps.length}
              </div>
              <div className="text-2xl sm:text-3xl lg:text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {metrics.actualProgress}%
              </div>
            </div>
          </div>
          <div className="relative mt-4 sm:mt-0">
            <Progress value={metrics.actualProgress} className="h-4 sm:h-6 bg-gray-800/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-20 blur-sm" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-30 py-6 sm:py-8 lg:py-12 xl:py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl w-full">
          {renderStepContent()}

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-12 sm:mt-16 lg:mt-20 gap-4 sm:gap-0">
            <Button
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
              size="lg"
              className="group bg-transparent border-2 border-white/20 hover:border-white/40 text-white hover:bg-white/10 px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 text-base sm:text-lg lg:text-xl font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 rounded-xl btn-mobile w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 sm:mr-3 lg:mr-4 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 group-hover:-translate-x-1 transition-transform duration-300" />
              Previous
            </Button>

            <div className="text-center order-first sm:order-none">
              <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                Step {currentStep + 1}: {steps[currentStep].title}
              </div>
              <div className="text-xs text-gray-400">Can proceed: {canProceedToNextStep() ? "✅" : "❌"}</div>
              <div className="text-xs text-purple-400 mt-1 hidden sm:block">✨ Mannu AI Assistant Available</div>
            </div>

            {currentStep < steps.length - 2 ? (
              <Button
                onClick={nextStep}
                disabled={!canProceedToNextStep()}
                size="lg"
                className={`group relative ${
                  canProceedToNextStep()
                    ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600"
                    : "bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed"
                } text-white text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-12 py-4 sm:py-5 lg:py-6 rounded-xl sm:rounded-2xl shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 overflow-hidden btn-mobile w-full sm:w-auto`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center justify-center z-10">
                  <span className="hidden sm:inline">{canProceedToNextStep() ? "Continue" : "Complete Current Test"}</span>
                  <span className="sm:hidden">{canProceedToNextStep() ? "Continue" : "Complete Test"}</span>
                  <ArrowRight className="ml-2 sm:ml-3 lg:ml-4 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </Button>
            ) : (
              <Button
                onClick={() => {
                  // Store all game scores before navigating
                  const finalResults = {
                    overallScore: Math.round(
                      Object.values(gameScores).reduce((a, b) => a + b, 0) / Object.keys(gameScores).length,
                    ),
                    riskLevel:
                      Math.round(
                        Object.values(gameScores).reduce((a, b) => a + b, 0) / Object.keys(gameScores).length,
                      ) >= 80
                        ? "Low"
                        : Math.round(
                              Object.values(gameScores).reduce((a, b) => a + b, 0) / Object.keys(gameScores).length,
                            ) >= 60
                          ? "Moderate"
                          : "High",
                    completedTasks: Object.keys(gameScores),
                    gameScores: Object.entries(gameScores).map(([game, score]) => ({
                      game: game.charAt(0).toUpperCase() + game.slice(1),
                      score,
                      maxScore: 100,
                    })),
                    voiceAnalysis: { clarity: 85, fluency: 78, pace: 82 },
                    biometrics: { heartRate: 72, stressLevel: 25, focusLevel: 85 },
                    sessionDuration: 1200,
                    completedAt: new Date().toISOString(),
                  }
                  localStorage.setItem("assessmentResults", JSON.stringify(finalResults))
                  router.push("/results")
                }}
                size="lg"
                className="group relative bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-12 py-4 sm:py-5 lg:py-6 rounded-xl sm:rounded-2xl shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-500 transform hover:scale-105 border-0 overflow-hidden btn-mobile w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center justify-center z-10">
                  <CheckCircle className="mr-2 sm:mr-3 lg:mr-4 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                  View Results
                </div>
              </Button>
            )}
          </div>
        </div>
      </main>

      {/* Mannu AI Assistant - Available on every step */}
      <MannuAssistant currentStep={currentStep} isFixed={true} />

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
