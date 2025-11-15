"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useMemo, useState } from "react"
import { Calendar as CalendarIcon, Clock, MapPin, Star, ArrowLeft, Building2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { doctors } from "@/lib/doctors"

export default function DoctorProfilePage() {
  const params = useParams() as { id?: string }
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0,10))

  const doctor = useMemo(() => doctors.find((d) => d.id === params?.id), [params?.id])

  if (!doctor) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white py-10 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link href="/consultation">
            <Button variant="secondary" className="bg-white/10 mb-6"><ArrowLeft className="w-4 h-4 mr-2"/>Back</Button>
          </Link>
          <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20">
            <CardContent className="p-8 text-center">Doctor not found.</CardContent>
          </Card>
        </div>
      </main>
    )
  }

  const dates = Object.keys(doctor.availableSlots)
  const slots = doctor.availableSlots[selectedDate] || []

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white py-10 px-4">
      <div className="container mx-auto max-w-5xl space-y-8">
        <header className="flex items-center justify-between">
          <Link href="/consultation">
            <Button variant="secondary" className="bg-white/10"><ArrowLeft className="w-4 h-4 mr-2"/>Back</Button>
          </Link>
        </header>

        <Card className="bg-gradient-to-br from-gray-900/60 to-black/60 border border-white/10">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <img src={doctor.photo} alt={doctor.name} className="w-28 h-28 rounded-xl object-cover" />
              <div className="flex-1 space-y-2">
                <h1 className="text-2xl sm:text-3xl font-black">{doctor.name}</h1>
                <div className="text-blue-300">{doctor.specialization}</div>
                <div className="text-sm text-gray-300">{doctor.qualifications}</div>
                <div className="text-sm text-gray-300">{doctor.experienceYears}+ years experience</div>
                <div className="flex items-center gap-2 text-yellow-400"><Star className="w-4 h-4 fill-current"/> {doctor.rating} <span className="text-gray-400">({doctor.reviewsCount} reviews)</span></div>
                <p className="text-gray-300 pt-2">{doctor.bio}</p>
              </div>
              <div className="sm:w-56">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-gray-300">Consultation Fee</div>
                  <div className="text-2xl font-black">₹{doctor.fee}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hospital Section */}
        <Card className="bg-gradient-to-br from-gray-900/60 to-black/60 border border-white/10">
          <CardHeader>
            <CardTitle className="text-xl">Hospital / Nursing Home</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-gray-300 flex items-start gap-2">
              <Building2 className="w-4 h-4 text-blue-400 mt-1" />
              <div>
                <div className="font-semibold">{doctor.hospital.name}</div>
                <div className="text-gray-400">{doctor.hospital.address}, {doctor.hospital.city}</div>
                <div className="text-gray-400">{doctor.hospital.phone}</div>
                <div className="text-gray-400 mt-1">Services: {doctor.hospital.services.join(", ")}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <a className="text-blue-400 underline" href={`https://www.google.com/maps/search/?api=1&query=${doctor.hospital.lat},${doctor.hospital.lng}`} target="_blank">View on Map</a>
              <a className="text-blue-400 underline" href={`https://www.google.com/maps/dir/?api=1&destination=${doctor.hospital.lat},${doctor.hospital.lng}`} target="_blank">Directions</a>
            </div>
          </CardContent>
        </Card>

        {/* Calendar & Booking */}
        <Card className="bg-gradient-to-br from-gray-900/60 to-black/60 border border-white/10">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2"><CalendarIcon className="w-5 h-5"/> Available Slots</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 overflow-x-auto">
              {dates.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDate(d)}
                  className={`px-4 py-2 rounded-xl whitespace-nowrap border ${selectedDate===d?"bg-blue-600 border-blue-500":"bg-white/5 border-white/10"}`}
                >
                  {new Date(d).toLocaleDateString()}
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              {slots.length ? slots.map((t) => (
                <button key={t} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
                  <Clock className="w-4 h-4"/> {t}
                </button>
              )) : <div className="text-gray-400">No slots available for this date.</div>}
            </div>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500">Book Now</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}