export interface AssessmentQuestion {
  id: string
  category: string
  question: string
  description?: string
  type: "multiple-choice" | "text" | "scale"
  options?: string[]
  required: boolean
}

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: "memory-1",
    category: "Memory Assessment",
    question: "How often do you forget recent conversations or events?",
    type: "multiple-choice",
    options: [
      "Never",
      "Rarely (less than once a month)",
      "Sometimes (once a month)",
      "Often (once a week)",
      "Very often (daily)",
    ],
    required: true,
  },
  {
    id: "memory-2",
    category: "Memory Assessment",
    question: "Do you have difficulty remembering names of familiar people?",
    type: "multiple-choice",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
    required: true,
  },
  {
    id: "language-1",
    category: "Language Skills",
    question: "How would you rate your ability to find the right words when speaking?",
    type: "scale",
    required: true,
  },
  {
    id: "language-2",
    category: "Language Skills",
    question: "Do you have trouble following conversations in groups?",
    type: "multiple-choice",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
    required: true,
  },
  {
    id: "attention-1",
    category: "Attention & Focus",
    question: "How often do you lose track of what you were doing?",
    type: "multiple-choice",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very often"],
    required: true,
  },
  {
    id: "attention-2",
    category: "Attention & Focus",
    question: "Rate your ability to concentrate on tasks for extended periods",
    type: "scale",
    required: true,
  },
  {
    id: "executive-1",
    category: "Executive Function",
    question: "How difficult is it for you to plan and organize daily activities?",
    type: "multiple-choice",
    options: [
      "Not difficult at all",
      "Slightly difficult",
      "Moderately difficult",
      "Very difficult",
      "Extremely difficult",
    ],
    required: true,
  },
  {
    id: "executive-2",
    category: "Executive Function",
    question: "Do you have trouble making decisions that you used to make easily?",
    type: "multiple-choice",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
    required: true,
  },
  {
    id: "spatial-1",
    category: "Spatial Awareness",
    question: "How often do you get lost in familiar places?",
    type: "multiple-choice",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very often"],
    required: true,
  },
  {
    id: "additional-concerns",
    category: "Additional Information",
    question: "Please describe any other cognitive concerns or symptoms you have noticed",
    description: "This information will help provide a more comprehensive assessment",
    type: "text",
    required: false,
  },
]

export const assessmentCategories = [
  "Memory Assessment",
  "Language Skills",
  "Attention & Focus",
  "Executive Function",
  "Spatial Awareness",
  "Additional Information",
]

export interface AssessmentResult {
  category: string
  score: number
  maxScore: number
  riskLevel: "Low" | "Moderate" | "High"
  recommendations: string[]
}

export const calculateAssessmentResults = (responses: any[]): AssessmentResult[] => {
  const categoryScores: { [key: string]: { score: number; maxScore: number } } = {}

  responses.forEach((response) => {
    const question = assessmentQuestions.find((q) => q.id === response.questionId)
    if (!question) return

    if (!categoryScores[question.category]) {
      categoryScores[question.category] = { score: 0, maxScore: 0 }
    }

    let score = 0
    if (question.type === "multiple-choice" && question.options) {
      score = question.options.indexOf(response.answer)
    } else if (question.type === "scale") {
      score = Number.parseInt(response.answer) - 1
    }

    categoryScores[question.category].score += score
    categoryScores[question.category].maxScore += question.type === "scale" ? 4 : (question.options?.length || 1) - 1
  })

  return Object.entries(categoryScores).map(([category, { score, maxScore }]) => {
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0
    let riskLevel: "Low" | "Moderate" | "High" = "Low"
    let recommendations: string[] = []

    if (percentage > 60) {
      riskLevel = "High"
      recommendations = [
        "Consult with a neurologist or memory specialist",
        "Consider comprehensive neuropsychological testing",
        "Discuss symptoms with primary care physician",
      ]
    } else if (percentage > 30) {
      riskLevel = "Moderate"
      recommendations = [
        "Monitor symptoms closely",
        "Consider follow-up assessment in 6 months",
        "Maintain healthy lifestyle habits",
      ]
    } else {
      recommendations = [
        "Continue regular health check-ups",
        "Maintain cognitive activities",
        "Follow healthy lifestyle practices",
      ]
    }

    return {
      category,
      score,
      maxScore,
      riskLevel,
      recommendations,
    }
  })
}
