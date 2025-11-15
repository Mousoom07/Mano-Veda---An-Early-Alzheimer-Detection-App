"use client"

export const dynamic = 'force-dynamic'

import Link from "next/link"
import { useEffect, useMemo, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { MapPin, Search, Star, ArrowRight, LocateFixed, Building2, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { doctors } from "@/lib/doctors"

export default function ConsultationPage() {
  return (
    <Suspense fallback={<div />}> 
      <ConsultationContent />
    </Suspense>
  )
}

function ConsultationContent() {
  const searchParams = useSearchParams()
  const [location, setLocation] = useState("")
  const [loadingLoc, setLoadingLoc] = useState(false)

  const specialization = searchParams.get("specialization") || ""

  const filteredDoctors = useMemo(() => {
    const spec = specialization.trim().toLowerCase()
    if (!spec) return doctors
    return doctors.filter((d) => d.specialization.toLowerCase().includes(spec))
  }, [specialization])

  const detectLocation = () => {
    if (!navigator.geolocation) return
    setLoadingLoc(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoadingLoc(false)
        setLocation(`${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)}`)
      },
      () => setLoadingLoc(false),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white py-10 px-4">
      <div className="container mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black">Doctor Consultation</h1>
            <p className="text-gray-300">Find specialists near you and book a consultation.</p>
          </div>
          <Link href="/">
            <Button variant="secondary" className="bg-white/10">Back to Home</Button>
          </Link>
        </header>

        {/* Location */}
        <Card className="bg-gradient-to-br from-gray-900/60 to-black/60 border border-white/10">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter city or pin code"
                  className="bg-black/40 border-white/10"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={detectLocation} className="bg-gradient-to-r from-blue-500 to-purple-500">
                  <LocateFixed className="w-4 h-4 mr-2" /> {loadingLoc ? "Detecting..." : "Use GPS"}
                </Button>
                <Button variant="secondary" className="bg-white/10">
                  <Search className="w-4 h-4 mr-2" /> Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Doctor Listing */}
        <section className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((d) => (
            <Card key={d.id} className="bg-gradient-to-br from-gray-900/60 to-black/60 border border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3">
                  <img src={d.photo} alt={d.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div>
                    <div className="text-xl font-bold">{d.name}</div>
                    <div className="text-blue-300 text-sm">{d.specialization}</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-300">
                  <div className="font-medium">{d.qualifications}</div>
                  <div>{d.experienceYears}+ years experience</div>
                </div>
                <div className="flex items-center gap-2 text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-semibold">{d.rating}</span>
                  <span className="text-gray-400">({d.reviewsCount} reviews)</span>
                </div>
                <div className="text-sm text-gray-300 flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-blue-400 mt-1" />
                  <div>
                    <div className="font-semibold">{d.hospital.name}</div>
                    <div className="text-gray-400">{d.hospital.address}, {d.hospital.city}</div>
                    <div className="text-gray-400">{d.hospital.phone}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="text-gray-300">
                    Fee: <span className="font-bold text-white">₹{d.fee}</span>
                  </div>
                  <Link href={`/consultation/${d.id}`}>
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
                      View Profile <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  )
}