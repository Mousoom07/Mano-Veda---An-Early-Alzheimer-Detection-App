"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Brain, Menu, X } from "lucide-react"

export function NavigationTest() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Mano Veda
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/assessment" className="text-gray-300 hover:text-white transition-colors">
              Assessment
            </Link>
            <Link href="/results" className="text-gray-300 hover:text-white transition-colors">
              Results
            </Link>
            <Link href="/patient-info" className="text-gray-300 hover:text-white transition-colors">
              Patient Info
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/assessment" className="text-gray-300 hover:text-white transition-colors">
                Assessment
              </Link>
              <Link href="/results" className="text-gray-300 hover:text-white transition-colors">
                Results
              </Link>
              <Link href="/patient-info" className="text-gray-300 hover:text-white transition-colors">
                Patient Info
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-white/20 text-white hover:bg-white/10"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
