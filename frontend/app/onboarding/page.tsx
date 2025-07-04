"use client"

import { useState } from "react"
import {
  Step1BasicInfo,
  Step2BusinessDetails,
  Step3Documents,
  Step5Verification
} from "./step-components"
import { Button } from "@/components/ui/button"
import { CheckCircle, Building2, FileText, Upload, Users, Shield } from "lucide-react"

const steps = [
  { id: 1, title: "Basic Info", icon: Building2 },
  { id: 2, title: "Business Details", icon: FileText },
  { id: 3, title: "Documents", icon: Upload },
  { id: 4, title: "Verification", icon: Shield }
]

const initialData = {
  businessName: "",
  legalEntityType: "",
  industry: "",
  incorporationDate: "",
  panNumber: "",
  gstin: "",
  registeredAddress: {
    street: "",
    city: "",
    state: "",
    pincode: ""
  },
  contactInfo: {
    phone: "",
    email: "",
    website: ""
  },
  bankDetails: {
    accountNumber: "",
    ifscCode: "",
    bankName: ""
  },
  documents: {
    incorporation: null,
    panCard: null,
    gstCertificate: null,
    bankStatements: null
  },
  termsAccepted: false,
  blockchainHashing: true
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState(initialData)
  const [showBankDetails, setShowBankDetails] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  // --- Data update helpers ---
  const updateData = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }))
  }
  const updateNestedData = (parent, field, value) => {
    setData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }))
  }
  // --- Step validation ---
  const isStep1Valid = () => data.businessName && data.legalEntityType && data.industry && data.incorporationDate
  const isStep2Valid = () => data.panNumber && data.registeredAddress.street && data.registeredAddress.city && data.registeredAddress.state && data.registeredAddress.pincode && data.contactInfo.phone && data.contactInfo.email
  const isStep3Valid = () => data.documents.incorporation && data.documents.panCard
  const isStep5Valid = () => data.termsAccepted
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1: return isStep1Valid()
      case 2: return isStep2Valid()
      case 3: return isStep3Valid()
      case 4: return isStep5Valid()
      default: return false
    }
  }
  // --- File upload simulation ---
  const handleFileUpload = (field, file) => {
    setData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: file
      }
    }))
  }
  const simulateUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }
  // --- Team helpers ---
  const addTeamMember = () => {
    setData(prev => ({
      ...prev,
      teamMembers: [
        ...prev.teamMembers,
        { name: "", email: "", role: "Member", invited: false }
      ]
    }))
  }
  const updateTeamMember = (index, field, value) => {
    setData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member, i) => i === index ? { ...member, [field]: value } : member)
    }))
  }
  const removeTeamMember = (index) => {
    setData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }))
  }
  // --- Navigation ---
  const nextStep = () => { if (currentStep < 4) setCurrentStep(currentStep + 1) }
  const prevStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1) }
  const completeSetup = () => { console.log("Onboarding completed:", data) }
  // --- Step rendering ---
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo data={data} updateData={updateData} />
      case 2:
        return <Step2BusinessDetails data={data} updateData={updateData} updateNestedData={updateNestedData} showBankDetails={showBankDetails} setShowBankDetails={setShowBankDetails} />
      case 3:
        return <Step3Documents data={data} handleFileUpload={handleFileUpload} uploadProgress={uploadProgress} isUploading={isUploading} simulateUpload={simulateUpload} />
      case 4:
        return <Step5Verification data={data} updateData={updateData} />
      default:
        return null
    }
  }
  // --- UI ---
  return (
    <div className="min-h-screen legal-bg-primary py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center text-[#2A2A2A] mb-8">
          <h1 className=" text-4xl mb-2">Business Onboarding</h1>
          <p className="">Complete your business profile to get started</p>
        </div>
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step) => {
              const Icon = step.icon
              const isCompleted = currentStep > step.id
              const isCurrent = currentStep === step.id
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-12 h-12 -full flex items-center justify-center mb-2 transition-all duration-300 ${isCompleted ? 'bg-success text-white' : isCurrent ? 'bg-legal-accent text-white' : 'bg-legal-bg-secondary text-legal-secondary border-2 border-legal-border'}`}>
                  {isCompleted ? <CheckCircle className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                  </div>
                  <span className={`text-sm font-medium text-center ${isCompleted ? 'text-success' : isCurrent ? 'text-legal-accent' : 'text-legal-secondary'}`}>{step.title}</span>
                </div>
              )
            })}
          </div>
          {/* Progress Line */}
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-legal-border transform -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-0 h-0.5 bg-legal-accent transform -translate-y-1/2 transition-all duration-500" style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}></div>
          </div>
        </div>
        {/* Step Content */}
        <div className="mb-8">
          {renderCurrentStep()}
        </div>
        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="border-legal-border rounded-none text-legal-accent hover:bg-legal-bg-secondary">Previous</Button>
          <div className="flex gap-4">
            {currentStep < 4 ? (
              <Button onClick={nextStep} disabled={!isCurrentStepValid()} className="rounded-none btn-legal-primary rounded-none">Continue</Button>
            ) : (
              <Button onClick={completeSetup} disabled={!isCurrentStepValid()} className="btn-legal-primary rounded-none">Complete Setup</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
