import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mano Veda AI - Cognitive Health Assessment",
  description:
    "AI-powered cognitive health assessment platform with real-time analysis and personalized recommendations",
  generator: 'v0.dev',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body className={`${inter.className} bg-gray-950 text-white min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex flex-col">
            <div className="flex-1">{children}</div>
            <footer className="border-t border-white/10 bg-black/40">
              <div className="container mx-auto px-4 py-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                <div>
                  <div className="font-bold text-white mb-2">Mano Veda</div>
                  <div className="text-gray-400">AI-powered cognitive health platform.</div>
                </div>
                <div>
                  <div className="font-semibold mb-2">Company</div>
                  <ul className="space-y-1">
                    <li><a href="/about" className="text-gray-300 hover:text-white">About Us</a></li>
                    <li><a href="/contact" className="text-gray-300 hover:text-white">Contact</a></li>
                  </ul>
                </div>
                <div>
                  <div className="font-semibold mb-2">Legal</div>
                  <ul className="space-y-1">
                    <li><a href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
                  </ul>
                </div>
                <div>
                  <div className="font-semibold mb-2">Help</div>
                  <ul className="space-y-1">
                    <li><a href="/emergency" className="text-gray-300 hover:text-white">Emergency Helplines</a></li>
                  </ul>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
