"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Upload,
  FileText,
  Users,
  Shield,
  Building2,
  MapPin,
  Phone,
  CreditCard,
  Eye,
  EyeOff,
  Loader2,
  Check,
  AlertCircle,
  X
} from "lucide-react"

interface OnboardingData {
  businessName: string
  companyDescription: string
  legalEntityType: string
  industry: string
  incorporationDate: string
  panNumber: string
  gstin: string
  registeredAddress: {
    street: string
    city: string
    state: string
    pincode: string
  }
  contactInfo: {
    phone: string
    email: string
    website: string
  }
  bankDetails: {
    accountNumber: string
    ifscCode: string
    bankName: string
  }
  documents: {
    incorporation: File | null
    panCard: File | null
    gstCertificate: File | null
    bankStatements: File | null
  }
  teamMembers: Array<{
    name: string
    email: string
    role: string
    invited: boolean
  }>
  termsAccepted: boolean
  blockchainHashing: boolean
}

interface StepProps {
  data: OnboardingData
  updateData: (field: string, value: any) => void
  updateNestedData: (parent: string, field: string, value: any) => void
  showBankDetails: boolean
  setShowBankDetails: (show: boolean) => void
  uploadProgress: number
  isUploading: boolean
  simulateUpload: () => void
  addTeamMember: () => void
  updateTeamMember: (index: number, field: string, value: string) => void
  removeTeamMember: (index: number) => void
  handleFileUpload: (field: keyof OnboardingData['documents'], file: File) => void
}

const legalEntityTypes = [
  "Private Limited Company",
  "Public Limited Company",
  "Limited Liability Partnership (LLP)",
  "Partnership Firm",
  "Sole Proprietorship",
  "One Person Company (OPC)",
  "Section 8 Company"
]

const industries = [
  "Technology & Software",
  "Healthcare & Pharmaceuticals",
  "Finance & Banking",
  "Manufacturing",
  "Retail & E-commerce",
  "Real Estate",
  "Education",
  "Legal Services",
  "Consulting",
  "Media & Entertainment",
  "Transportation & Logistics",
  "Energy & Utilities",
  "Agriculture",
  "Construction",
  "Other"
]

