"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bot,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MessageCircle,
  X,
  Minimize2,
  Maximize2,
  Globe,
  Lightbulb,
  RefreshCw,
  Brain,
  Sparkles,
  Calendar,
  Phone,
  Heart,
  Activity,
} from "lucide-react"

interface AIVoiceAssistantProps {
  currentStep: number
  isFixed?: boolean
  showHealthTips?: boolean
}

interface Language {
  code: string
  name: string
  flag: string
  speechCode: string
}

const languages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸", speechCode: "en-US" },
  { code: "es", name: "Español", flag: "🇪🇸", speechCode: "es-ES" },
  { code: "fr", name: "Français", flag: "🇫🇷", speechCode: "fr-FR" },
  { code: "de", name: "Deutsch", flag: "🇩🇪", speechCode: "de-DE" },
  { code: "it", name: "Italiano", flag: "🇮🇹", speechCode: "it-IT" },
  { code: "pt", name: "Português", flag: "🇵🇹", speechCode: "pt-PT" },
  { code: "zh", name: "中文", flag: "🇨🇳", speechCode: "zh-CN" },
  { code: "ja", name: "日本語", flag: "🇯🇵", speechCode: "ja-JP" },
  { code: "ko", name: "한국어", flag: "🇰🇷", speechCode: "ko-KR" },
  { code: "ar", name: "العربية", flag: "🇸🇦", speechCode: "ar-SA" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳", speechCode: "hi-IN" },
  { code: "ru", name: "Русский", flag: "🇷🇺", speechCode: "ru-RU" },
]

