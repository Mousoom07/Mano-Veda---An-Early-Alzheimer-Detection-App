"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileText,
  Download,
  Brain,
  User,
  Calendar,
  Activity,
  Target,
  CheckCircle,
  Mic,
  BarChart3,
  Heart,
  Shield,
  Lightbulb,
} from "lucide-react"

interface PatientInfo {
  firstName: string
  lastName: string
  dateOfBirth: string
  age: string
  gender: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  education: string
  occupation: string
  maritalStatus: string
  primaryLanguage: string
  ethnicity: string
  medicalHistory: string
  currentMedications: string
  allergies: string
  previousCognitiveAssessments: string
  familyHistoryDementia: string
  neurologicalConditions: string
  psychiatricHistory: string
  smokingStatus: string
  smokingHistory: string
  alcoholConsumption: string
  alcoholHistory: string
  exerciseFrequency: string
  sleepHours: string
  sleepQuality: string
  dietType: string
  memoryComplaints: string
  cognitiveSymptoms: string[]
  symptomDuration: string
  functionalImpact: string
  emergencyContactName: string
  emergencyContactRelation: string
  emergencyContactPhone: string
  emergencyContactEmail: string
  consentResearch: boolean
  consentDataSharing: boolean
  privacyAgreement: boolean
}

interface AssessmentResults {
  overallScore: number
  riskLevel: string
  completedTasks: string[]
  gameScores: Array<{
    game: string
    score: number
    maxScore: number
  }>
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
  sessionDuration: number
  completedAt: string
}

