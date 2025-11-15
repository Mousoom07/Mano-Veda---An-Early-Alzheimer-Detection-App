"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bot,
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  X,
  Minimize2,
  Maximize2,
  Sparkles,
  Brain,
  Heart,
  Lightbulb,
  Calendar,
  Activity,
  Globe,
  Phone,
  Video,
  AlertCircle,
} from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  isVoice?: boolean
}

interface Language {
  code: string
  name: string
  flag: string
  speechCode: string
}

interface MannuAssistantProps {
  currentStep?: number
  isFixed?: boolean
  onClose?: () => void
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
    greeting:
      "Hello! I'm Mannu, your AI cognitive health companion. I'm here to guide you through your assessment and provide personalized support. You can speak to me or type messages. How can I assist you today?",
    help: "I'm here to help! I can explain how cognitive tests work, provide step-by-step guidance, offer encouragement, answer brain health questions, schedule consultations, or just chat to keep you comfortable. What specific help do you need?",
    assessment:
      "This comprehensive assessment evaluates multiple cognitive domains including memory, attention, processing speed, and executive function. Each test is scientifically validated and used in clinical settings. Remember, this isn't about pass/fail - it's about understanding your unique cognitive profile!",
    time: "The complete assessment takes about 20-25 minutes total. Each individual test takes 2-3 minutes. You can take breaks between sections if needed. Focus on doing your best rather than rushing - quality over speed!",
    nervous:
      "It's completely normal to feel nervous! This assessment is designed to help you understand your cognitive health, not to judge you. Take deep breaths, relax, and remember that I'm here to support you every step of the way. You're doing great just by being here!",
    brainTips: [
      "Regular physical exercise increases blood flow to the brain and promotes neuroplasticity - even a 20-minute walk helps!",
      "Quality sleep (7-9 hours) helps consolidate memories and clear brain toxins through the glymphatic system.",
      "Eating omega-3 rich foods like fish, nuts, and seeds supports brain structure and function.",
      "Learning new skills or languages creates new neural pathways and builds cognitive reserve.",
      "Social connections and meaningful relationships are crucial for cognitive health and emotional well-being.",
      "Meditation and mindfulness practices can improve focus, reduce stress, and enhance cognitive flexibility.",
      "Staying mentally active with puzzles, reading, or creative activities keeps your brain engaged and sharp.",
      "Staying hydrated and limiting alcohol helps maintain optimal brain function and clarity."
    ],
    encouragement: [
      "You're doing wonderfully! Every step you take in this assessment provides valuable insights about your cognitive health.",
      "I believe in you! Your brain is remarkable and capable of amazing things.",
      "Remember, this isn't about perfection - it's about understanding your cognitive strengths and areas to nurture.",
      "You've got this! Take your time and trust in your abilities.",
      "I'm proud of you for taking this important step in understanding your brain health.",
      "Your effort and participation are what matter most. You're showing great dedication to your cognitive wellness!",
      "Each test you complete is building a clearer picture of your cognitive profile. You're doing excellent work!"
    ],
    schedule:
      "I can help you schedule a consultation with our healthcare professionals. We offer neurological consultations, cognitive therapy sessions, memory assessments, and general brain health check-ups. What type of appointment would you like to book?",
    consultationScheduled:
      "Excellent! I've scheduled your consultation. You'll receive a confirmation email with all the details, preparation instructions, and what to expect. Is there anything else I can help you with regarding your cognitive health?",
  },
  es: {
    greeting:
      "¡Hola! Soy Mannu, tu compañero de salud con IA. Estoy aquí para ayudarte con tu evaluación cognitiva y responder preguntas sobre la salud cerebral. Puedes hablarme o escribir mensajes. ¿Cómo puedo ayudarte hoy?",
    help: "¡Estoy aquí para ayudar! Puedo explicar cómo funcionan las pruebas cognitivas, brindar aliento, responder preguntas sobre la salud cerebral, programar consultas o charlar para mantenerte cómodo. ¿En qué necesitas ayuda?",
    assessment:
      "Esta evaluación integral evalúa memoria, atención, velocidad de procesamiento y función ejecutiva. Cada prueba está científicamente diseñada y validada. ¡No te preocupes por el rendimiento perfecto, solo haz tu mejor esfuerzo!",
    time: "La evaluación completa toma 20-25 minutos. Puedes tomar descansos entre secciones si es necesario. Enfócate en hacer tu mejor esfuerzo en lugar de apresurarte.",
    nervous:
      "¡Es completamente normal sentirse nervioso! Esta evaluación está diseñada para ayudar, no para juzgar. Respira profundo, relájate y recuerda que estoy aquí para apoyarte. ¡Lo estás haciendo genial!",
    brainTips: [
      "El ejercicio regular aumenta el flujo sanguíneo al cerebro y promueve nuevas conexiones neuronales.",
      "Dormir 7-9 horas de calidad ayuda a consolidar memorias y limpiar toxinas cerebrales.",
      "Comer alimentos ricos en ácidos grasos omega-3, como pescado y nueces, apoya la salud cerebral.",
    ],
    encouragement: [
      "¡Lo estás haciendo maravillosamente! Cada paso que das en esta evaluación es valioso.",
      "¡Creo en ti! Tu cerebro es increíble y capaz de grandes cosas.",
      "Recuerda, esto no se trata de ser perfecto - se trata de entender tus fortalezas cognitivas.",
    ],
    schedule:
      "Puedo ayudarte a programar una consulta con nuestros profesionales de la salud. ¿Qué tipo de cita te gustaría?",
    consultationScheduled:
      "¡Excelente! He programado tu consulta. Recibirás un email de confirmación con todos los detalles pronto. ¿Hay algo más en lo que pueda ayudarte?",
  },
  zh: {
    greeting:
      "你好！我是Mannu，你的AI健康伙伴。我在这里帮助你进行认知评估并回答有关大脑健康的问题。你可以对我说话或输入消息。今天我能如何帮助你？",
    help: "我在这里帮助你！我可以解释认知测试如何工作，提供鼓励，回答大脑健康问题，安排咨询，或聊天让你感到舒适。你需要什么帮助？",
    assessment:
      "这个综合评估评估记忆、注意力、处理速度和执行功能。每个测试都是科学设计和验证的。不要担心完美的表现 - 只要尽力而为！",
    time: "完整的评估需要20-25分钟。如果需要，你可以在各部分之间休息。专注于尽力而为而不是匆忙。",
    nervous: "感到紧张是完全正常的！这个评估是为了帮助，而不是评判。深呼吸，放松，记住我在这里支持你。你做得很好！",
    brainTips: [
      "定期锻炼增加大脑血流量并促进新的神经连接。",
      "获得7-9小时的优质睡眠有助于巩固记忆和清除大脑毒素。",
      "吃富含omega-3脂肪酸的食物，如鱼和坚果，支持大脑健康。",
    ],
    encouragement: [
      "你做得很棒！你在这个评估中迈出的每一步都是有价值的。",
      "我相信你！你的大脑很棒，能够做伟大的事情。",
      "记住，这不是关于完美 - 这是关于了解你的认知优势。",
    ],
    schedule: "我可以帮你安排与我们医疗专业人员的咨询。你想要什么类型的预约？",
    consultationScheduled:
      "太好了！我已经安排了你的咨询。你很快就会收到包含所有详细信息的确认邮件。还有什么我可以帮助你的吗？",
  },
  hi: {
    greeting:
      "नमस्ते! मैं मन्नू हूं, आपका AI स्वास्थ्य साथी। मैं यहां आपके संज्ञानात्मक मूल्यांकन में मदद करने और मस्तिष्क स्वास्थ्य के बारे में प्रश्नों के उत्तर देने के लिए हूं। आप मुझसे बात कर सकते हैं या संदेश टाइप कर सकते हैं। आज मैं आपकी कैसे सहायता कर सकता हूं?",
    help: "मैं मदद के लिए यहां हूं! मैं समझा सकता हूं कि संज्ञानात्मक परीक्षण कैसे काम करते हैं, प्रोत्साहन प्रदान कर सकता हूं, मस्तिष्क स्वास्थ्य के प्रश्नों के उत्तर दे सकता हूं, परामर्श शेड्यूल कर सकता हूं, या आपको आरामदायक रखने के लिए चैट कर सकता हूं। आपको किस चीज़ में मदद चाहिए?",
    assessment:
      "यह व्यापक मूल्यांकन स्मृति, ध्यान, प्रसंस्करण गति और कार्यकारी कार्य का मूल्यांकन करता है। प्रत्येक परीक्षण वैज्ञानिक रूप से डिज़ाइन और सत्यापित है। पूर्ण प्रदर्शन की चिंता न करें - बस अपना सर्वश्रेष्ठ करें!",
    time: "पूर्ण मूल्यांकन 20-25 मिनट लेता है। यदि आवश्यक हो तो आप अनुभागों के बीच ब्रेक ले सकते हैं। जल्दबाजी के बजाय अपना सर्वश्रेष्ठ करने पर ध्यान दें।",
    nervous:
      "घबराना बिल्कुल सामान्य है! यह मूल्यांकन मदद करने के लिए डिज़ाइन किया गया है, न्याय करने के लिए नहीं। गहरी सांस लें, आराम करें, और याद रखें कि मैं यहां आपका समर्थन करने के लिए हूं। आप बहुत अच्छा कर रहे हैं!",
    brainTips: [
      "नियमित व्यायाम मस्तिष्क में रक्त प्रवाह बढ़ाता है और नए तंत्रिका कनेक्शन को बढ़ावा देता है।",
      "7-9 घंटे की गुणवत्तापूर्ण नींद यादों को मजबूत बनाने और मस्तिष्क के विषाक्त पदार्थों को साफ करने में मदद करती है।",
      "ओमेगा-3 फैटी एसिड से भरपूर खाद्य पदार्थ खाना, जैसे मछली और नट्स, मस्तिष्क स्वास्थ्य का समर्थन करता है।",
    ],
    encouragement: [
      "आप अद्भुत काम कर रहे हैं! इस मूल्यांकन में आपका हर कदम मूल्यवान है।",
      "मैं आप पर विश्वास करता हूं! आपका मस्तिष्क अद्भुत है और महान चीजों में सक्षम है।",
      "याद रखें, यह पूर्ण होने के बारे में नहीं है - यह आपकी संज्ञानात्मक शक्तियों को समझने के बारे में है।",
    ],
    schedule: "मैं आपको हमारे स्वास्थ्य पेशेवरों के साथ परामर्श शेड्यूल करने में मदद कर सकता हूं। आप किस प्रकार की नियुक्ति चाहेंगे?",
    consultationScheduled:
      "बहुत बढ़िया! मैंने आपका परामर्श शेड्यूल कर दिया है। आपको जल्द ही सभी विवरणों के साथ एक पुष्टिकरण ईमेल प्राप्त होगा। क्या कुछ और है जिसमें मैं आपकी मदद कर सकता हूं?",
  },
}

