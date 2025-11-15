"use client"

import Link from "next/link"
import { Brain, HeartPulse, Users, ArrowLeft, ArrowRight, BookOpen, Hospital } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { doctors } from "@/lib/doctors"

export default function AlzCarePage() {
  const specialistIds = ["d1", "d3"]
  const specialists = doctors.filter((d) => specialistIds.includes(d.id))

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white py-10 px-4">
      <div className="container mx-auto max-w-6xl space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black">Alzheimer’s Care</h1>
            <p className="text-gray-300">Information, symptoms, care tips, and specialist booking.</p>
          </div>
          <Link href="/">
            <Button variant="secondary" className="bg-white/10"><ArrowLeft className="w-4 h-4 mr-2"/>Back</Button>
          </Link>
        </header>

        {/* Info */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="bg-gradient-to-br from-gray-900/60 to-black/60 border border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Brain className="w-5 h-5"/> What is Alzheimer’s?</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-2">
              <p>Alzheimer’s is a progressive neurological disorder that affects memory, thinking, and behavior.</p>
              <p>Early detection and intervention can help slow progression and improve quality of life.</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-gray-900/60 to-black/60 border border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><HeartPulse className="w-5 h-5"/> Symptoms</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-2">
              <ul className="list-disc pl-5 space-y-1">
                <li>Memory loss affecting daily life</li>
                <li>Difficulty planning or problem-solving</li>
                <li>Confusion with time or place</li>
                <li>Changes in mood or personality</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-gray-900/60 to-black/60 border border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5"/> Care Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-2">
              <ul className="list-disc pl-5 space-y-1">
                <li>Maintain a routine and structured environment</li>
                <li>Encourage physical activity and cognitive exercises</li>
                <li>Ensure proper sleep and nutrition</li>
                <li>Seek support groups and caregiver resources</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Specialists */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold">Recommended Specialists</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {specialists.map((d) => (
              <Card key={d.id} className="bg-gradient-to-br from-gray-900/60 to-black/60 border border-white/10">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={d.photo} alt={d.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <div className="font-bold">{d.name}</div>
                      <div className="text-blue-300 text-sm">{d.specialization}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-300">{d.hospital.name}</div>
                  <div className="flex justify-between items-center">
                    <div className="text-gray-300">Fee: <span className="font-bold text-white">₹{d.fee}</span></div>
                    <Link href={`/consultation/${d.id}`}>
                      <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500">Book <ArrowRight className="w-4 h-4 ml-2"/></Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Support & Hospitals */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold">Support & Hospitals</h2>
          <Card className="bg-gradient-to-br from-gray-900/60 to-black/60 border border-white/10">
            <CardContent className="p-4 text-gray-300 space-y-2">
              <p>Find nearby hospitals and support groups for Alzheimer’s care. Speak to a neurologist or psychiatrist for a personalized care plan.</p>
              <Link href="/consultation">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500">Find Doctors</Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}