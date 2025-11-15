"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Brain,
  User,
  Calendar,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  ArrowRight,
  Sparkles,
  Cigarette,
  Wine,
  Activity,
  Stethoscope,
  Users,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface PatientInfo {
  // Basic Information
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

  // Demographics & Background
  education: string
  occupation: string
  maritalStatus: string
  primaryLanguage: string
  ethnicity: string

  // Medical History
  medicalHistory: string
  currentMedications: string
  allergies: string
  previousCognitiveAssessments: string
  familyHistoryDementia: string
  neurologicalConditions: string
  psychiatricHistory: string

  // Lifestyle Factors
  smokingStatus: string
  smokingHistory: string
  alcoholConsumption: string
  alcoholHistory: string
  exerciseFrequency: string
  sleepHours: string
  sleepQuality: string
  dietType: string

  // Cognitive Concerns
  memoryComplaints: string
  cognitiveSymptoms: string[]
  symptomDuration: string
  functionalImpact: string

  // Emergency Contact
  emergencyContactName: string
  emergencyContactRelation: string
  emergencyContactPhone: string
  emergencyContactEmail: string

  // Consent & Privacy
  consentResearch: boolean
  consentDataSharing: boolean
  privacyAgreement: boolean
}

export default function PatientInfoPage() {
  const router = useRouter()
  const [currentSection, setCurrentSection] = useState(0)
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    education: "",
    occupation: "",
    maritalStatus: "",
    primaryLanguage: "",
    ethnicity: "",
    medicalHistory: "",
    currentMedications: "",
    allergies: "",
    previousCognitiveAssessments: "",
    familyHistoryDementia: "",
    neurologicalConditions: "",
    psychiatricHistory: "",
    smokingStatus: "",
    smokingHistory: "",
    alcoholConsumption: "",
    alcoholHistory: "",
    exerciseFrequency: "",
    sleepHours: "",
    sleepQuality: "",
    dietType: "",
    memoryComplaints: "",
    cognitiveSymptoms: [],
    symptomDuration: "",
    functionalImpact: "",
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",
    emergencyContactEmail: "",
    consentResearch: false,
    consentDataSharing: false,
    privacyAgreement: false,
  })

  const [errors, setErrors] = useState<Partial<PatientInfo>>({})

  const sections = [
    {
      title: "Basic Information",
      icon: User,
      description: "Personal details and contact information",
    },
    {
      title: "Demographics & Background",
      icon: GraduationCap,
      description: "Education, occupation, and cultural background",
    },
    {
      title: "Medical History",
      icon: Stethoscope,
      description: "Health conditions, medications, and family history",
    },
    {
      title: "Lifestyle Factors",
      icon: Activity,
      description: "Smoking, alcohol, exercise, and sleep habits",
    },
    {
      title: "Cognitive Concerns",
      icon: Brain,
      description: "Memory complaints and cognitive symptoms",
    },
    {
      title: "Emergency Contact",
      icon: Users,
      description: "Emergency contact information",
    },
    {
      title: "Consent & Privacy",
      icon: Shield,
      description: "Research consent and privacy agreements",
    },
  ]

  const cognitiveSymptomOptions = [
    "Memory problems",
    "Difficulty concentrating",
    "Word-finding difficulties",
    "Getting lost in familiar places",
    "Difficulty with complex tasks",
    "Mood changes",
    "Personality changes",
    "Sleep disturbances",
    "Confusion about time/place",
    "Difficulty with numbers/calculations",
  ]

  const handleInputChange = (field: keyof PatientInfo, value: string | boolean | string[]) => {
    setPatientInfo((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }

    // Auto-calculate age from date of birth
    if (field === "dateOfBirth" && typeof value === "string" && value) {
      const birthDate = new Date(value)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        setPatientInfo((prev) => ({ ...prev, age: (age - 1).toString() }))
      } else {
        setPatientInfo((prev) => ({ ...prev, age: age.toString() }))
      }
    }
  }

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    const currentSymptoms = patientInfo.cognitiveSymptoms
    if (checked) {
      handleInputChange("cognitiveSymptoms", [...currentSymptoms, symptom])
    } else {
      handleInputChange(
        "cognitiveSymptoms",
        currentSymptoms.filter((s) => s !== symptom),
      )
    }
  }

  const validateCurrentSection = (): boolean => {
    const newErrors: Partial<PatientInfo> = {}

    switch (currentSection) {
      case 0: // Basic Information
        if (!patientInfo.firstName.trim()) newErrors.firstName = "First name is required"
        if (!patientInfo.lastName.trim()) newErrors.lastName = "Last name is required"
        if (!patientInfo.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
        if (!patientInfo.gender) newErrors.gender = "Gender is required"
        if (!patientInfo.email.trim()) {
          newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(patientInfo.email)) {
          newErrors.email = "Please enter a valid email address"
        }
        break
      case 6: // Consent & Privacy
        if (!patientInfo.privacyAgreement) {
          newErrors.privacyAgreement = "You must agree to the privacy policy" as any
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextSection = () => {
    if (validateCurrentSection() && currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateCurrentSection()) {
      // Save patient info to localStorage
      localStorage.setItem("patientInfo", JSON.stringify(patientInfo))

      // Redirect to assessment
      router.push("/assessment")
    }
  }

  const renderSectionContent = () => {
    switch (currentSection) {
      case 0: // Basic Information
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white font-medium">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  value={patientInfo.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="bg-gray-800/50 border-white/20 text-white placeholder-gray-400"
                  placeholder="Enter your first name"
                />
                {errors.firstName && <p className="text-red-400 text-sm">{errors.firstName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white font-medium">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  value={patientInfo.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="bg-gray-800/50 border-white/20 text-white placeholder-gray-400"
                  placeholder="Enter your last name"
                />
                {errors.lastName && <p className="text-red-400 text-sm">{errors.lastName}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-white font-medium flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Date of Birth *
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={patientInfo.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  className="bg-gray-800/50 border-white/20 text-white"
                />
                {errors.dateOfBirth && <p className="text-red-400 text-sm">{errors.dateOfBirth}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-white font-medium">
                  Age
                </Label>
                <Input
                  id="age"
                  value={patientInfo.age}
                  className="bg-gray-800/50 border-white/20 text-white placeholder-gray-400"
                  placeholder="Auto-calculated"
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-white font-medium">
                  Gender *
                </Label>
                <Select value={patientInfo.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                  <SelectTrigger className="bg-gray-800/50 border-white/20 text-white">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-white/20">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-red-400 text-sm">{errors.gender}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={patientInfo.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-gray-800/50 border-white/20 text-white placeholder-gray-400"
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white font-medium flex items-center">
                  <Phone className="mr-2 h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={patientInfo.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="bg-gray-800/50 border-white/20 text-white placeholder-gray-400"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-white font-medium flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                Street Address
              </Label>
              <Input
                id="address"
                value={patientInfo.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="bg-gray-800/50 border-white/20 text-white placeholder-gray-400"
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-white font-medium">
                  City
                </Label>
                <Input
                  id="city"
                  value={patientInfo.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="bg-gray-800/50 border-white/20 text-white placeholder-gray-400"
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="text-white font-medium">
                  State/Province
                </Label>
                <Input
                  id="state"
                  value={patientInfo.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className="bg-gray-800/50 border-white/20 text-white placeholder-gray-400"
                  placeholder="State"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode" className="text-white font-medium">
                  ZIP Code
                </Label>
                <Input
                  id="zipCode"
                  value={patientInfo.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  className="bg-gray-800/50 border-white/20 text-white placeholder-gray-400"
                  placeholder="12345"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-white font-medium">
                  Country
                </Label>
                <Input
                  id="country"
                  value={patientInfo.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className="bg-gray-800/50 border-white/20 text-white placeholder-gray-400"
                  placeholder="Country"
                />
              </div>
            </div>
          </div>
        )

      case 1: // Demographics & Background
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="education" className="text-white font-medium">
                  Education Level
                </Label>
                <Select value={patientInfo.education} onValueChange={(value) => handleInputChange("education", value)}>
                  <SelectTrigger className="bg-gray-800/50 border-white/20 text-white">
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-white/20">
                    <SelectItem value="less-than-high-school">Less than High School</SelectItem>
                    <SelectItem value="high-school">High School Diploma/GED</SelectItem>
                    <SelectItem value="some-college">Some College</SelectItem>
                    <SelectItem value="associates">Associate's Degree</SelectItem>
                    <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                    <SelectItem value="masters">Master's Degree</SelectItem>
                    <SelectItem value="doctorate">Doctorate/PhD</SelectItem>
                    <SelectItem value="professional">Professional Degree</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation" className="text-white font-medium">
                  Current/Previous Occupation
                </Label>
                <Input
                  id="occupation"
                  value={patientInfo.occupation}
                  onChange={(e) => handleInputChange("occupation", e.target.value)}
                  className="bg-gray-800/50 border-white/20 text-white placeholder-gray-400"
                  placeholder="e.g., Teacher, Engineer, Retired"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="maritalStatus" className="text-white font-medium">
                  Marital Status
                </Label>
                <Select
                  value={patientInfo.maritalStatus}
                  onValueChange={(value) => handleInputChange("maritalStatus", value)}
                >
                  <SelectTrigger className="bg-gray-800/50 border-white/20 text-white">
                    <SelectValue placeholder="Select marital status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-white/20">
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                    <SelectItem value="separated">Separated</SelectItem>
                    <SelectItem value="domestic-partner">Domestic Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryLanguage" className="text-white font-medium">
                  Primary Language
                </Label>
                <Input
                  id="primaryLanguage"
                  value={patientInfo.primaryLanguage}
                  onChange={(e) => handleInputChange("primaryLanguage", e.target.value)}
                  className="bg-gray-800/50 border-white/20 text-white placeholder-gray-400"
                  placeholder="e.g., English, Spanish, French"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ethnicity" className="text-white font-medium">
                Ethnicity (Optional)
              </Label>
              <Select value={patientInfo.ethnicity} onValueChange={(value) => handleInputChange("ethnicity", value)}>
                <SelectTrigger className="bg-gray-800/50 border-white/20 text-white">
                  <SelectValue placeholder="Select ethnicity" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-white/20">
                  <SelectItem value="white">White/Caucasian</SelectItem>
                  <SelectItem value="black">Black/African American</SelectItem>
                  <SelectItem value="hispanic">Hispanic/Latino</SelectItem>
                  <SelectItem value="asian">Asian</SelectItem>
                  <SelectItem value="native-american">Native American</SelectItem>
                  <SelectItem value="pacific-islander">Pacific Islander</SelectItem>
                  <SelectItem value="mixed">Mixed Race</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 2: // Medical History
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="medicalHistory" className="text-white font-medium">
                Medical History
              </Label>
              <Textarea
                id="medicalHistory"
                value={patientInfo.medicalHistory}
                onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                className="bg-gray-800/50 border-white/20 text-white placeholder-gray-400 min-h-24"
                placeholder="Please list any significant medical conditions, surgeries, or hospitalizations..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentMedications" className="text-white font-medium">
                Current Medications
              </Label>
              <Textarea
                id="currentMedications"
                value={patientInfo.currentMedications}
                onChange={(e) => handleInputChange("currentMedications", e.target.value)}
                className="bg-gray-800/50 border-white/20 text-white placeholder-gray-400 min-h-24"
                placeholder="List all medications you are currently taking, including dosages..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies" className="text-white font-medium">
                Allergies
              </Label>
              <Textarea
                id="allergies"
                value={patientInfo.allergies}
                onChange={(e) => handleInputChange("allergies", e.target.value)}
                className="bg-gray-800/50 border-white/20 text-white placeholder-gray-400"
                placeholder="List any known allergies to medications, foods, or other substances..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="previousCognitiveAssessments" className="text-white font-medium">
                Previous Cognitive Assessments
              </Label>
              <Textarea
                id="previousCognitiveAssessments"
                value={patientInfo.previousCognitiveAssessments}
                onChange={(e) => handleInputChange("previousCognitiveAssessments", e.target.value)}
                className="bg-gray-800/50 border-white/20 text-white placeholder-gray-400"
                placeholder="Have you had any previous cognitive testing? If so, when and what were the results?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="familyHistoryDementia" className="text-white font-medium">
                Family History of Dementia/Alzheimer's
              </Label>
              <RadioGroup
                value={patientInfo.familyHistoryDementia}
                onValueChange={(value) => handleInputChange("familyHistoryDementia", value)}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="family-history-yes" />
                  <Label htmlFor="family-history-yes" className="text-white">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="family-history-no" />
                  <Label htmlFor="family-history-no" className="text-white">
                    No
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unknown" id="family-history-unknown" />
                  <Label htmlFor="family-history-unknown" className="text-white">
                    Unknown
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="neurologicalConditions" className="text-white font-medium">
                Neurological Conditions
              </Label>
              <Textarea
                id="neurologicalConditions"
                value={patientInfo.neurologicalConditions}
                onChange={(e) => handleInputChange("neurologicalConditions", e.target.value)}
                className="bg-gray-800/50 border-white/20 text-white placeholder-gray-400"
                placeholder="Any history of stroke, seizures, head injuries, Parkinson's, etc.?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="psychiatricHistory" className="text-white font-medium">
                Psychiatric History
              </Label>
              <Textarea
                id="psychiatricHistory"
                value={patientInfo.psychiatricHistory}
                onChange={(e) => handleInputChange("psychiatricHistory", e.target.value)}
                className="bg-gray-800/50 border-white/20 text-white placeholder-gray-400"
                placeholder="Any history of depression, anxiety, bipolar disorder, etc.?"
              />
            </div>
          </div>
        )

      case 3: // Lifestyle Factors
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-white font-medium flex items-center">
                  <Cigarette className="mr-2 h-4 w-4 text-orange-400" />
                  Smoking Status
                </h4>
                <RadioGroup
                  value={patientInfo.smokingStatus}
                  onValueChange={(value) => handleInputChange("smokingStatus", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="never" id="smoke-never" />
                    <Label htmlFor="smoke-never" className="text-white">
                      Never smoked
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="current" id="smoke-current" />
                    <Label htmlFor="smoke-current" className="text-white">
                      Current smoker
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="former" id="smoke-former" />
                    <Label htmlFor="smoke-former" className="text-white">
                      Former smoker
                    </Label>
                  </div>
                </RadioGroup>
                {(patientInfo.smokingStatus === "current" || patientInfo.smokingStatus === "former") && (
                  <Textarea
                    value={patientInfo.smokingHistory}
                    onChange={(e) => handleInputChange("smokingHistory", e.target.value)}
                    className="bg-gray-800/50 border-white/20 text-white placeholder-gray-400"
                    placeholder="How many cigarettes per day? For how many years?"
                  />
                )}
              </div>

              <div className="space-y-4">
                <h4 className="text-white font-medium flex items-center">
                  <Wine className="mr-2 h-4 w-4 text-purple-400" />
                  Alcohol Consumption
                </h4>
                <RadioGroup
                  value={patientInfo.alcoholConsumption}
                  onValueChange={(value) => handleInputChange("alcoholConsumption", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="never" id="alcohol-never" />
                    <Label htmlFor="alcohol-never" className="text-white">
                      Never drink
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="occasional" id="alcohol-occasional" />
                    <Label htmlFor="alcohol-occasional" className="text-white">
                      Occasional (1-2 drinks/week)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="alcohol-moderate" />
                    <Label htmlFor="alcohol-moderate" className="text-white">
                      Moderate (3-7 drinks/week)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="heavy" id="alcohol-heavy" />
                    <Label htmlFor="alcohol-heavy" className="text-white">
                      Heavy (8+ drinks/week)
                    </Label>
                  </div>
                </RadioGroup>
                {patientInfo.alcoholConsumption !== "never" && (
                  <Textarea
                    value={patientInfo.alcoholHistory}
                    onChange={(e) => handleInputChange("alcoholHistory", e.target.value)}
                    className="bg-gray-800/50 border-white/20 text-white placeholder-gray-400"
                    placeholder="Please provide more details about your alcohol consumption..."
                  />
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="exerciseFrequency" className="text-white font-medium">
                  Exercise Frequency
                </Label>
                <Select
                  value={patientInfo.exerciseFrequency}
                  onValueChange={(value) => handleInputChange("exerciseFrequency", value)}
                >
                  <SelectTrigger className="bg-gray-800/50 border-white/20 text-white">
                    <SelectValue placeholder="Select exercise frequency" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-white/20">
                    <SelectItem value="none">No regular exercise</SelectItem>
                    <SelectItem value="1-2-times">1-2 times per week</SelectItem>
                    <SelectItem value="3-4-times">3-4 times per week</SelectItem>
                    <SelectItem value="5-6-times">5-6 times per week</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sleepHours" className="text-white font-medium">
                  Average Sleep Hours per Night
                </Label>
                <Select
                  value={patientInfo.sleepHours}
                  onValueChange={(value) => handleInputChange("sleepHours", value)}
                >
                  <SelectTrigger className="bg-gray-800/50 border-white/20 text-white">
                    <SelectValue placeholder="Select sleep hours" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-white/20">
                    <SelectItem value="less-than-5">Less than 5 hours</SelectItem>
                    <SelectItem value="5-6">5-6 hours</SelectItem>
                    <SelectItem value="7-8">7-8 hours</SelectItem>
                    <SelectItem value="9-10">9-10 hours</SelectItem>
                    <SelectItem value="more-than-10">More than 10 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="sleepQuality" className="text-white font-medium">
                  Sleep Quality
                </Label>
                <Select
                  value={patientInfo.sleepQuality}
                  onValueChange={(value) => handleInputChange("sleepQuality", value)}
                >
                  <SelectTrigger className="bg-gray-800/50 border-white/20 text-white">
                    <SelectValue placeholder="Rate your sleep quality" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-white/20">
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="very-poor">Very Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dietType" className="text-white font-medium">
                  Diet Type
                </Label>
                <Select value={patientInfo.dietType} onValueChange={(value) => handleInputChange("dietType", value)}>
                  <SelectTrigger className="bg-gray-800/50 border-white/20 text-white">
                    <SelectValue placeholder="Select diet type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-white/20">
                    <SelectItem value="standard">Standard/Mixed Diet</SelectItem>
                    <SelectItem value="mediterranean">Mediterranean Diet</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="keto">Ketogenic</SelectItem>
                    <SelectItem value="low-carb">Low Carb</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 4: // Cognitive Concerns
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="memoryComplaints" className="text-white font-medium">
                Memory Complaints
              </Label>
              <Textarea
                id="memoryComplaints"
                value={patientInfo.memoryComplaints}
                onChange={(e) => handleInputChange("memoryComplaints", e.target.value)}
                className="bg-gray-800/50 border-white/20 text-white placeholder-gray-400 min-h-24"
                placeholder="Do you have any concerns about your memory? Please describe..."
              />
            </div>

            <div className="space-y-4">
              <Label className="text-white font-medium">Cognitive Symptoms (Check all that apply)</Label>
              <div className="grid md:grid-cols-2 gap-4">
                {cognitiveSymptomOptions.map((symptom) => (
                  <div key={symptom} className="flex items-center space-x-2">
                    <Checkbox
                      id={symptom}
                      checked={patientInfo.cognitiveSymptoms.includes(symptom)}
                      onCheckedChange={(checked) => handleSymptomChange(symptom, checked as boolean)}
                      className="border-white/20"
                    />
                    <Label htmlFor={symptom} className="text-white text-sm">
                      {symptom}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="symptomDuration" className="text-white font-medium">
                How long have you noticed these symptoms?
              </Label>
              <Select
                value={patientInfo.symptomDuration}
                onValueChange={(value) => handleInputChange("symptomDuration", value)}
              >
                <SelectTrigger className="bg-gray-800/50 border-white/20 text-white">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-white/20">
                  <SelectItem value="no-symptoms">No symptoms</SelectItem>
                  <SelectItem value="less-than-6-months">Less than 6 months</SelectItem>
                  <SelectItem value="6-12-months">6-12 months</SelectItem>
                  <SelectItem value="1-2-years">1-2 years</SelectItem>
                  <SelectItem value="2-5-years">2-5 years</SelectItem>
                  <SelectItem value="more-than-5-years">More than 5 years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="functionalImpact" className="text-white font-medium">
                Functional Impact
              </Label>
              <Textarea
                id="functionalImpact"
                value={patientInfo.functionalImpact}
                onChange={(e) => handleInputChange("functionalImpact", e.target.value)}
                className="bg-gray-800/50 border-white/20 text-white placeholder-gray-400"
                placeholder="How do these symptoms affect your daily activities, work, or relationships?"
              />
            </div>
          </div>
        )

      case 5: // Emergency Contact
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName" className="text-white font-medium">
                  Emergency Contact Name
                </Label>
                <Input
                  id="emergencyContactName"
                  value={patientInfo.emergencyContactName}
                  onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                  className="bg-gray-800/50 border-white/20 text-white placeholder-gray-400"
                  placeholder="Full name of emergency contact"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactRelation" className="text-white font-medium">
                  Relationship
                </Label>
                <Select
                  value={patientInfo.emergencyContactRelation}
                  onValueChange={(value) => handleInputChange("emergencyContactRelation", value)}
                >
                  <SelectTrigger className="bg-gray-800/50 border-white/20 text-white">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-white/20">
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="other-family">Other Family Member</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone" className="text-white font-medium">
                  Emergency Contact Phone
                </Label>
                <Input
                  id="emergencyContactPhone"
                  type="tel"
                  value={patientInfo.emergencyContactPhone}
                  onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
                  className="bg-gray-800/50 border-white/20 text-white placeholder-gray-400"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactEmail" className="text-white font-medium">
                  Emergency Contact Email
                </Label>
                <Input
                  id="emergencyContactEmail"
                  type="email"
                  value={patientInfo.emergencyContactEmail}
                  onChange={(e) => handleInputChange("emergencyContactEmail", e.target.value)}
                  className="bg-gray-800/50 border-white/20 text-white placeholder-gray-400"
                  placeholder="emergency@example.com"
                />
              </div>
            </div>
          </div>
        )

      case 6: // Consent & Privacy
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="consentResearch"
                  checked={patientInfo.consentResearch}
                  onCheckedChange={(checked) => handleInputChange("consentResearch", checked as boolean)}
                  className="border-white/20 mt-1"
                />
                <div>
                  <Label htmlFor="consentResearch" className="text-white font-medium">
                    Research Participation Consent (Optional)
                  </Label>
                  <p className="text-gray-400 text-sm mt-1">
                    I consent to having my de-identified assessment data used for research purposes to improve cognitive
                    health understanding and treatment.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="consentDataSharing"
                  checked={patientInfo.consentDataSharing}
                  onCheckedChange={(checked) => handleInputChange("consentDataSharing", checked as boolean)}
                  className="border-white/20 mt-1"
                />
                <div>
                  <Label htmlFor="consentDataSharing" className="text-white font-medium">
                    Data Sharing Consent (Optional)
                  </Label>
                  <p className="text-gray-400 text-sm mt-1">
                    I consent to sharing my de-identified data with approved healthcare providers and researchers for
                    collaborative studies.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="privacyAgreement"
                  checked={patientInfo.privacyAgreement}
                  onCheckedChange={(checked) => handleInputChange("privacyAgreement", checked as boolean)}
                  className="border-white/20 mt-1"
                />
                <div>
                  <Label htmlFor="privacyAgreement" className="text-white font-medium">
                    Privacy Policy Agreement *
                  </Label>
                  <p className="text-gray-400 text-sm mt-1">
                    I have read and agree to the{" "}
                    <Link href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link href="/terms" className="text-blue-400 hover:text-blue-300 underline">
                      Terms of Service
                    </Link>
                    . I understand how my data will be collected, used, and protected.
                  </p>
                </div>
              </div>
              {errors.privacyAgreement && <p className="text-red-400 text-sm">{errors.privacyAgreement}</p>}
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20 p-6">
              <h4 className="font-bold text-blue-300 mb-3 flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Data Security & HIPAA Compliance
              </h4>
              <div className="text-blue-200 text-sm space-y-2">
                <p>• Your personal health information is encrypted and stored securely</p>
                <p>• We comply with HIPAA regulations and healthcare privacy standards</p>
                <p>• Data is never shared with third parties without your explicit consent</p>
                <p>• You can request data deletion at any time</p>
                <p>• All staff are trained in privacy protection protocols</p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900"></div>

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
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-4 group">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-500">
              <Brain className="h-8 w-8 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Mano Veda
              </span>
              <div className="text-sm text-gray-400 font-medium flex items-center">
                <Sparkles className="w-3 h-3 mr-1" />
                Patient Information
              </div>
            </div>
          </Link>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="relative z-40 bg-gradient-to-r from-gray-900/50 via-black/50 to-gray-900/50 border-b border-white/10 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Patient Information Form</h2>
            <div className="text-sm text-gray-400">
              Step {currentSection + 1} of {sections.length}
            </div>
          </div>
          <div className="flex space-x-2 mb-4">
            {sections.map((section, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  index <= currentSection ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-gray-700"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-30 py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 backdrop-blur-xl shadow-2xl">
            <CardHeader className="text-center pb-8">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div
                  className={`w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl`}
                >
                  {React.createElement(sections[currentSection].icon, { className: "h-8 w-8 text-white" })}
                </div>
                <div className="text-left">
                  <CardTitle className="text-3xl font-bold text-white">{sections[currentSection].title}</CardTitle>
                  <CardDescription className="text-xl text-gray-300">
                    {sections[currentSection].description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={currentSection === sections.length - 1 ? handleSubmit : (e) => e.preventDefault()}>
                {renderSectionContent()}

                {/* Navigation */}
                <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/10">
                  <Button
                    type="button"
                    onClick={prevSection}
                    disabled={currentSection === 0}
                    variant="outline"
                    size="lg"
                    className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/30 px-8 py-3 disabled:opacity-50"
                  >
                    Previous
                  </Button>

                  {currentSection < sections.length - 1 ? (
                    <Button
                      type="button"
                      onClick={nextSection}
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 px-8 py-3 text-lg"
                    >
                      Next
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      size="lg"
                      className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 px-8 py-3 text-lg"
                    >
                      Complete & Start Assessment
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
