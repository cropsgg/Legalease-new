import Link from "next/link"
import { Scale, Twitter, Linkedin, Github, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="bg-[#F8F3EE] py-16">
      <div className="container mx-auto px-4">
        {/* Want a Lawyer Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-[#2A2A2A] mb-8">
            WANT A LAWYER?
          </h2>
          
          <div className="flex items-center justify-center mb-8">
            <span className="text-[#8B7355] text-lg">CONTACT US</span>
            <div className="mx-8 h-px bg-[#2A2A2A] w-24"></div>
            <span className="text-[#8B7355] text-lg">LET'S TALK</span>
          </div>
          
          <div className="text-3xl md:text-4xl font-light text-[#2A2A2A] mb-12">
            HELLO@OSPACE.CO
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex justify-center space-x-8 md:space-x-12 mb-12">
          <Link 
            href="/" 
            className="text-[#8B7355] hover:text-[#2A2A2A] transition-colors duration-300"
          >
            Floristy
          </Link>
          <Link 
            href="/" 
            className="text-[#8B7355] hover:text-[#2A2A2A] transition-colors duration-300"
          >
            Home
          </Link>
          <Link 
            href="/features" 
            className="text-[#8B7355] hover:text-[#2A2A2A] transition-colors duration-300"
          >
            Projects
          </Link>
          <Link 
            href="/blog" 
            className="text-[#8B7355] hover:text-[#2A2A2A] transition-colors duration-300"
          >
            Blog
          </Link>
          <Link 
            href="/contact" 
            className="text-[#8B7355] hover:text-[#2A2A2A] transition-colors duration-300"
          >
            Contacts
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-center space-y-2">
          <p className="text-[#8B7355] text-sm">
            © 2024 Designed by Qspace LLC
          </p>
          <p className="text-[#8B7355] text-sm">
            Powered by Qspace LLC
          </p>
        </div>
      </div>
    </footer>
  )
}