export const Step1BasicInfo = ({ data, updateData }: StepProps) => (
  <Card className="rounded-none">
    <CardHeader>
      <CardTitle className="text-legal-brown flex items-center gap-2">
        <Building2 className="text-legal-brown" />
        Basic Information
      </CardTitle>
      <p className="">Tell us about your business</p>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="businessName" className="legal-text font-semibold">
            Business Name *
          </Label>
          <Input
            id="businessName"
            value={data.businessName}
            onChange={(e) => updateData("businessName", e.target.value)}
            placeholder="Enter your business name"
            className="border-legal-border rounded-none focus:border-legal-accent"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="legalEntityType" className="legal-text font-semibold">
            Legal Entity Type *
          </Label>
          <Select
            value={data.legalEntityType}
            onValueChange={(value) => updateData("legalEntityType", value)}
          >
            <SelectTrigger className="border-legal-border rounded-none focus:border-legal-accent">
              <SelectValue placeholder="Select entity type" />
            </SelectTrigger>
            <SelectContent>
              {legalEntityTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry" className="legal-text font-semibold">
            Industry *
          </Label>
          <Select
            value={data.industry}
            onValueChange={(value) => updateData("industry", value)}
          >
            <SelectTrigger className="border-legal-border rounded-none    focus:border-legal-accent">
              <SelectValue placeholder="Select industry" className="rounded-none" />
            </SelectTrigger>
            <SelectContent className="rounded-none">
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="incorporationDate"
            className="legal-text font-semibold"
          >
            Incorporation Date *
          </Label>
          <Input
            id="incorporationDate"
            type="date"
            value={data.incorporationDate}
            onChange={(e) => updateData("incorporationDate", e.target.value)}
            className="border-legal-border rounded-none   focus:border-legal-accent"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyDescription" className="legal-text font-semibold">
          Company Description *
        </Label>
        <Textarea
          id="companyDescription"
          value={data.companyDescription}
          onChange={(e) => updateData("companyDescription", e.target.value)}
          placeholder="Describe what your company does, its main products/services, target market, and business model..."
          className="border-legal-border rounded-none focus:border-legal-accent min-h-[120px]"
          rows={5}
        />
        <p className="text-sm text-legal-secondary">
          Provide a comprehensive description of your business activities, services, and operations.
        </p>
      </div>
    </CardContent>
  </Card>
);

export const Step2BusinessDetails = ({
  data,
  updateData,
  updateNestedData,
  showBankDetails,
  setShowBankDetails,
}: StepProps) => (
  <Card className="rounded-none">
    <CardHeader>
      <CardTitle className="text-legal-brown flex items-center gap-2">
        <FileText className="text-legal-brown" />
        Business Details
      </CardTitle>
      <p className="">
        Provide your business registration and contact information
      </p>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="panNumber" className="legal-text font-semibold">
            PAN Number *
          </Label>
          <Input
            id="panNumber"
            value={data.panNumber}
            onChange={(e) =>
              updateData("panNumber", e.target.value.toUpperCase())
            }
            placeholder="ABCDE1234F"
            maxLength={10}
            className="border-legal-border rounded-none focus:border-legal-accent"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gstin" className="legal-text font-semibold">
            GSTIN (Optional)
          </Label>
          <Input
            id="gstin"
            value={data.gstin}
            onChange={(e) => updateData("gstin", e.target.value.toUpperCase())}
            placeholder="22AAAAA0000A1Z5"
            maxLength={15}
            className="border-legal-border rounded-none focus:border-legal-accent"
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-legal-brown  flex items-center gap-2">
          <MapPin className="text-legal-brown" />
          Registered Address
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="street" className="legal-text font-semibold">
              Street Address *
            </Label>
            <Textarea
              id="street"
              value={data.registeredAddress.street}
              onChange={(e) =>
                updateNestedData("registeredAddress", "street", e.target.value)
              }
              placeholder="Enter complete street address"
              className="border-legal-border rounded-none focus:border-legal-accent"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city" className="legal-text font-semibold">
              City *
            </Label>
            <Input
              id="city"
              value={data.registeredAddress.city}
              onChange={(e) =>
                updateNestedData("registeredAddress", "city", e.target.value)
              }
              placeholder="Enter city"
              className="border-legal-border rounded-none focus:border-legal-accent"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state" className="legal-text font-semibold">
              State *
            </Label>
            <Input
              id="state"
              value={data.registeredAddress.state}
              onChange={(e) =>
                updateNestedData("registeredAddress", "state", e.target.value)
              }
              placeholder="Enter state"
              className="border-legal-border rounded-none focus:border-legal-accent"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pincode" className="legal-text font-semibold">
              Pincode *
            </Label>
            <Input
              id="pincode"
              value={data.registeredAddress.pincode}
              onChange={(e) =>
                updateNestedData("registeredAddress", "pincode", e.target.value)
              }
              placeholder="Enter pincode"
              maxLength={6}
              className="border-legal-border rounded-none focus:border-legal-accent"
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-legal-brown flex items-center gap-2">
          <Phone className="text-legal-accent" />
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="legal-text font-semibold">
              Phone Number *
            </Label>
            <Input
              id="phone"
              value={data.contactInfo.phone}
              onChange={(e) =>
                updateNestedData("contactInfo", "phone", e.target.value)
              }
              placeholder="Enter phone number"
              className="border-legal-border rounded-none focus:border-legal-accent"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="legal-text font-semibold">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={data.contactInfo.email}
              onChange={(e) =>
                updateNestedData("contactInfo", "email", e.target.value)
              }
              placeholder="Enter email address"
              className="border-legal-border rounded-none focus:border-legal-accent"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website" className="legal-text font-semibold">
              Website (Optional)
            </Label>
            <Input
              id="website"
              value={data.contactInfo.website}
              onChange={(e) =>
                updateNestedData("contactInfo", "website", e.target.value)
              }
              placeholder="Enter website URL"
              className="border-legal-border rounded-none focus:border-legal-accent"
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-legal-brown flex items-center gap-2">
            <CreditCard className="text-legal-brown" />
            Bank Details
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBankDetails(!showBankDetails)}
            className="border-legal-border rounded-none text-legal-accent hover:bg-legal-bg-secondary"
          >
            {showBankDetails ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {showBankDetails ? "Hide" : "Show"} Details
          </Button>
        </div>

        {showBankDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-legal-bg-secondary ">
            <div className="space-y-2">
              <Label
                htmlFor="accountNumber"
                className="legal-text font-semibold"
              >
                Account Number
              </Label>
              <Input
                id="accountNumber"
                value={data.bankDetails.accountNumber}
                onChange={(e) =>
                  updateNestedData(
                    "bankDetails",
                    "accountNumber",
                    e.target.value
                  )
                }
                placeholder="Enter account number"
                className="border-legal-border rounded-none focus:border-legal-accent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ifscCode" className="legal-text font-semibold">
                IFSC Code
              </Label>
              <Input
                id="ifscCode"
                value={data.bankDetails.ifscCode}
                onChange={(e) =>
                  updateNestedData(
                    "bankDetails",
                    "ifscCode",
                    e.target.value.toUpperCase()
                  )
                }
                placeholder="Enter IFSC code"
                maxLength={11}
                className="border-legal-border rounded-none focus:border-legal-accent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankName" className="legal-text font-semibold">
                Bank Name
              </Label>
              <Input
                id="bankName"
                value={data.bankDetails.bankName}
                onChange={(e) =>
                  updateNestedData("bankDetails", "bankName", e.target.value)
                }
                placeholder="Enter bank name"
                className="border-legal-border rounded-none focus:border-legal-accent"
              />
            </div>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

export const Step3Documents = ({
  data,
  handleFileUpload,
  uploadProgress,
  isUploading,
  simulateUpload,
}: StepProps) => (
  <Card className="rounded-none">
    <CardHeader>
      <CardTitle className="text-legal-brown flex items-center gap-2">
        <Upload className="text-legal-brown" />
        Document Upload
      </CardTitle>
      <p className="">Upload required business documents</p>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="legal-text font-semibold">
              Certificate of Incorporation *
            </Label>
            <div className="border-2 border-dashed border-legal-border  p-6 text-center hover:border-legal-accent transition-colors">
              <Upload className="mx-auto h-12 w-12 text-legal-secondary mb-4" />
              <p className="legal-text-muted mb-2">
                Drop file here or click to upload
              </p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload("incorporation", file);
                }}
                className="hidden"
                id="incorporation"
              />
              <label htmlFor="incorporation" className="cursor-pointer">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-legal-border text-legal-accent hover:bg-legal-bg-secondary"
                  onClick={() =>
                    document.getElementById("incorporation")?.click()
                  }
                >
                  Choose File
                </Button>
              </label>
            </div>
            {data.documents.incorporation && (
              <div className="flex items-center justify-between gap-2 p-2 bg-legal-secondary">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-legal-accent" />
                  <span className="legal-text text-sm">
                    {data.documents.incorporation.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-legal-dark-text rounded-none hover:text-legal-border"
                  onClick={() => handleFileUpload("incorporation", null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="legal-text font-semibold">PAN Card *</Label>
            <div className="border-2 border-dashed border-legal-border  p-6 text-center hover:border-legal-accent transition-colors">
              <Upload className="mx-auto h-12 w-12 text-legal-secondary mb-4" />
              <p className="legal-text-muted mb-2">
                Drop file here or click to upload
              </p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload("panCard", file);
                }}
                className="hidden"
                id="panCard"
              />
              <label htmlFor="panCard" className="cursor-pointer">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-legal-border text-legal-accent hover:bg-legal-bg-secondary"
                  onClick={() => document.getElementById("panCard")?.click()}
                >
                  Choose File
                </Button>
              </label>
            </div>
            {data.documents.panCard && (
              <div className="flex items-center justify-between gap-2 p-2 bg-legal-secondary">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-legal-accent" />
                  <span className="legal-text text-sm">
                    {data.documents.panCard.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-legal-dark-text rounded-none hover:text-legal-border"
                  onClick={() => handleFileUpload("panCard", null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="legal-text font-semibold">
              GST Certificate (Optional)
            </Label>
            <div className="border-2 border-dashed border-legal-border  p-6 text-center hover:border-legal-accent transition-colors">
              <Upload className="mx-auto h-12 w-12 text-legal-secondary mb-4" />
              <p className="legal-text-muted mb-2">
                Drop file here or click to upload
              </p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload("gstCertificate", file);
                }}
                className="hidden"
                id="gstCertificate"
              />
              <label htmlFor="gstCertificate" className="cursor-pointer">
                <Button
                  variant="outline"
                  onClick={() =>
                    document.getElementById("gstCertificate")?.click()
                  }
                  size="sm"
                  className="border-legal-border text-legal-accent hover:bg-legal-bg-secondary"
                >
                  Choose File
                </Button>
              </label>
            </div>
            {data.documents.gstCertificate && (
              <div className="flex items-center justify-between gap-2 p-2 bg-legal-secondary">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-legal-accent" />
                  <span className="legal-text text-sm">
                    {data.documents.gstCertificate.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-legal-dark-text rounded-none hover:text-legal-border"
                  onClick={() => handleFileUpload("gstCertificate", null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="legal-text font-semibold">
              Bank Statements (Optional)
            </Label>
            <div className="border-2 border-dashed border-legal-border  p-6 text-center hover:border-legal-accent transition-colors">
              <Upload className="mx-auto h-12 w-12 text-legal-secondary mb-4" />
              <p className="legal-text-muted mb-2">
                Drop file here or click to upload
              </p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload("bankStatements", file);
                }}
                className="hidden"
                id="bankStatements"
              />
              <label htmlFor="bankStatements" className="cursor-pointer">
                <Button
                  variant="outline"
                  onClick={() =>
                    document.getElementById("bankStatements")?.click()
                  }
                  size="sm"
                  className="border-legal-border text-legal-accent hover:bg-legal-bg-secondary"
                >
                  Choose File
                </Button>
              </label>
            </div>
            {data.documents.bankStatements && (
              <div className="flex items-center justify-between gap-2 p-2 bg-legal-secondary">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-legal-accent" />
                  <span className="legal-text text-sm">
                    {data.documents.bankStatements.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-legal-dark-text rounded-none hover:text-legal-border"
                  onClick={() => handleFileUpload("bankStatements", null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-legal-accent" />
            <span className="legal-text">Extracting data...</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      <Button
        onClick={simulateUpload}
        disabled={
          !data.documents.incorporation ||
          !data.documents.panCard ||
          isUploading
        }
        className="btn-legal-primary rounded-none "
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Process Documents"
        )}
      </Button>
    </CardContent>
  </Card>
);


export const Step5Verification = ({ data, updateData }: StepProps) => (
  <Card className="rounded-none">
    <CardHeader>
      <CardTitle className="text-legal-brown flex items-center gap-2">
        <Shield className="text-legal-brown" />
        Verification & Summary
      </CardTitle>
        <p className="">Review your information and complete setup</p>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-4">
          <h3 className="text-legal-brown">Business Information Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-legal-secondary ">
          <div>
            <p className="legal-text font-semibold">Business Name</p>
            <p className="legal-text-muted">{data.businessName}</p>
          </div>
          <div>
            <p className="legal-text font-semibold">Legal Entity</p>
            <p className="legal-text-muted">{data.legalEntityType}</p>
          </div>
          <div>
            <p className="legal-text font-semibold">Industry</p>
            <p className="legal-text-muted">{data.industry}</p>
          </div>
          <div>
            <p className="legal-text font-semibold">PAN Number</p>
            <p className="legal-text-muted">{data.panNumber}</p>
          </div>
          <div>
            <p className="legal-text font-semibold">Contact Email</p>
            <p className="legal-text-muted">{data.contactInfo.email}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="legal-text font-semibold">Company Description</p>
          <div className="p-4 bg-legal-bg-secondary rounded-none">
            <p className="legal-text-muted whitespace-pre-wrap">{data.companyDescription || "No description provided"}</p>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Checkbox
            id="blockchainHashing"
            checked={data.blockchainHashing}
            onCheckedChange={(checked) => updateData("blockchainHashing", checked)}
          />
          <Label htmlFor="blockchainHashing" className="text-legal-brown font-semibold">
            Enable blockchain hashing for document verification
          </Label>
        </div>
        <p className="text-sm">
          Your documents will be hashed and stored on the blockchain for enhanced security and verification.
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="termsAccepted"
            checked={data.termsAccepted}
            onCheckedChange={(checked) => updateData("termsAccepted", checked)}
          />
          <div>
            <Label htmlFor="termsAccepted" className="text-legal-brown font-semibold">
              I accept the terms and conditions
            </Label>
            <p className="text-sm mt-1">
              By checking this box, you agree to our Terms of Service and Privacy Policy.
              You also confirm that all information provided is accurate and up-to-date.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-border border-blue-200  p-4 rounded-none">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <div>
            <h4 className="text-legal-brown font-semibold ">Important Notice</h4>
            <p className="text-sm ">
              Your business information will be verified by our compliance team within 2-3 business days.
              You'll receive an email notification once the verification is complete.
            </p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
)
