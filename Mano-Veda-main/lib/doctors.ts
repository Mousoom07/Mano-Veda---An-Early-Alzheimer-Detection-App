export interface Doctor {
  id: string
  name: string
  photo: string
  specialization: string
  qualifications: string
  experienceYears: number
  rating: number
  reviewsCount: number
  hospital: {
    name: string
    address: string
    city: string
    phone: string
    services: string[]
    lat?: number
    lng?: number
  }
  fee: number
  bio: string
  availableSlots: Record<string, string[]> // date ISO -> times
}

export const doctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Asha Nair",
    photo: "/placeholder-user.jpg",
    specialization: "Neurologist",
    qualifications: "MBBS, MD (Medicine), DM (Neurology)",
    experienceYears: 15,
    rating: 4.7,
    reviewsCount: 214,
    hospital: {
      name: "City Neuro Care Hospital",
      address: "12 Neuro Avenue, MG Road",
      city: "Bengaluru",
      phone: "+91-80-4567-1234",
      services: ["Neurology OPD", "EEG/EMG", "Neuro Imaging", "Stroke Unit"],
      lat: 12.9716,
      lng: 77.5946,
    },
    fee: 1200,
    bio: "Experienced neurologist specializing in cognitive disorders, dementia care, and early Alzheimer’s detection.",
    availableSlots: {
      // Next 5 days sample
      [new Date().toISOString().slice(0, 10)]: ["10:00", "11:30", "15:00"],
      [new Date(Date.now() + 86400000).toISOString().slice(0, 10)]: ["09:30", "12:00", "16:30"],
      [new Date(Date.now() + 2*86400000).toISOString().slice(0, 10)]: ["10:15", "14:00"],
    },
  },
  {
    id: "d2",
    name: "Dr. Raj Mehta",
    photo: "/placeholder-user.jpg",
    specialization: "Psychiatrist",
    qualifications: "MBBS, MD (Psychiatry)",
    experienceYears: 12,
    rating: 4.6,
    reviewsCount: 180,
    hospital: {
      name: "MindCare Clinic",
      address: "221 Wellness Street, Andheri East",
      city: "Mumbai",
      phone: "+91-22-3344-5566",
      services: ["Psychiatry OPD", "Counseling", "Cognitive Therapy"],
      lat: 19.076,
      lng: 72.8777,
    },
    fee: 1000,
    bio: "Focus on memory disorders, mood, and behavioral symptoms associated with dementia and Alzheimer’s.",
    availableSlots: {
      [new Date().toISOString().slice(0, 10)]: ["11:00", "13:00", "17:30"],
      [new Date(Date.now() + 86400000).toISOString().slice(0, 10)]: ["10:45", "12:30"],
    },
  },
  {
    id: "d3",
    name: "Dr. Meera Kapoor",
    photo: "/placeholder-user.jpg",
    specialization: "Geriatric Neurologist",
    qualifications: "MBBS, MD, DM (Geriatric Neurology)",
    experienceYears: 18,
    rating: 4.8,
    reviewsCount: 256,
    hospital: {
      name: "Sunrise Nursing Home",
      address: "45 Care Park, Sector 21",
      city: "Delhi",
      phone: "+91-11-2233-7788",
      services: ["Geriatric Care", "Neuro Rehab", "Memory Clinic"],
      lat: 28.6139,
      lng: 77.209,
    },
    fee: 1500,
    bio: "Specializes in elderly cognitive health, comprehensive dementia evaluations, and caregiver support.",
    availableSlots: {
      [new Date(Date.now() + 86400000).toISOString().slice(0, 10)]: ["09:00", "10:30", "16:00"],
      [new Date(Date.now() + 2*86400000).toISOString().slice(0, 10)]: ["11:15", "15:30"],
    },
  },
]