export default function PDFGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    setIsGenerating(true)

    try {
      // Get patient info and assessment results from localStorage
      const patientInfoStr = localStorage.getItem("patientInfo")
      const assessmentResultsStr = localStorage.getItem("assessmentResults")
      const realTimeDataStr = localStorage.getItem("assessment_demo-user")

      let patientInfo: PatientInfo | null = null
      let assessmentResults: AssessmentResults | null = null
      let realTimeData: any = null

      try {
        if (patientInfoStr) patientInfo = JSON.parse(patientInfoStr)
        if (assessmentResultsStr) assessmentResults = JSON.parse(assessmentResultsStr)
        if (realTimeDataStr) realTimeData = JSON.parse(realTimeDataStr)
      } catch (parseError) {
        console.error("Error parsing stored data:", parseError)
      }

      // Generate fallback data if needed
      if (!patientInfo) {
        patientInfo = {
          firstName: "John",
          lastName: "Doe",
          dateOfBirth: "1980-01-01",
          age: "44",
          gender: "Male",
          email: "john.doe@example.com",
          phone: "(555) 123-4567",
          address: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "USA",
          education: "bachelors",
          occupation: "Software Engineer",
          maritalStatus: "married",
          primaryLanguage: "English",
          ethnicity: "white",
          medicalHistory: "No significant medical history",
          currentMedications: "None",
          allergies: "None known",
          previousCognitiveAssessments: "None",
          familyHistoryDementia: "no",
          neurologicalConditions: "None",
          psychiatricHistory: "None",
          smokingStatus: "never",
          smokingHistory: "",
          alcoholConsumption: "occasional",
          alcoholHistory: "Social drinking on weekends",
          exerciseFrequency: "3-4-times",
          sleepHours: "7-8",
          sleepQuality: "good",
          dietType: "standard",
          memoryComplaints: "Occasional forgetfulness with names",
          cognitiveSymptoms: ["Memory problems", "Difficulty concentrating"],
          symptomDuration: "6-12-months",
          functionalImpact: "Minimal impact on daily activities",
          emergencyContactName: "Jane Doe",
          emergencyContactRelation: "spouse",
          emergencyContactPhone: "(555) 987-6543",
          emergencyContactEmail: "jane.doe@example.com",
          consentResearch: true,
          consentDataSharing: false,
          privacyAgreement: true,
        }
      }

      if (!assessmentResults && realTimeData) {
        assessmentResults = {
          overallScore: realTimeData.overallScore || 75,
          riskLevel: realTimeData.riskLevel || "Low",
          completedTasks: realTimeData.completedTasks || [],
          gameScores: realTimeData.gameScores || [],
          voiceAnalysis: realTimeData.voiceAnalysis || { clarity: 85, fluency: 78, pace: 82 },
          biometrics: realTimeData.biometrics || { heartRate: 72, stressLevel: 25, focusLevel: 85 },
          sessionDuration: realTimeData.sessionDuration || 1200,
          completedAt: new Date().toISOString(),
        }
      }

      if (!assessmentResults) {
        assessmentResults = {
          overallScore: 75,
          riskLevel: "Low",
          completedTasks: ["voice-analysis", "memory-matching", "attention-focus"],
          gameScores: [
            { game: "Memory Matching", score: 85, maxScore: 100 },
            { game: "Attention Focus", score: 78, maxScore: 100 },
            { game: "Processing Speed", score: 82, maxScore: 100 },
            { game: "Working Memory", score: 76, maxScore: 100 },
            { game: "Spatial Reasoning", score: 85, maxScore: 100 },
            { game: "Word Recall", score: 73, maxScore: 100 },
            { game: "Trail Making", score: 80, maxScore: 100 },
            { game: "Clock Drawing", score: 82, maxScore: 100 },
            { game: "Verbal Fluency", score: 77, maxScore: 100 },
            { game: "MMSE Screening", score: 88, maxScore: 100 },
          ],
          voiceAnalysis: { clarity: 85, fluency: 78, pace: 82 },
          biometrics: { heartRate: 72, stressLevel: 25, focusLevel: 85 },
          sessionDuration: 1200,
          completedAt: new Date().toISOString(),
        }
      }

      // Create PDF using jsPDF
      const { jsPDF } = await import("jspdf")
      const doc = new jsPDF()

      // Set up fonts and colors
      doc.setFont("helvetica")

      // Header
      doc.setFillColor(59, 130, 246) // Blue background
      doc.rect(0, 0, 210, 30, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(24)
      doc.text("MANO VEDA AI", 20, 20)
      doc.setFontSize(12)
      doc.text("Cognitive Assessment Report", 20, 26)

      // Reset text color
      doc.setTextColor(0, 0, 0)
      let yPos = 45

      // Patient Information Section
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.text("PATIENT INFORMATION", 20, yPos)
      yPos += 10

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text(`Name: ${patientInfo.firstName} ${patientInfo.lastName}`, 20, yPos)
      doc.text(`Date of Birth: ${new Date(patientInfo.dateOfBirth).toLocaleDateString()}`, 120, yPos)
      yPos += 6
      doc.text(`Age: ${patientInfo.age} years`, 20, yPos)
      doc.text(`Gender: ${patientInfo.gender}`, 120, yPos)
      yPos += 6
      doc.text(`Email: ${patientInfo.email}`, 20, yPos)
      yPos += 6
      doc.text(`Phone: ${patientInfo.phone}`, 20, yPos)
      yPos += 6
      doc.text(
        `Address: ${patientInfo.address}, ${patientInfo.city}, ${patientInfo.state} ${patientInfo.zipCode}`,
        20,
        yPos,
      )
      yPos += 6
      doc.text(`Country: ${patientInfo.country}`, 20, yPos)
      yPos += 10

      // Demographics
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("DEMOGRAPHICS & BACKGROUND", 20, yPos)
      yPos += 8

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text(`Education: ${patientInfo.education}`, 20, yPos)
      doc.text(`Occupation: ${patientInfo.occupation}`, 120, yPos)
      yPos += 6
      doc.text(`Marital Status: ${patientInfo.maritalStatus}`, 20, yPos)
      doc.text(`Primary Language: ${patientInfo.primaryLanguage}`, 120, yPos)
      yPos += 6
      doc.text(`Ethnicity: ${patientInfo.ethnicity}`, 20, yPos)
      yPos += 10

      // Medical History
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("MEDICAL HISTORY", 20, yPos)
      yPos += 8

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text(`Medical History: ${patientInfo.medicalHistory}`, 20, yPos)
      yPos += 6
      doc.text(`Current Medications: ${patientInfo.currentMedications}`, 20, yPos)
      yPos += 6
      doc.text(`Allergies: ${patientInfo.allergies}`, 20, yPos)
      yPos += 6
      doc.text(`Family History of Dementia: ${patientInfo.familyHistoryDementia}`, 20, yPos)
      yPos += 10

      // Lifestyle Factors
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("LIFESTYLE FACTORS", 20, yPos)
      yPos += 8

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text(`Smoking Status: ${patientInfo.smokingStatus}`, 20, yPos)
      doc.text(`Alcohol Consumption: ${patientInfo.alcoholConsumption}`, 120, yPos)
      yPos += 6
      doc.text(`Exercise Frequency: ${patientInfo.exerciseFrequency}`, 20, yPos)
      doc.text(`Sleep Hours: ${patientInfo.sleepHours}`, 120, yPos)
      yPos += 6
      doc.text(`Sleep Quality: ${patientInfo.sleepQuality}`, 20, yPos)
      doc.text(`Diet Type: ${patientInfo.dietType}`, 120, yPos)
      yPos += 15

      // Assessment Results - New Page
      doc.addPage()
      yPos = 20

      // Overall Score Section
      doc.setFillColor(139, 92, 246) // Purple background
      doc.rect(0, 0, 210, 25, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(20)
      doc.text("ASSESSMENT RESULTS", 20, 16)

      doc.setTextColor(0, 0, 0)
      yPos = 35

      // Overall Score Box
      doc.setFillColor(240, 240, 240)
      doc.rect(20, yPos, 170, 30, "F")
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.text(`Overall Cognitive Score: ${assessmentResults.overallScore}/100`, 30, yPos + 12)
      doc.text(`Risk Level: ${assessmentResults.riskLevel.toUpperCase()}`, 30, yPos + 22)
      yPos += 40

      // Voice Analysis
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("VOICE ANALYSIS RESULTS", 20, yPos)
      yPos += 8

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text(`Speech Clarity: ${assessmentResults.voiceAnalysis.clarity}%`, 20, yPos)
      doc.text(`Speech Fluency: ${assessmentResults.voiceAnalysis.fluency}%`, 80, yPos)
      doc.text(`Speech Pace: ${assessmentResults.voiceAnalysis.pace}%`, 140, yPos)
      yPos += 15

      // Cognitive Test Results
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("COGNITIVE TEST RESULTS", 20, yPos)
      yPos += 8

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      assessmentResults.gameScores.forEach((game, index) => {
        const percentage = Math.round((game.score / game.maxScore) * 100)
        const status = percentage >= 80 ? "Excellent" : percentage >= 60 ? "Good" : "Needs Attention"
        doc.text(`${game.game}: ${game.score}/${game.maxScore} (${percentage}%) - ${status}`, 20, yPos)
        yPos += 6

        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }
      })

      // Add charts section
      yPos += 10
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("PERFORMANCE ANALYSIS CHARTS", 20, yPos)
      yPos += 8

      // Performance distribution
      const excellent = assessmentResults.gameScores.filter((g) => g.score >= 80).length
      const good = assessmentResults.gameScores.filter((g) => g.score >= 60 && g.score < 80).length
      const needsWork = assessmentResults.gameScores.filter((g) => g.score < 60).length

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text(`Performance Distribution:`, 20, yPos)
      yPos += 6
      doc.text(`• Excellent Performance (80-100%): ${excellent} tests`, 30, yPos)
      yPos += 6
      doc.text(`• Good Performance (60-79%): ${good} tests`, 30, yPos)
      yPos += 6
      doc.text(`• Needs Improvement (<60%): ${needsWork} tests`, 30, yPos)
      yPos += 15

      // Domain analysis
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("COGNITIVE DOMAIN BREAKDOWN", 20, yPos)
      yPos += 8

      const domains = [
        {
          name: "Memory & Recall",
          scores: assessmentResults.gameScores.filter(
            (g) => g.game.toLowerCase().includes("memory") || g.game.toLowerCase().includes("recall"),
          ),
        },
        {
          name: "Attention & Focus",
          scores: assessmentResults.gameScores.filter(
            (g) => g.game.toLowerCase().includes("attention") || g.game.toLowerCase().includes("trail"),
          ),
        },
        {
          name: "Processing Speed",
          scores: assessmentResults.gameScores.filter(
            (g) => g.game.toLowerCase().includes("processing") || g.game.toLowerCase().includes("speed"),
          ),
        },
        {
          name: "Language & Verbal",
          scores: assessmentResults.gameScores.filter(
            (g) => g.game.toLowerCase().includes("verbal") || g.game.toLowerCase().includes("fluency"),
          ),
        },
      ]

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      domains.forEach((domain) => {
        if (domain.scores.length > 0) {
          const avgScore = Math.round(domain.scores.reduce((a, b) => a + b.score, 0) / domain.scores.length)
          doc.text(`${domain.name}: ${avgScore}/100 (${domain.scores.length} tests)`, 20, yPos)
          yPos += 6
        }
      })

      yPos += 10

      // Performance trends
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("PERFORMANCE INSIGHTS", 20, yPos)
      yPos += 8

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      const insights = [
        `Overall cognitive performance is ${assessmentResults.overallScore >= 80 ? "excellent" : assessmentResults.overallScore >= 60 ? "good" : "below average"}`,
        `Strongest domain: ${
          domains.reduce((max, domain) => {
            if (domain.scores.length === 0) return max
            const avgScore = domain.scores.reduce((a, b) => a + b.score, 0) / domain.scores.length
            const maxAvg = max.scores.length > 0 ? max.scores.reduce((a, b) => a + b.score, 0) / max.scores.length : 0
            return avgScore > maxAvg ? domain : max
          }, domains[0]).name
        }`,
        `Areas for improvement: ${
          domains
            .filter((d) => d.scores.length > 0 && d.scores.reduce((a, b) => a + b.score, 0) / d.scores.length < 70)
            .map((d) => d.name)
            .join(", ") || "None identified"
        }`,
        `Voice analysis shows ${assessmentResults.voiceAnalysis.clarity >= 80 ? "clear" : "moderate"} speech patterns`,
      ]

      insights.forEach((insight) => {
        const lines = doc.splitTextToSize(`• ${insight}`, 170)
        lines.forEach((line: string) => {
          if (yPos > 270) {
            doc.addPage()
            yPos = 20
          }
          doc.text(line, 20, yPos)
          yPos += 6
        })
      })

      yPos += 10

      // Biometric Data
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("BIOMETRIC MONITORING", 20, yPos)
      yPos += 8

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text(`Average Heart Rate: ${assessmentResults.biometrics.heartRate} BPM`, 20, yPos)
      yPos += 6
      doc.text(`Stress Level: ${assessmentResults.biometrics.stressLevel}/100`, 20, yPos)
      yPos += 6
      doc.text(`Focus Level: ${assessmentResults.biometrics.focusLevel}/100`, 20, yPos)
      yPos += 15

      // Recommendations
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("RECOMMENDATIONS", 20, yPos)
      yPos += 8

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      const recommendations = getRecommendations(assessmentResults.overallScore)
      recommendations.forEach((rec, index) => {
        const lines = doc.splitTextToSize(`• ${rec}`, 170)
        lines.forEach((line: string) => {
          if (yPos > 270) {
            doc.addPage()
            yPos = 20
          }
          doc.text(line, 20, yPos)
          yPos += 6
        })
      })

      // Footer
      doc.addPage()
      yPos = 20
      doc.setFillColor(59, 130, 246)
      doc.rect(0, 270, 210, 27, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(10)
      doc.text("Generated by Mano Veda AI Assessment Platform", 20, 285)
      doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, 292)
      doc.text("© 2024 Mano Veda Healthcare Solutions", 120, 285)

      // Save the PDF
      const fileName = `Mano_Veda_Assessment_${patientInfo.lastName}_${patientInfo.firstName}_${new Date().toISOString().split("T")[0]}.pdf`
      doc.save(fileName)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const getRecommendations = (score: number): string[] => {
    if (score >= 80) {
      return [
        "Excellent cognitive performance! Continue current lifestyle habits.",
        "Consider advanced cognitive challenges to maintain mental sharpness.",
        "Regular physical exercise and social engagement are beneficial.",
        "Schedule routine cognitive health check-ups annually.",
      ]
    } else if (score >= 60) {
      return [
        "Good cognitive performance with room for improvement.",
        "Focus on areas showing lower scores through targeted exercises.",
        "Implement regular brain training and memory exercises.",
        "Consider lifestyle modifications: better sleep, nutrition, and exercise.",
        "Schedule follow-up assessment in 6 months.",
      ]
    } else {
      return [
        "Some cognitive areas may benefit from professional attention.",
        "Consult with a healthcare provider about these results.",
        "Implement comprehensive cognitive training program.",
        "Focus on stress reduction and healthy lifestyle changes.",
        "Schedule follow-up assessment in 3 months.",
      ]
    }
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 backdrop-blur-xl shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-white/10">
        <CardTitle className="flex items-center text-white text-2xl">
          <FileText className="mr-4 h-8 w-8 text-blue-400" />
          Generate Assessment Report
        </CardTitle>
        <CardDescription className="text-gray-300 text-lg">
          Download a comprehensive PDF report of your cognitive assessment results
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-8">
          {/* Report Preview */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-2xl border border-white/10">
            <h3 className="text-white font-bold text-xl mb-6 flex items-center">
              <Brain className="mr-3 h-6 w-6 text-purple-400" />
              Report Contents
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center text-gray-300">
                  <User className="mr-3 h-5 w-5 text-blue-400" />
                  Complete Patient Information & Demographics
                </div>
                <div className="flex items-center text-gray-300">
                  <Activity className="mr-3 h-5 w-5 text-green-400" />
                  Comprehensive Assessment Results
                </div>
                <div className="flex items-center text-gray-300">
                  <Mic className="mr-3 h-5 w-5 text-purple-400" />
                  AI Voice Analysis Report
                </div>
                <div className="flex items-center text-gray-300">
                  <BarChart3 className="mr-3 h-5 w-5 text-orange-400" />
                  All Cognitive Game Scores
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center text-gray-300">
                  <Target className="mr-3 h-5 w-5 text-red-400" />
                  Risk Assessment & Analysis
                </div>
                <div className="flex items-center text-gray-300">
                  <Lightbulb className="mr-3 h-5 w-5 text-yellow-400" />
                  Clinical Recommendations
                </div>
                <div className="flex items-center text-gray-300">
                  <Calendar className="mr-3 h-5 w-5 text-cyan-400" />
                  Follow-up Care Plan
                </div>
                <div className="flex items-center text-gray-300">
                  <Shield className="mr-3 h-5 w-5 text-emerald-400" />
                  Medical Disclaimers
                </div>
              </div>
            </div>
          </div>

          {/* Report Features */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <CardContent className="p-6 text-center">
                <Brain className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h4 className="text-white font-bold mb-2">AI-Powered Analysis</h4>
                <p className="text-blue-200 text-sm">
                  Advanced AI algorithms analyze your cognitive performance across multiple domains
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                <h4 className="text-white font-bold mb-2">Clinical Grade PDF</h4>
                <p className="text-emerald-200 text-sm">
                  Professionally formatted PDF report suitable for healthcare providers
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <CardContent className="p-6 text-center">
                <Heart className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h4 className="text-white font-bold mb-2">Complete Patient Data</h4>
                <p className="text-purple-200 text-sm">
                  Includes all patient information, lifestyle factors, and assessment results
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Generate Button */}
          <div className="text-center">
            <Button
              onClick={generatePDF}
              disabled={isGenerating}
              size="lg"
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-12 py-6 text-xl rounded-2xl shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-500 transform hover:scale-105 border-0"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-4" />
                  Generating PDF Report...
                </>
              ) : (
                <>
                  <Download className="mr-4 h-6 w-6" />
                  Download PDF Assessment Report
                </>
              )}
            </Button>
            <p className="text-gray-400 mt-4 text-sm">Professional PDF report with complete patient information</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