const translations = {
  en: {
    title: "Mano Veda AI Assistant",
    subtitle: "Your multilingual cognitive health companion",
    listening: "Listening...",
    speak: "Speak to me",
    stopListening: "Stop listening",
    playResponse: "Play response",
    stopSpeaking: "Stop speaking",
    quickQuestions: "Quick Questions",
    healthTips: "Brain Health Tips",
    schedule: "Schedule Appointment",
    minimize: "Minimize",
    maximize: "Maximize",
    close: "Close",
    questions: [
      "How does this test work?",
      "What should I expect?",
      "How long will this take?",
      "Is my data secure?",
      "Can I pause the assessment?",
      "What languages are supported?",
      "How accurate is the AI?",
      "Can family members help?",
    ],
    responses: {
      0: "Welcome! I'm here to guide you through your cognitive assessment. This comprehensive evaluation will test various aspects of your brain health including memory, attention, and processing speed across multiple languages.",
      1: "For the voice analysis, please read the passage clearly and naturally in your preferred language. I'll analyze your speech patterns, fluency, and vocal biomarkers to assess cognitive function.",
      2: "In the memory matching game, click cards to find pairs. This tests your visual memory and recognition abilities. Try to remember the positions!",
      3: "The attention test measures your focus and reaction time. Click the moving targets as quickly and accurately as possible.",
      4: "Processing speed assessment shows you symbols to compare. Respond quickly but accurately - speed and precision both matter.",
      5: "Spatial reasoning evaluates how you understand patterns and relationships. Look for the logical sequence in the shapes.",
      6: "Working memory tests your ability to hold and manipulate information. Remember the sequence and enter it in reverse order.",
      7: "Number sequence tests logical thinking. Look for mathematical patterns between the numbers.",
      8: "Word recall evaluates verbal memory. Study the words carefully, then try to remember as many as possible.",
      9: "Trail making tests visual attention and task switching. Connect the numbers in order as quickly as possible.",
      10: "Clock drawing assesses visuospatial and executive function. Draw a complete clock showing the specified time.",
      11: "Verbal fluency measures language production. Name as many animals as you can - don't worry about repetition.",
      12: "The MMSE is a cognitive screening tool. Answer each question to the best of your ability.",
      default:
        "I'm here to help you through your cognitive assessment in your preferred language. Feel free to ask me any questions!",
    },
    healthTips: [
      "🧠 Exercise regularly - Physical activity increases blood flow to the brain and promotes neuroplasticity.",
      "🥗 Eat brain-healthy foods - Omega-3 fatty acids, antioxidants, and vitamins support cognitive function.",
      "😴 Get quality sleep - 7-9 hours of sleep helps consolidate memories and clear brain toxins.",
      "🧘 Practice meditation - Mindfulness reduces stress and improves attention and memory.",
      "📚 Keep learning - Challenge your brain with new skills, languages, or hobbies.",
      "👥 Stay socially connected - Social interaction stimulates cognitive function and emotional well-being.",
      "💧 Stay hydrated - Even mild dehydration can affect concentration and memory.",
      "🚭 Avoid smoking - Smoking reduces blood flow to the brain and increases cognitive decline risk.",
      "🍷 Limit alcohol - Excessive alcohol consumption can damage brain cells and impair memory.",
      "🎵 Listen to music - Music can improve mood, reduce stress, and enhance cognitive performance.",
      "🌍 Learn new languages - Bilingualism can delay cognitive decline and improve brain plasticity.",
      "🎯 Practice mindfulness - Regular meditation can increase gray matter density in memory areas.",
    ],
    scheduleMessages: [
      "Schedule a follow-up consultation with our specialists",
      "Book a comprehensive neurological evaluation",
      "Arrange family counseling session",
      "Set up regular monitoring appointments",
    ],
  },
  es: {
    title: "Asistente IA Mano Veda",
    subtitle: "Tu compañero multilingüe de salud cognitiva",
    listening: "Escuchando...",
    speak: "Háblame",
    stopListening: "Dejar de escuchar",
    playResponse: "Reproducir respuesta",
    stopSpeaking: "Dejar de hablar",
    quickQuestions: "Preguntas Rápidas",
    healthTips: "Consejos de Salud Cerebral",
    schedule: "Programar Cita",
    minimize: "Minimizar",
    maximize: "Maximizar",
    close: "Cerrar",
    questions: [
      "¿Cómo funciona esta prueba?",
      "¿Qué debo esperar?",
      "¿Cuánto tiempo tomará?",
      "¿Están seguros mis datos?",
      "¿Puedo pausar la evaluación?",
      "¿Qué idiomas son compatibles?",
      "¿Qué tan precisa es la IA?",
      "¿Pueden ayudar los familiares?",
    ],
    responses: {
      0: "¡Bienvenido! Estoy aquí para guiarte a través de tu evaluación cognitiva. Esta evaluación integral probará varios aspectos de tu salud cerebral en múltiples idiomas.",
      1: "Para el análisis de voz, lee el pasaje con claridad y naturalidad en tu idioma preferido. Analizaré tus patrones de habla y fluidez.",
      2: "En el juego de memoria, haz clic en las cartas para encontrar pares. Esto prueba tu memoria visual.",
      default:
        "Estoy aquí para ayudarte con tu evaluación cognitiva en tu idioma preferido. ¡Siéntete libre de hacerme preguntas!",
    },
    healthTips: [
      "🧠 Ejercítate regularmente - La actividad física aumenta el flujo sanguíneo al cerebro.",
      "🥗 Come alimentos saludables para el cerebro - Los omega-3 y antioxidantes apoyan la función cognitiva.",
      "😴 Duerme bien - 7-9 horas de sueño ayudan a consolidar memorias.",
      "🌍 Aprende nuevos idiomas - El bilingüismo puede retrasar el deterioro cognitivo.",
    ],
    scheduleMessages: [
      "Programa una consulta de seguimiento con nuestros especialistas",
      "Reserva una evaluación neurológica integral",
      "Organiza una sesión de consejería familiar",
      "Configura citas de monitoreo regular",
    ],
  },
  zh: {
    title: "Mano Veda AI 助手",
    subtitle: "您的多语言认知健康伙伴",
    listening: "正在聆听...",
    speak: "请说话",
    stopListening: "停止聆听",
    playResponse: "播放回复",
    stopSpeaking: "停止播放",
    quickQuestions: "快速问题",
    healthTips: "大脑健康提示",
    schedule: "预约安排",
    minimize: "最小化",
    maximize: "最大化",
    close: "关闭",
    questions: [
      "这个测试是如何工作的？",
      "我应该期待什么？",
      "需要多长时间？",
      "我的数据安全吗？",
      "我可以暂停评估吗？",
      "支持哪些语言？",
      "AI的准确性如何？",
      "家人可以帮助吗？",
    ],
    responses: {
      0: "欢迎！我在这里指导您完成认知评估。这项综合评估将测试您大脑健康的各个方面，支持多种语言。",
      default: "我在这里帮助您完成认知评估，支持您的首选语言。请随时向我提问！",
    },
    healthTips: [
      "🧠 定期锻炼 - 体育活动增加大脑血流量并促进神经可塑性。",
      "🥗 吃健脑食物 - Omega-3脂肪酸、抗氧化剂和维生素支持认知功能。",
      "😴 获得优质睡眠 - 7-9小时的睡眠有助于巩固记忆和清除大脑毒素。",
      "🌍 学习新语言 - 双语能力可以延缓认知衰退。",
    ],
    scheduleMessages: ["安排与我们专家的后续咨询", "预约综合神经评估", "安排家庭咨询会议", "设置定期监测预约"],
  },
  hi: {
    title: "मनो वेद AI सहायक",
    subtitle: "आपका बहुभाषी संज्ञानात्मक स्वास्थ्य साथी",
    listening: "सुन रहा है...",
    speak: "मुझसे बात करें",
    stopListening: "सुनना बंद करें",
    playResponse: "उत्तर चलाएं",
    stopSpeaking: "बोलना बंद करें",
    quickQuestions: "त्वरित प्रश्न",
    healthTips: "मस्तिष्क स्वास्थ्य सुझाव",
    schedule: "अपॉइंटमेंट शेड्यूल करें",
    minimize: "छोटा करें",
    maximize: "बड़ा करें",
    close: "बंद करें",
    questions: [
      "यह परीक्षा कैसे काम करती है?",
      "मुझे क्या उम्मीद करनी चाहिए?",
      "इसमें कितना समय लगेगा?",
      "क्या मेरा डेटा सुरक्षित है?",
      "क्या मैं मूल्यांकन रोक सकता हूं?",
      "कौन सी भाषाएं समर्थित हैं?",
      "AI कितना सटीक है?",
      "क्या परिवार के सदस्य मदद कर सकते हैं?",
    ],
    responses: {
      0: "स्वागत है! मैं आपके संज्ञानात्मक मूल्यांकन में आपका मार्गदर्शन करने के लिए यहां हूं। यह व्यापक मूल्यांकन कई भाषाओं में आपके मस्तिष्क स्वास्थ्य के विभिन्न पहलुओं का परीक्षण करेगा।",
      default: "मैं आपकी पसंदीदा भाषा में संज्ञानात्मक मूल्यांकन में आपकी सहायता के लिए यहां हूं। कृपया मुझसे कोई भी प्रश्न पूछने में संकोच न करें!",
    },
    healthTips: [
      "🧠 नियमित व्यायाम करें - शारीरिक गतिविधि मस्तिष्क में रक्त प्रवाह बढ़ाती है।",
      "🥗 मस्तिष्क-स्वस्थ भोजन खाएं - ओमेगा-3 और एंटीऑक्सिडेंट संज्ञानात्मक कार्य का समर्थन करते हैं।",
      "😴 गुणवत्तापूर्ण नींद लें - 7-9 घंटे की नींद यादों को मजबूत बनाने में मदद करती है।",
      "🌍 नई भाषाएं सीखें - द्विभाषिकता संज्ञानात्मक गिरावट में देरी कर सकती है।",
    ],
    scheduleMessages: [
      "हमारे विशेषज्ञों के साथ फॉलो-अप परामर्श शेड्यूल करें",
      "व्यापक न्यूरोलॉजिकल मूल्यांकन बुक करें",
      "पारिवारिक परामर्श सत्र की व्यवस्था करें",
      "नियमित निगरानी अपॉइंटमेंट सेट करें",
    ],
  },
}

