import Link from "next/link"
import { Scale, Twitter, Linkedin, Github, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="legal-section-alternate border-t border-amber-200 dark:border-amber-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 legal-icon-bg rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold legal-heading">LegalEase</span>
            </Link>
            <p className="legal-text mb-6 max-w-md">
              Professional legal services with a commitment to excellence. Our experienced attorneys provide comprehensive legal solutions tailored to your needs.
            </p>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-amber-700 dark:text-amber-300" />
                <span className="legal-text">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-amber-700 dark:text-amber-300" />
                <span className="legal-text">contact@legalease.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-amber-700 dark:text-amber-300" />
                <span className="legal-text">123 Legal Street, Suite 100<br />New York, NY 10001</span>
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <Link
                href="#"
                className="text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Practice Areas */}
          <div>
            <h3 className="legal-subheading mb-4">Practice Areas</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/business-law"
                  className="legal-text hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
                >
                  Business Law
                </Link>
              </li>
              <li>
                <Link
                  href="/criminal-law"
                  className="legal-text hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
                >
                  Criminal Law
                </Link>
              </li>
              <li>
                <Link
                  href="/family-law"
                  className="legal-text hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
                >
                  Family Law
                </Link>
              </li>
              <li>
                <Link
                  href="/civil-litigation"
                  className="legal-text hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
                >
                  Civil Litigation
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="legal-subheading mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="legal-text hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/attorneys"
                  className="legal-text hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
                >
                  Our Attorneys
                </Link>
              </li>
              <li>
                <Link
                  href="/testimonials"
                  className="legal-text hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
                >
                  Testimonials
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="legal-text hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="legal-subheading mb-4">Contact & Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="legal-text hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/consultation"
                  className="legal-text hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
                >
                  Free Consultation
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="legal-text hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="legal-text hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
                >
                  Legal Resources
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="legal-professional-card text-center mb-12">
          <h3 className="text-2xl legal-heading mb-4">Need Legal Assistance?</h3>
          <p className="legal-text mb-6">
            Schedule a free consultation with our experienced attorneys to discuss your legal matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="btn-legal-primary">
              <Link href="/consultation">Schedule Consultation</Link>
            </Button>
            <Button className="btn-legal-secondary">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-amber-200 dark:border-amber-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="legal-text-muted text-sm">
            © 2024 LegalEase. All rights reserved. Professional Legal Services.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/terms" className="legal-text-muted text-sm hover:text-amber-800 dark:hover:text-amber-200">
              Terms of Service
            </Link>
            <Link href="/privacy" className="legal-text-muted text-sm hover:text-amber-800 dark:hover:text-amber-200">
              Privacy Policy
            </Link>
            <Link href="/disclaimer" className="legal-text-muted text-sm hover:text-amber-800 dark:hover:text-amber-200">
              Legal Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