export function MannuAssistant({ currentStep = 0, isFixed = false, onClose }: MannuAssistantProps) {
  const [isOpen, setIsOpen] = useState(!isFixed)
  const [isMinimized, setIsMinimized] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0])
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showScheduleOptions, setShowScheduleOptions] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)
  const [isExtrasOpen, setIsExtrasOpen] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState("")
  const [conversationContext, setConversationContext] = useState<string[]>([])
  const [userPreferences, setUserPreferences] = useState({
    hasAskedForHelp: false,
    preferredResponseStyle: 'detailed', // 'brief' | 'detailed' | 'encouraging'
    commonQuestions: [] as string[],
    strugglingAreas: [] as string[]
  })

  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize with greeting message
  useEffect(() => {
    const t = translations[currentLanguage.code as keyof typeof translations] || translations.en
    setMessages([
      {
        id: "1",
        type: "assistant",
        content: t.greeting,
        timestamp: new Date(),
      },
    ])
  }, [currentLanguage])

  // Proactive help system - offer assistance when user seems to be struggling
  useEffect(() => {
    if (currentStep > 0 && userPreferences.strugglingAreas.length > 1) {
      const timer = setTimeout(() => {
        const proactiveMessage: Message = {
          id: `proactive_${Date.now()}`,
          type: "assistant",
          content: `I notice you might be finding some of these tests challenging. That's completely normal! Would you like me to explain the current test in more detail, or would you prefer some general tips for cognitive assessments? I'm here to help make this as comfortable as possible for you.`,
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, proactiveMessage])
      }, 30000) // Offer help after 30 seconds of inactivity

      return () => clearTimeout(timer)
    }
  }, [currentStep, userPreferences.strugglingAreas])

  // Step transition help
  useEffect(() => {
    if (currentStep > 0) {
      const stepDetails = {
        1: "Voice Analysis - Just read naturally, don't worry about perfection!",
        2: "Memory Game - Take your time to study the cards before clicking.",
        3: "Attention Test - Keep your eyes on the screen and click quickly when you see the target.",
        4: "Processing Speed - Work quickly but accurately.",
        5: "Spatial Reasoning - Visualize the pattern in your mind.",
        6: "Working Memory - Hold the sequence in your memory.",
        7: "Number Sequence - Look for the mathematical pattern.",
        8: "Word Recall - Try creating mental associations.",
        9: "Trail Making - Connect numbers in order as fast as possible.",
        10: "Clock Drawing - Draw a complete clock with all numbers.",
        11: "Verbal Fluency - Say as many words as you can think of.",
        12: "MMSE - Answer each question to the best of your ability."
      }

      const stepTip = stepDetails[currentStep as keyof typeof stepDetails]
      if (stepTip && !userPreferences.hasAskedForHelp) {
        const timer = setTimeout(() => {
          const tipMessage: Message = {
            id: `tip_${currentStep}_${Date.now()}`,
            type: "assistant",
            content: `💡 Quick tip for this step: ${stepTip} Feel free to ask me any questions!`,
            timestamp: new Date(),
          }
          setMessages(prev => [...prev, tipMessage])
        }, 10000) // Show tip after 10 seconds

        return () => clearTimeout(timer)
      }
    }
  }, [currentStep, userPreferences.hasAskedForHelp])

  // Initialize speech recognition and synthesis with better error handling
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.maxAlternatives = 3
      recognitionRef.current.lang = currentLanguage.speechCode

      recognitionRef.current.onstart = () => {
        setAudioError(null)
        setInterimTranscript("")
      }

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ""
        let interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        setInterimTranscript(interimTranscript)

        if (finalTranscript) {
          handleUserMessage(finalTranscript.trim(), true)
          setInterimTranscript("")
        }
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
        setInterimTranscript("")
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
        setInterimTranscript("")

        let errorMessage = "Audio recognition error. "
        switch (event.error) {
          case "no-speech":
            errorMessage += "No speech detected. Please try speaking clearly."
            break
          case "audio-capture":
            errorMessage += "Microphone not accessible. Please check permissions."
            break
          case "not-allowed":
            errorMessage += "Microphone permission denied. Please allow microphone access."
            break
          case "network":
            errorMessage += "Network error. Please check your connection."
            break
          default:
            errorMessage += "Please try again or use text input."
        }
        setAudioError(errorMessage)
      }
    } else {
      setAudioError("Speech recognition not supported in this browser. Please use text input.")
    }

    synthRef.current = window.speechSynthesis
  }, [currentLanguage])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleUserMessage = async (content: string, isVoice = false) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: content.trim(),
      timestamp: new Date(),
      isVoice,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)
    setShowScheduleOptions(false)
    setAudioError(null)

    // Update conversation context and user preferences
    setConversationContext(prev => [...prev.slice(-4), content.trim().toLowerCase()]) // Keep last 5 messages for context
    
    // Learn from user patterns
    const input = content.trim().toLowerCase()
    if (input.includes('help') || input.includes('confused') || input.includes('don\'t understand')) {
      setUserPreferences(prev => ({ ...prev, hasAskedForHelp: true }))
    }
    
    if (input.includes('difficult') || input.includes('hard') || input.includes('struggle')) {
      setUserPreferences(prev => ({
        ...prev,
        strugglingAreas: [...prev.strugglingAreas, `step_${currentStep}`].slice(-3)
      }))
    }

    // Simulate AI response delay with more realistic timing
    setTimeout(
      () => {
        const response = generateMannuResponse(content.trim(), currentStep, currentLanguage.code, conversationContext, userPreferences)
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: response,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])
        setIsTyping(false)

        // Show schedule options if user asked about scheduling
        if (
          content.toLowerCase().includes("schedule") ||
          content.toLowerCase().includes("appointment") ||
          content.toLowerCase().includes("consultation") ||
          content.toLowerCase().includes("doctor") ||
          content.toLowerCase().includes("meeting")
        ) {
          setShowScheduleOptions(true)
        }

        // Auto-speak response if user used voice
        if (isVoice) {
          speakMessage(response)
        }
      },
      800 + Math.random() * 800,
    )
  }

  const generateMannuResponse = (userInput: string, step: number, langCode: string, context: string[] = [], preferences: any = {}): string => {
    const input = userInput.toLowerCase().trim()
    const t = translations[langCode as keyof typeof translations] || translations.en

    // Advanced step-specific context and guidance
    const stepDetails = {
      0: {
        name: "Welcome & Setup",
        description: "We're preparing to start your comprehensive cognitive assessment",
        tips: "Take your time to get comfortable. Make sure you're in a quiet environment with good lighting.",
        encouragement: "You're taking an important step in understanding your cognitive health!"
      },
      1: {
        name: "Voice Analysis",
        description: "Recording your voice to analyze speech patterns, fluency, and cognitive markers",
        tips: "Speak clearly and naturally. Don't worry about perfect pronunciation - just read at your normal pace.",
        encouragement: "Your voice patterns provide valuable insights into cognitive function. You're doing great!"
      },
      2: {
        name: "Memory Matching Game",
        description: "Testing visual memory and pattern recognition abilities",
        tips: "Try to remember the positions of matching pairs. Take a moment to study the cards before clicking.",
        encouragement: "Memory games strengthen neural pathways. Each attempt helps your brain!"
      },
      3: {
        name: "Attention Focus Test",
        description: "Measuring sustained attention and reaction time",
        tips: "Keep your eyes focused on the screen and click the target as quickly as possible when it appears.",
        encouragement: "Attention is like a muscle - this exercise is strengthening your focus!"
      },
      4: {
        name: "Processing Speed Assessment",
        description: "Evaluating how quickly you can process and respond to information",
        tips: "Work as quickly as possible while maintaining accuracy. Speed and precision both matter.",
        encouragement: "Processing speed is key to cognitive efficiency. You're building mental agility!"
      },
      5: {
        name: "Spatial Reasoning",
        description: "Testing spatial memory and pattern recognition skills",
        tips: "Visualize the pattern in your mind and try to recreate it exactly as shown.",
        encouragement: "Spatial skills are crucial for navigation and problem-solving. Great work!"
      },
      6: {
        name: "Working Memory Test",
        description: "Assessing short-term memory capacity and manipulation",
        tips: "Try to hold the sequence in your mind and recall it in the correct order.",
        encouragement: "Working memory is the foundation of complex thinking. You're exercising your mental workspace!"
      },
      7: {
        name: "Number Sequence",
        description: "Evaluating logical reasoning and pattern detection abilities",
        tips: "Look for the mathematical relationship between numbers. What's the pattern or rule?",
        encouragement: "Pattern recognition shows your brain's ability to find order and meaning. Excellent!"
      },
      8: {
        name: "Word Recall",
        description: "Testing verbal memory and recall capabilities",
        tips: "Try to create mental associations or stories to help remember the words.",
        encouragement: "Verbal memory is essential for communication and learning. You're doing wonderfully!"
      },
      9: {
        name: "Trail Making Test",
        description: "Measuring visual attention and task switching abilities",
        tips: "Connect the numbers in order as quickly as possible. Stay focused and move efficiently.",
        encouragement: "This test measures executive function - your brain's CEO skills!"
      },
      10: {
        name: "Clock Drawing",
        description: "Assessing visuospatial skills and executive function",
        tips: "Draw a complete clock face with all numbers and set the hands to the requested time.",
        encouragement: "Clock drawing integrates multiple cognitive skills. You're showing great coordination!"
      },
      11: {
        name: "Verbal Fluency",
        description: "Testing language production and executive function",
        tips: "Say as many words as you can think of in the given category. Don't worry about repetition.",
        encouragement: "Verbal fluency shows your brain's language networks in action. Keep going!"
      },
      12: {
        name: "MMSE Screening",
        description: "Comprehensive cognitive screening covering multiple domains",
        tips: "Answer each question to the best of your ability. There's no need to overthink.",
        encouragement: "The MMSE is a gold standard assessment. You're completing something really valuable!"
      }
    }

    const currentStepInfo = stepDetails[step as keyof typeof stepDetails]

    // Context awareness - check if user is repeating questions or showing patterns
    const isRepeatingQuestion = context.some(prevMsg => 
      prevMsg.includes(input.split(' ')[0]) || input.includes(prevMsg.split(' ')[0])
    )
    const hasAskedForHelp = preferences.hasAskedForHelp || input.includes('help')
    const isStruggling = preferences.strugglingAreas?.includes(`step_${step}`) || 
                        input.includes('difficult') || input.includes('hard')

    // Enhanced keyword matching with context awareness
    const patterns = {
      greeting: /\b(hello|hi|hey|good\s+(morning|afternoon|evening)|hola|你好|नमस्ते|bonjour|guten\s+tag|ciao|olá)\b/i,
      help: /\b(help|assist|support|guide|explain|confused|lost|stuck|don't\s+understand|ayuda|帮助|मदद)\b/i,
      whatIs: /\b(what\s+is|what's|tell\s+me\s+about|explain|describe)\b/i,
      howTo: /\b(how\s+to|how\s+do|how\s+does|how\s+can|instructions)\b/i,
      time: /\b(time|long|duration|how\s+much|minutes|hours|when|finish|complete|tiempo|时间|समय)\b/i,
      nervous: /\b(nervous|anxious|worried|scared|afraid|stress|panic|overwhelmed|nervioso|紧张|घबराना)\b/i,
      difficulty: /\b(difficult|hard|challenging|tough|struggle|can't\s+do|impossible|difícil|困难|कठिन)\b/i,
      score: /\b(score|result|grade|performance|how\s+am\s+i\s+doing|feedback|report|puntuación|分数|स्कोर)\b/i,
      brain: /\b(brain|memory|cognitive|mental|health|tips|improve|enhance|cerebro|大脑|मस्तिष्क)\b/i,
      encourage: /\b(encourage|motivation|confidence|boost|support|cheer|ánimo|鼓励|प्रोत्साहन)\b/i,
      schedule: /\b(schedule|appointment|consultation|doctor|meeting|book|see\s+someone|cita|预约|नियुक्ति)\b/i,
      skip: /\b(skip|pass|next|move\s+on|don't\s+want|saltar|跳过|छोड़ना)\b/i,
      repeat: /\b(repeat|again|once\s+more|didn't\s+understand|repetir|重复|दोहराना)\b/i,
      pause: /\b(pause|break|stop|wait|rest|pausa|暂停|रुकना)\b/i
    }

    // Step-specific question handling with context awareness
    if (currentStepInfo) {
      // What is this test? - Enhanced with context
      if (patterns.whatIs.test(input) && (input.includes('test') || input.includes('this') || input.includes('step'))) {
        const contextualInfo = isRepeatingQuestion ? 
          "Let me explain this differently. " : 
          hasAskedForHelp ? "Since you've been asking for help, let me be extra clear. " : ""
        return `${contextualInfo}This is the ${currentStepInfo.name}. ${currentStepInfo.description}. ${currentStepInfo.tips} ${currentStepInfo.encouragement}`
      }

      // How to do this test? - Enhanced with struggle detection
      if (patterns.howTo.test(input) && (input.includes('test') || input.includes('this') || input.includes('step'))) {
        const strugglingHelp = isStruggling ? 
          "I notice this might be challenging for you, so let me break it down step by step. " : ""
        return `${strugglingHelp}For the ${currentStepInfo.name}: ${currentStepInfo.tips} Remember, ${currentStepInfo.encouragement.toLowerCase()}`
      }

      // Test-specific difficulty help - More empathetic for struggling users
      if (patterns.difficulty.test(input)) {
        const empathy = isStruggling ? 
          "I can see you're finding this challenging, and that's completely okay. Many people do. " : ""
        return `${empathy}I understand the ${currentStepInfo.name} can be challenging. ${currentStepInfo.tips} Don't worry about perfect performance - the goal is to do your best. ${currentStepInfo.encouragement}`
      }

      // Skip/pass requests - More supportive for repeat requests
      if (patterns.skip.test(input)) {
        const supportiveMessage = isRepeatingQuestion ? 
          "I understand you really want to move on. " : ""
        return `${supportiveMessage}I understand you might want to move on, but each test in the ${currentStepInfo.name} provides valuable insights. ${currentStepInfo.encouragement} Would you like some tips to make it easier? ${currentStepInfo.tips}`
      }
    }

    // General conversation patterns
    if (patterns.greeting.test(input)) {
      const stepContext = currentStepInfo ? ` We're currently on the ${currentStepInfo.name}.` : ""
      return `Hello! I'm Mannu, your AI cognitive health companion.${stepContext} I'm here to guide you through your assessment and answer any questions. How can I help you today?`
    }

    if (patterns.help.test(input)) {
      const stepHelp = currentStepInfo ? ` For the current ${currentStepInfo.name}: ${currentStepInfo.tips}` : ""
      return `I'm here to help! I can explain how tests work, provide encouragement, answer questions about brain health, or just chat to keep you comfortable.${stepHelp} What specific help do you need?`
    }

    if (patterns.time.test(input)) {
      const stepTime = currentStepInfo ? ` The ${currentStepInfo.name} typically takes 2-3 minutes.` : ""
      return `The complete assessment takes about 20-25 minutes total.${stepTime} You can take breaks between sections if needed. Focus on doing your best rather than rushing!`
    }

    if (patterns.nervous.test(input)) {
      const stepEncouragement = currentStepInfo ? ` For the ${currentStepInfo.name}, remember: ${currentStepInfo.encouragement}` : ""
      return `It's completely normal to feel nervous! This assessment is designed to help, not judge you. Take deep breaths and remember that I'm here to support you.${stepEncouragement} You're doing great!`
    }

    if (patterns.score.test(input)) {
      return `You'll receive a comprehensive report after completing all tests, showing your cognitive strengths and areas for attention. The results include personalized recommendations and suggestions for maintaining brain health. Remember, this isn't about pass/fail - it's about understanding your unique cognitive profile!`
    }

    if (patterns.brain.test(input)) {
      const tips = [
        "Regular physical exercise increases blood flow to the brain and promotes neuroplasticity",
        "Quality sleep (7-9 hours) helps consolidate memories and clear brain toxins",
        "Eating omega-3 rich foods like fish, nuts, and seeds supports brain health",
        "Learning new skills creates new neural pathways and keeps your brain active",
        "Social connections and meaningful relationships are crucial for cognitive wellness",
        "Meditation and mindfulness can improve focus and reduce cognitive stress",
        "Staying hydrated and limiting alcohol helps maintain optimal brain function"
      ]
      const randomTip = tips[Math.floor(Math.random() * tips.length)]
      return `Here's a brain health tip: ${randomTip}. Taking this assessment is already a great step in caring for your cognitive health! Would you like more specific advice?`
    }

    if (patterns.encourage.test(input)) {
      const encouragements = [
        "You're doing wonderfully! Every step in this assessment provides valuable insights about your cognitive health.",
        "I believe in you! Your brain is remarkable and capable of amazing things.",
        "Remember, this isn't about perfection - it's about understanding your cognitive strengths and areas to nurture.",
        "You've got this! Take your time and trust in your abilities.",
        "I'm proud of you for taking this important step in understanding your brain health.",
        "Your effort and participation are what matter most. You're showing great dedication to your cognitive wellness!"
      ]
      const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)]
      const stepBoost = currentStepInfo ? ` ${currentStepInfo.encouragement}` : ""
      return `${randomEncouragement}${stepBoost} Keep going - you're making excellent progress!`
    }

    if (patterns.schedule.test(input)) {
      return `I can help you schedule a consultation with our healthcare professionals. We offer neurological consultations, cognitive therapy sessions, and general health check-ups. What type of appointment would you like to book?`
    }

    if (patterns.repeat.test(input)) {
      const stepRepeat = currentStepInfo ? ` For the ${currentStepInfo.name}: ${currentStepInfo.description}. ${currentStepInfo.tips}` : ""
      return `Of course! Let me explain again.${stepRepeat} Feel free to ask me to repeat anything you need clarification on!`
    }

    if (patterns.pause.test(input)) {
      return `Absolutely! Take all the time you need. This assessment isn't timed overall, so you can pause between sections. When you're ready to continue, just let me know. Your comfort and well-being are most important!`
    }

    // Advanced contextual responses
    if (input.includes('what') && input.includes('name')) {
      return "I'm Mannu, your AI cognitive health companion! I'm designed specifically to help with brain health assessments and provide support throughout your cognitive evaluation journey."
    }

    if (input.includes('why') && (input.includes('test') || input.includes('assessment'))) {
      return "Cognitive assessments help identify your brain's strengths and areas that might benefit from attention. Early detection and understanding of cognitive patterns can help maintain brain health and quality of life. Think of it as a wellness check for your mind!"
    }

    if (input.includes('accurate') || input.includes('reliable')) {
      return "Our assessment uses scientifically validated tests that have been used in clinical settings for decades. The AI analysis combines multiple data points including response times, accuracy patterns, and behavioral markers to provide comprehensive insights. Everything is designed with clinical precision!"
    }

    if (input.includes('privacy') || input.includes('secure') || input.includes('data')) {
      return "Your privacy is absolutely protected! All data is encrypted and stored securely. Your assessment results are confidential and only accessible to you and any healthcare providers you choose to share them with. We follow strict medical privacy standards."
    }

    // Contextual default responses based on current step
    const contextualDefaults = currentStepInfo ? [
      `That's a great question about the ${currentStepInfo.name}! ${currentStepInfo.description} How can I help you feel more comfortable with this step?`,
      `I'm here to support you through the ${currentStepInfo.name}. ${currentStepInfo.encouragement} What would you like to know?`,
      `Thanks for sharing that! During the ${currentStepInfo.name}, ${currentStepInfo.tips} Is there anything specific I can help clarify?`,
      `I appreciate you talking with me! The ${currentStepInfo.name} is an important part of understanding your cognitive health. ${currentStepInfo.encouragement} What's on your mind?`
    ] : [
      "That's an interesting point! I'm here to help make this assessment experience as comfortable and informative as possible. What would you like to know?",
      "I'm listening and here to support you! Feel free to ask me anything about the assessment, brain health, or if you just want to chat.",
      "Thanks for sharing that with me! I want to make sure you feel confident and supported throughout this process. How can I help?",
      "I appreciate you talking with me! My goal is to make this assessment both informative and comfortable for you. What's on your mind?"
    ]

    return contextualDefaults[Math.floor(Math.random() * contextualDefaults.length)]
  }

  const handleScheduleConsultation = (type: string) => {
    const t = translations[currentLanguage.code as keyof typeof translations] || translations.en

    // Simulate scheduling
    const appointmentDate = new Date()
    appointmentDate.setDate(appointmentDate.getDate() + 7) // Schedule for next week

    const consultationMessage: Message = {
      id: (Date.now() + 2).toString(),
      type: "assistant",
      content: `${t.consultationScheduled} Your ${type} consultation is scheduled for ${appointmentDate.toLocaleDateString()} at 2:00 PM.`,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, consultationMessage])
    setShowScheduleOptions(false)

    // In a real implementation, this would integrate with a scheduling system
    console.log(`Scheduling ${type} consultation for ${appointmentDate}`)
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      setAudioError(null)
      recognitionRef.current.lang = currentLanguage.speechCode
      try {
        recognitionRef.current.start()
      } catch (error) {
        console.error("Error starting recognition:", error)
        setIsListening(false)
        setAudioError("Could not start audio recognition. Please try again.")
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      setInterimTranscript("")
    }
  }

  const speakMessage = (text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = currentLanguage.speechCode
      utterance.rate = 0.9
      utterance.pitch = 1.1
      utterance.volume = 0.8

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

  const handleSendMessage = () => {
    handleUserMessage(inputMessage)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Fixed positioning for the assistant
  const containerClasses = isFixed
    ? "fixed z-50 bottom-2 left-2 right-2 sm:bottom-4 sm:right-4 sm:left-auto w-full sm:w-96 md:w-[28rem] lg:w-[32rem] max-h-[80vh]"
    : "w-full max-w-lg md:max-w-xl lg:max-w-2xl mx-auto px-2"

  return (
    <div className={containerClasses}>
      {/* Floating Action Button */}
      {isFixed && !isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="p-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-110 group fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50"
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <Bot className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          </div>
        </Button>
      )}

      {/* Main Assistant Panel */}
      {(!isFixed || isOpen) && (
        <Card className="bg-gradient-to-br from-gray-900/95 to-black/95 border border-purple-500/20 backdrop-blur-xl shadow-2xl shadow-purple-500/10 fixed bottom-3 left-2 right-2 sm:bottom-4 sm:right-4 sm:left-auto z-50 w-full sm:w-96 md:w-[28rem] lg:w-[32rem] max-h-[85vh] h-[80vh] sm:h-auto flex flex-col overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-14 h-14 sm:w-16 sm:h-16 border-2 border-purple-500/30 bg-white/5">
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Bot className="w-8 h-8 sm:w-9 sm:h-9" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-white text-xl flex items-center">
                    Mannu
                    <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  </CardTitle>
                  <p className="text-purple-300 text-sm">Your AI Health Companion</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const stepDetails = {
                      0: "Welcome! I can help explain the assessment, answer questions, or just chat to keep you comfortable.",
                      1: "Voice Analysis: Read the passage naturally at your normal pace. Don't worry about perfection!",
                      2: "Memory Game: Study the cards carefully before clicking. Take your time to remember positions.",
                      3: "Attention Test: Keep your eyes focused and click the target as quickly as possible.",
                      4: "Processing Speed: Work quickly but maintain accuracy. Both speed and precision matter.",
                      5: "Spatial Reasoning: Visualize the pattern in your mind and recreate it exactly.",
                      6: "Working Memory: Hold the sequence in your memory and recall it in correct order.",
                      7: "Number Sequence: Look for the mathematical relationship between the numbers.",
                      8: "Word Recall: Create mental associations or stories to help remember the words.",
                      9: "Trail Making: Connect numbers in order as fast as possible while staying accurate.",
                      10: "Clock Drawing: Draw a complete clock face with all numbers and set the time.",
                      11: "Verbal Fluency: Say as many words as you can in the category. Don't worry about repetition.",
                      12: "MMSE: Answer each question to the best of your ability. No need to overthink."
                    }
                    
                    const quickHelp = stepDetails[currentStep as keyof typeof stepDetails] || 
                      "I can help explain tests, provide encouragement, answer brain health questions, or schedule consultations. What do you need?"
                    
                    const helpMessage: Message = {
                      id: `quickhelp_${Date.now()}`,
                      type: "assistant",
                      content: `💡 ${quickHelp}`,
                      timestamp: new Date(),
                    }
                    setMessages(prev => [...prev, helpMessage])
                  }}
                  className="text-gray-400 hover:text-white hover:bg-gray-700/50"
                  title="Quick Help"
                >
                  <Lightbulb className="h-4 w-4" />
                </Button>
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
                      onClick={() => {
                        setIsOpen(false)
                        onClose?.()
                      }}
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
                  setAudioError(null)
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
            <CardContent className="space-y-4 flex-1 flex flex-col min-h-0">
              {/* Audio Error Display */}
              {audioError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-red-300 text-sm">{audioError}</p>
                </div>
              )}

              {/* Messages Area */}
              <ScrollArea className="flex-1 min-h-0 w-full pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.type === "user"
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                            : "bg-gradient-to-r from-gray-800/80 to-gray-700/80 text-gray-100 border border-gray-600/30"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {message.isVoice && (
                            <div className="flex items-center space-x-1">
                              <Mic className="h-3 w-3 opacity-70" />
                              <span className="text-xs opacity-70">Voice</span>
                            </div>
                          )}
                          {message.type === "assistant" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => speakMessage(message.content)}
                              className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                            >
                              <Volume2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Interim Transcript Display */}
                  {interimTranscript && (
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-blue-500/20 border border-blue-500/30 text-blue-200">
                        <p className="text-sm leading-relaxed italic">{interimTranscript}</p>
                        <span className="text-xs opacity-70">Listening...</span>
                      </div>
                    </div>
                  )}

                  {/* Schedule Options */}
                  {showScheduleOptions && (
                    <div className="flex justify-start">
                      <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 text-gray-100 border border-gray-600/30 rounded-2xl p-4 max-w-[80%]">
                        <p className="text-sm mb-3">Choose consultation type:</p>
                        <div className="space-y-2">
                          <Button
                            size="sm"
                            onClick={() => handleScheduleConsultation("Phone Consultation")}
                            className="w-full justify-start bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30"
                          >
                            <Phone className="mr-2 h-4 w-4" />
                            Phone Consultation
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleScheduleConsultation("Video Consultation")}
                            className="w-full justify-start bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30"
                          >
                            <Video className="mr-2 h-4 w-4" />
                            Video Consultation
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleScheduleConsultation("In-Person Visit")}
                            className="w-full justify-start bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            In-Person Visit
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 text-gray-100 border border-gray-600/30 rounded-2xl px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                            <div
                              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            />
                            <div
                              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            />
                          </div>
                          <span className="text-sm text-purple-300">Mannu is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Voice Controls */}
              <div className="flex items-center space-x-2 mb-4">
                <Button
                  onClick={isListening ? stopListening : startListening}
                  className={`flex-1 ${
                    isListening
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  }`}
                  disabled={!!audioError}
                >
                  {isListening ? (
                    <>
                      <MicOff className="mr-2 h-4 w-4" />
                      Stop Listening
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-4 w-4" />
                      Voice Chat
                    </>
                  )}
                </Button>

                <Button
                  onClick={isSpeaking ? stopSpeaking : () => {}}
                  variant="outline"
                  className="bg-transparent border-purple-500/20 text-white hover:bg-purple-500/10"
                  disabled={!isSpeaking}
                >
                  {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>

              {/* Voice Status */}
              {isListening && (
                <div className="flex items-center justify-center space-x-2 text-red-400 mb-4">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm">Listening... Speak clearly</span>
                  <Activity className="h-4 w-4 animate-pulse" />
                </div>
              )}

              {/* Text Input */}
              <div className="flex items-center space-x-2 sticky bottom-0 left-0 right-0 bg-gradient-to-br from-gray-900/95 to-black/95 pb-[env(safe-area-inset-bottom)] pt-2 z-10">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message to Mannu..."
                  className="flex-1 bg-gray-800/50 border-gray-600/30 text-white placeholder-gray-400 focus:border-purple-500/50"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile toggle for extras */}
              <div className="sm:hidden -mx-4 px-4">
                <button
                  type="button"
                  onClick={() => setIsExtrasOpen((v) => !v)}
                  className="w-full text-center text-xs text-purple-300 py-1 hover:text-white"
                >
                  {isExtrasOpen ? "Hide options ▲" : "More options ▼"}
                </button>
              </div>

              {/* Quick Actions */}
              <div className={`${isExtrasOpen ? 'grid' : 'hidden sm:grid'} grid-cols-2 gap-2`}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUserMessage("I need help with this test")}
                  className="bg-transparent border-blue-500/20 text-blue-300 hover:bg-blue-500/10 text-xs"
                >
                  <Lightbulb className="mr-1 h-3 w-3" />
                  Need Help
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUserMessage("Give me encouragement")}
                  className="bg-transparent border-green-500/20 text-green-300 hover:bg-green-500/10 text-xs"
                >
                  <Heart className="mr-1 h-3 w-3" />
                  Encourage Me
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUserMessage("Tell me about brain health")}
                  className="bg-transparent border-purple-500/20 text-purple-300 hover:bg-purple-500/10 text-xs"
                >
                  <Brain className="mr-1 h-3 w-3" />
                  Brain Tips
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUserMessage("Schedule appointment")}
                  className="bg-transparent border-orange-500/20 text-orange-300 hover:bg-orange-500/10 text-xs"
                >
                  <Calendar className="mr-1 h-3 w-3" />
                  Schedule
                </Button>
              </div>

              {/* Status */}
              <div className="flex items-center justify-center space-x-2 text-purple-400">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span className="text-xs">Mannu AI - Enhanced Audio & Multilingual Support</span>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  )
}