export function AIVoiceAssistant({ currentStep, isFixed = false, showHealthTips = false }: AIVoiceAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0])
  const [showTips, setShowTips] = useState(false)
  const [currentTip, setCurrentTip] = useState(0)
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("")
  const [isSupported, setIsSupported] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)

  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    setIsSupported(!!SpeechRecognition && !!window.speechSynthesis)

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = currentLanguage.speechCode

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setTranscript(transcript)
        handleUserInput(transcript)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
      }
    }

    synthRef.current = window.speechSynthesis
  }, [currentLanguage])

  const handleUserInput = (input: string) => {
    const t = translations[currentLanguage.code as keyof typeof translations] || translations.en
    let response = t.responses[currentStep as keyof typeof t.responses] || t.responses.default

    // Enhanced keyword matching for multilingual support
    const lowerInput = input.toLowerCase()
    if (
      lowerInput.includes("help") ||
      lowerInput.includes("ayuda") ||
      lowerInput.includes("帮助") ||
      lowerInput.includes("मदद")
    ) {
      response =
        "I'm here to help! You can ask me about any part of the assessment, or I can provide brain health tips in your preferred language."
    } else if (
      lowerInput.includes("time") ||
      lowerInput.includes("tiempo") ||
      lowerInput.includes("时间") ||
      lowerInput.includes("समय")
    ) {
      response = "The complete assessment takes about 20-25 minutes. You can take breaks between sections if needed."
    } else if (
      lowerInput.includes("data") ||
      lowerInput.includes("datos") ||
      lowerInput.includes("数据") ||
      lowerInput.includes("डेटा") ||
      lowerInput.includes("privacy")
    ) {
      response =
        "Your data is completely secure and encrypted. We follow HIPAA compliance and never share your information without consent."
    } else if (
      lowerInput.includes("language") ||
      lowerInput.includes("idioma") ||
      lowerInput.includes("语言") ||
      lowerInput.includes("भाषा")
    ) {
      response =
        "We support 12+ languages including English, Spanish, Mandarin, Hindi, Arabic, French, German, Japanese, Korean, Portuguese, Italian, and Russian."
    } else if (
      lowerInput.includes("schedule") ||
      lowerInput.includes("appointment") ||
      lowerInput.includes("cita") ||
      lowerInput.includes("预约") ||
      lowerInput.includes("अपॉइंटमेंट")
    ) {
      setShowSchedule(true)
      response =
        "I can help you schedule an appointment with our healthcare professionals. What type of consultation would you like?"
    }

    setResponse(response)
    speakResponse(response)
  }

  const startListening = () => {
    if (recognitionRef.current && isSupported) {
      setIsListening(true)
      setTranscript("")
      recognitionRef.current.lang = currentLanguage.speechCode
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }

  const speakResponse = (text: string) => {
    if (synthRef.current && isSupported) {
      // Stop any current speech
      synthRef.current.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = currentLanguage.speechCode
      utterance.rate = 0.9
      utterance.pitch = 1

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      synthRef.current.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const handleQuickQuestion = (question: string) => {
    setTranscript(question)
    handleUserInput(question)
  }

  const getRandomTip = () => {
    const t = translations[currentLanguage.code as keyof typeof translations] || translations.en
    const randomIndex = Math.floor(Math.random() * t.healthTips.length)
    setCurrentTip(randomIndex)
    const tip = t.healthTips[randomIndex]
    setResponse(tip)
    speakResponse(tip)
  }

  const handleScheduleAppointment = (type: string) => {
    const t = translations[currentLanguage.code as keyof typeof translations] || translations.en
    const message = t.scheduleMessages[Math.floor(Math.random() * t.scheduleMessages.length)]

    // Simulate scheduling functionality
    const appointmentDate = new Date()
    appointmentDate.setDate(appointmentDate.getDate() + 7) // Schedule for next week

    const scheduledResponse = `${message}. I've scheduled your appointment for ${appointmentDate.toLocaleDateString()} at 2:00 PM. You'll receive a confirmation email shortly.`
    setResponse(scheduledResponse)
    speakResponse(scheduledResponse)
    setShowSchedule(false)

    // In a real implementation, this would integrate with a scheduling system
    console.log(`Scheduling ${type} appointment for ${appointmentDate}`)
  }

  const t = translations[currentLanguage.code as keyof typeof translations] || translations.en

  if (!isSupported) {
    return null // Don't render if speech APIs aren't supported
  }

  // Fixed positioning for the assistant
  const containerClasses = isFixed ? "fixed bottom-6 right-6 z-50 w-96" : "w-full max-w-md mx-auto"

  return (
    <div className={containerClasses}>
      {/* Floating Action Button */}
      {isFixed && !isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-110"
        >
          <Bot className="h-8 w-8 text-white" />
        </Button>
      )}

      {/* Main Assistant Panel */}
      {(!isFixed || isOpen) && (
        <Card className="bg-gradient-to-br from-gray-900/95 to-black/95 border border-purple-500/20 backdrop-blur-xl shadow-2xl shadow-purple-500/10">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-lg">{t.title}</CardTitle>
                  <p className="text-purple-300 text-sm">{t.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {isFixed && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="text-gray-400 hover:text-white"
                    >
                      {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center space-x-2 mt-4">
              <Globe className="h-4 w-4 text-purple-400" />
              <Select
                value={currentLanguage.code}
                onValueChange={(value) => {
                  const lang = languages.find((l) => l.code === value) || languages[0]
                  setCurrentLanguage(lang)
                }}
              >
                <SelectTrigger className="w-full bg-gray-800/50 border-purple-500/20 text-white">
                  <SelectValue>
                    <span className="flex items-center space-x-2">
                      <span>{currentLanguage.flag}</span>
                      <span>{currentLanguage.name}</span>
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-purple-500/20">
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code} className="text-white hover:bg-gray-700">
                      <span className="flex items-center space-x-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className="space-y-6">
              {/* Voice Controls */}
              <div className="flex space-x-2">
                <Button
                  onClick={isListening ? stopListening : startListening}
                  className={`flex-1 ${
                    isListening
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="mr-2 h-4 w-4" />
                      {t.stopListening}
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-4 w-4" />
                      {t.speak}
                    </>
                  )}
                </Button>

                <Button
                  onClick={isSpeaking ? stopSpeaking : () => speakResponse(response)}
                  variant="outline"
                  className="bg-transparent border-purple-500/20 text-white hover:bg-purple-500/10"
                  disabled={!response}
                >
                  {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>

              {/* Status */}
              {isListening && (
                <div className="flex items-center justify-center space-x-2 text-red-400">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm">{t.listening}</span>
                </div>
              )}

              {/* Transcript */}
              {transcript && (
                <div className="bg-gray-800/50 p-3 rounded-lg border border-purple-500/20">
                  <p className="text-sm text-gray-300">
                    <strong>You:</strong> {transcript}
                  </p>
                </div>
              )}

              {/* Response */}
              {response && (
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-3 rounded-lg border border-purple-500/20">
                  <p className="text-sm text-white">
                    <strong>Mano Veda AI:</strong> {response}
                  </p>
                </div>
              )}

              {/* Schedule Appointment Options */}
              {showSchedule && (
                <div className="space-y-3">
                  <h4 className="text-white font-medium flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-blue-400" />
                    {t.schedule}
                  </h4>
                  <div className="space-y-2">
                    {[
                      { type: "consultation", icon: Phone, label: "Phone Consultation" },
                      { type: "evaluation", icon: Brain, label: "Neurological Evaluation" },
                      { type: "family", icon: Heart, label: "Family Counseling" },
                      { type: "monitoring", icon: Activity, label: "Regular Monitoring" },
                    ].map((option) => (
                      <Button
                        key={option.type}
                        variant="outline"
                        size="sm"
                        onClick={() => handleScheduleAppointment(option.type)}
                        className="w-full text-left justify-start bg-transparent border-blue-500/20 text-gray-300 hover:bg-blue-500/10 hover:text-white text-xs"
                      >
                        <option.icon className="mr-2 h-4 w-4" />
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Questions */}
              <div className="space-y-3">
                <h4 className="text-white font-medium flex items-center">
                  <MessageCircle className="mr-2 h-4 w-4 text-purple-400" />
                  {t.quickQuestions}
                </h4>
                <div className="space-y-2">
                  {t.questions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickQuestion(question)}
                      className="w-full text-left justify-start bg-transparent border-purple-500/20 text-gray-300 hover:bg-purple-500/10 hover:text-white text-xs"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Health Tips */}
              {showHealthTips && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-medium flex items-center">
                      <Lightbulb className="mr-2 h-4 w-4 text-yellow-400" />
                      {t.healthTips}
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={getRandomTip}
                      className="text-yellow-400 hover:text-yellow-300"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-3 rounded-lg border border-yellow-500/20">
                    <p className="text-sm text-yellow-100">{t.healthTips[currentTip]}</p>
                  </div>
                </div>
              )}

              {/* Schedule Button */}
              <div className="space-y-3">
                <Button
                  onClick={() => setShowSchedule(!showSchedule)}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {t.schedule}
                </Button>
              </div>

              {/* Current Step Context */}
              <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-300 text-sm font-medium">Current Step Context</span>
                </div>
                <p className="text-xs text-blue-200">
                  {t.responses[currentStep as keyof typeof t.responses] || t.responses.default}
                </p>
              </div>

              {/* AI Status */}
              <div className="flex items-center justify-center space-x-2 text-purple-400">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span className="text-xs">Mano Veda AI - Multilingual Support Active</span>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  )
}
