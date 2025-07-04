// layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { Baskervville, Montserrat} from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { Web3Provider } from "@/lib/web3-provider"
import { LayoutWrapper } from "@/components/layout-wrapper"

const baskervville = Baskervville({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic", "normal"],
  variable: "--font-baskervville",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic", "normal"],
  variable: "--font-montserrat",
});
export const metadata: Metadata = {
  title: "LegalEase - AI-Powered Legal Compliance for Indian Startups",
  description:
    "Automate your legal workflows with AI. Draft contracts, track compliance, and handle payments - all in one platform built for Indian startups and SMEs.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <body >
        <Web3Provider>
          <AuthProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </AuthProvider>
        </Web3Provider>
      </body>
    </html>
  )
}
