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
  <Card className="">
    <CardHeader>
      <CardTitle className="legal-heading flex items-center gap-2">
        <Building2 className="text-legal-accent" />
        Basic Information
      </CardTitle>
      <p className="legal-text-muted">Tell us about your business</p>
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
            className="border-legal-border focus:border-legal-accent"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="legalEntityType" className="legal-text font-semibold">
            Legal Entity Type *
          </Label>
          <Select value={data.legalEntityType} onValueChange={(value) => updateData("legalEntityType", value)}>
            <SelectTrigger className="border-legal-border focus:border-legal-accent">
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
          <Select value={data.industry} onValueChange={(value) => updateData("industry", value)}>
            <SelectTrigger className="border-legal-border focus:border-legal-accent">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="incorporationDate" className="legal-text font-semibold">
            Incorporation Date *
          </Label>
          <Input
            id="incorporationDate"
            type="date"
            value={data.incorporationDate}
            onChange={(e) => updateData("incorporationDate", e.target.value)}
            className="border-legal-border focus:border-legal-accent"
          />
        </div>
      </div>
    </CardContent>
  </Card>
)

export const Step2BusinessDetails = ({
  data,
  updateData,
  updateNestedData,
  showBankDetails,
  setShowBankDetails
}: StepProps) => (
  <Card className="legal-professional-card">
    <CardHeader>
      <CardTitle className="legal-heading flex items-center gap-2">
        <FileText className="text-legal-accent" />
        Business Details
      </CardTitle>
      <p className="legal-text-muted">Provide your business registration and contact information</p>
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
            onChange={(e) => updateData("panNumber", e.target.value.toUpperCase())}
            placeholder="ABCDE1234F"
            maxLength={10}
            className="border-legal-border focus:border-legal-accent"
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
            className="border-legal-border focus:border-legal-accent"
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="legal-subheading flex items-center gap-2">
          <MapPin className="text-legal-accent" />
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
              onChange={(e) => updateNestedData("registeredAddress", "street", e.target.value)}
              placeholder="Enter complete street address"
              className="border-legal-border focus:border-legal-accent"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city" className="legal-text font-semibold">
              City *
            </Label>
            <Input
              id="city"
              value={data.registeredAddress.city}
              onChange={(e) => updateNestedData("registeredAddress", "city", e.target.value)}
              placeholder="Enter city"
              className="border-legal-border focus:border-legal-accent"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state" className="legal-text font-semibold">
              State *
            </Label>
            <Input
              id="state"
              value={data.registeredAddress.state}
              onChange={(e) => updateNestedData("registeredAddress", "state", e.target.value)}
              placeholder="Enter state"
              className="border-legal-border focus:border-legal-accent"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pincode" className="legal-text font-semibold">
              Pincode *
            </Label>
            <Input
              id="pincode"
              value={data.registeredAddress.pincode}
              onChange={(e) => updateNestedData("registeredAddress", "pincode", e.target.value)}
              placeholder="Enter pincode"
              maxLength={6}
              className="border-legal-border focus:border-legal-accent"
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="legal-subheading flex items-center gap-2">
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
              onChange={(e) => updateNestedData("contactInfo", "phone", e.target.value)}
              placeholder="Enter phone number"
              className="border-legal-border focus:border-legal-accent"
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
              onChange={(e) => updateNestedData("contactInfo", "email", e.target.value)}
              placeholder="Enter email address"
              className="border-legal-border focus:border-legal-accent"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website" className="legal-text font-semibold">
              Website (Optional)
            </Label>
            <Input
              id="website"
              value={data.contactInfo.website}
              onChange={(e) => updateNestedData("contactInfo", "website", e.target.value)}
              placeholder="Enter website URL"
              className="border-legal-border focus:border-legal-accent"
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="legal-subheading flex items-center gap-2">
            <CreditCard className="text-legal-accent" />
            Bank Details
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBankDetails(!showBankDetails)}
            className="border-legal-border text-legal-accent hover:bg-legal-bg-secondary"
          >
            {showBankDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showBankDetails ? "Hide" : "Show"} Details
          </Button>
        </div>

        {showBankDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-legal-bg-secondary rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="accountNumber" className="legal-text font-semibold">
                Account Number
              </Label>
              <Input
                id="accountNumber"
                value={data.bankDetails.accountNumber}
                onChange={(e) => updateNestedData("bankDetails", "accountNumber", e.target.value)}
                placeholder="Enter account number"
                className="border-legal-border focus:border-legal-accent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ifscCode" className="legal-text font-semibold">
                IFSC Code
              </Label>
              <Input
                id="ifscCode"
                value={data.bankDetails.ifscCode}
                onChange={(e) => updateNestedData("bankDetails", "ifscCode", e.target.value.toUpperCase())}
                placeholder="Enter IFSC code"
                maxLength={11}
                className="border-legal-border focus:border-legal-accent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankName" className="legal-text font-semibold">
                Bank Name
              </Label>
              <Input
                id="bankName"
                value={data.bankDetails.bankName}
                onChange={(e) => updateNestedData("bankDetails", "bankName", e.target.value)}
                placeholder="Enter bank name"
                className="border-legal-border focus:border-legal-accent"
              />
            </div>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
)

export const Step3Documents = ({
  data,
  handleFileUpload,
  uploadProgress,
  isUploading,
  simulateUpload
}: StepProps) => (
  <Card className="legal-professional-card">
    <CardHeader>
      <CardTitle className="legal-heading flex items-center gap-2">
        <Upload className="text-legal-accent" />
        Document Upload
      </CardTitle>
      <p className="legal-text-muted">Upload required business documents</p>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="legal-text font-semibold">
              Certificate of Incorporation *
            </Label>
            <div className="border-2 border-dashed border-legal-border rounded-lg p-6 text-center hover:border-legal-accent transition-colors">
              <Upload className="mx-auto h-12 w-12 text-legal-secondary mb-4" />
              <p className="legal-text-muted mb-2">Drop file here or click to upload</p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload("incorporation", file)
                }}
                className="hidden"
                id="incorporation"
              />
              <label htmlFor="incorporation" className="cursor-pointer">

                <Button
                  variant="outline"
                  size="sm"
                  className="border-legal-border text-legal-accent hover:bg-legal-bg-secondary"
                  onClick={() => document.getElementById('incorporation')?.click()}
                >
                  Choose File
                </Button>
              </label>
            </div>
            {data.documents.incorporation && (
              <div className="flex items-center justify-between gap-2 p-2 bg-legal-bg-secondary rounded">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-legal-accent" />
                  <span className="legal-text text-sm">{data.documents.incorporation.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-legal-secondary hover:text-legal-accent"
                  onClick={() => handleFileUpload("incorporation", null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="legal-text font-semibold">
              PAN Card *
            </Label>
            <div className="border-2 border-dashed border-legal-border rounded-lg p-6 text-center hover:border-legal-accent transition-colors">
              <Upload className="mx-auto h-12 w-12 text-legal-secondary mb-4" />
              <p className="legal-text-muted mb-2">Drop file here or click to upload</p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload("panCard", file)
                }}
                className="hidden"
                id="panCard"
              />
              <label htmlFor="panCard" className="cursor-pointer">
                <Button variant="outline" size="sm"
                  className="border-legal-border text-legal-accent hover:bg-legal-bg-secondary"
                  onClick={() => document.getElementById('panCard')?.click()}
                >
                  Choose File
                </Button>
              </label>
            </div>
            {data.documents.panCard && (
              <div className="flex items-center gap-2 p-2 bg-legal-bg-secondary rounded">
                <FileText className="h-4 w-4 text-legal-accent" />
                <span className="legal-text text-sm">{data.documents.panCard.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-legal-secondary hover:text-legal-accent"
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
            <div className="border-2 border-dashed border-legal-border rounded-lg p-6 text-center hover:border-legal-accent transition-colors">
              <Upload className="mx-auto h-12 w-12 text-legal-secondary mb-4" />
              <p className="legal-text-muted mb-2">Drop file here or click to upload</p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload("gstCertificate", file)
                }}
                className="hidden"
                id="gstCertificate"
              />
              <label htmlFor="gstCertificate" className="cursor-pointer">
                <Button variant="outline" onClick={() => document.getElementById('gstCertificate')?.click()} size="sm" className="border-legal-border text-legal-accent hover:bg-legal-bg-secondary">
                  Choose File
                </Button>
              </label>
            </div>
            {data.documents.gstCertificate && (
              <div className="flex items-center gap-2 p-2 bg-legal-bg-secondary rounded">
                <FileText className="h-4 w-4 text-legal-accent" />
                <span className="legal-text text-sm">{data.documents.gstCertificate.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-legal-secondary hover:text-legal-accent"
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
            <div className="border-2 border-dashed border-legal-border rounded-lg p-6 text-center hover:border-legal-accent transition-colors">
              <Upload className="mx-auto h-12 w-12 text-legal-secondary mb-4" />
              <p className="legal-text-muted mb-2">Drop file here or click to upload</p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload("bankStatements", file)
                }}
                className="hidden"
                id="bankStatements"
              />
              <label htmlFor="bankStatements" className="cursor-pointer">
                <Button variant="outline" onClick={() => document.getElementById('bankStatements')?.click()} size="sm" className="border-legal-border text-legal-accent hover:bg-legal-bg-secondary">
                  Choose File
                </Button>
              </label>
            </div>
            {data.documents.bankStatements && (
              <div className="flex items-center gap-2 p-2 bg-legal-bg-secondary rounded">
                <FileText className="h-4 w-4 text-legal-accent" />
                <span className="legal-text text-sm">{data.documents.bankStatements.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-legal-secondary hover:text-legal-accent"
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
        disabled={!data.documents.incorporation || !data.documents.panCard || isUploading}
        className="btn-legal-primary"
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
)

export const Step4TeamSetup = ({
  data,
  addTeamMember,
  updateTeamMember,
  removeTeamMember
}: StepProps) => (
  <Card className="legal-professional-card">
    <CardHeader>
      <CardTitle className="legal-heading flex items-center gap-2">
        <Users className="text-legal-accent" />
        Team Setup
      </CardTitle>
      <p className="legal-text-muted">Invite team members and set up roles</p>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-4">
        {data.teamMembers.map((member, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-legal-border rounded-lg">
            <div className="space-y-2">
              <Label className="legal-text font-semibold">Name</Label>
              <Input
                value={member.name}
                onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                placeholder="Enter name"
                className="border-legal-border focus:border-legal-accent"
              />
            </div>
            <div className="space-y-2">
              <Label className="legal-text font-semibold">Email</Label>
              <Input
                type="email"
                value={member.email}
                onChange={(e) => updateTeamMember(index, "email", e.target.value)}
                placeholder="Enter email"
                className="border-legal-border focus:border-legal-accent"
              />
            </div>
            <div className="space-y-2">
              <Label className="legal-text font-semibold">Role</Label>
              <Select value={member.role} onValueChange={(value) => updateTeamMember(index, "role", value)}>
                <SelectTrigger className="border-legal-border focus:border-legal-accent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Member">Member</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!member.name || !member.email}
                className="border-legal-border text-legal-accent hover:bg-legal-bg-secondary"
              >
                {member.invited ? (
                  <>
                    <Check className="h-4 w-4" />
                    Invited
                  </>
                ) : (
                  "Invite"
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeTeamMember(index)}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={addTeamMember}
        variant="outline"
        className="border-legal-border text-legal-accent hover:bg-legal-bg-secondary"
      >
        <Users className="h-4 w-4" />
        Add Team Member
      </Button>

      <div className="space-y-4">
        <h3 className="legal-subheading">Role Permissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full border border-legal-border rounded-lg">
            <thead>
              <tr className="bg-legal-bg-secondary">
                <th className="p-3 text-left legal-text font-semibold">Permission</th>
                <th className="p-3 text-center legal-text font-semibold">Admin</th>
                <th className="p-3 text-center legal-text font-semibold">Manager</th>
                <th className="p-3 text-center legal-text font-semibold">Member</th>
                <th className="p-3 text-center legal-text font-semibold">Viewer</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-legal-border">
                <td className="p-3 legal-text">View Documents</td>
                <td className="p-3 text-center"><Check className="h-4 w-4 text-success mx-auto" /></td>
                <td className="p-3 text-center"><Check className="h-4 w-4 text-success mx-auto" /></td>
                <td className="p-3 text-center"><Check className="h-4 w-4 text-success mx-auto" /></td>
                <td className="p-3 text-center"><Check className="h-4 w-4 text-success mx-auto" /></td>
              </tr>
              <tr className="border-t border-legal-border">
                <td className="p-3 legal-text">Upload Documents</td>
                <td className="p-3 text-center"><Check className="h-4 w-4 text-success mx-auto" /></td>
                <td className="p-3 text-center"><Check className="h-4 w-4 text-success mx-auto" /></td>
                <td className="p-3 text-center"><Check className="h-4 w-4 text-success mx-auto" /></td>
                <td className="p-3 text-center">-</td>
              </tr>
              <tr className="border-t border-legal-border">
                <td className="p-3 legal-text">Manage Team</td>
                <td className="p-3 text-center"><Check className="h-4 w-4 text-success mx-auto" /></td>
                <td className="p-3 text-center"><Check className="h-4 w-4 text-success mx-auto" /></td>
                <td className="p-3 text-center">-</td>
                <td className="p-3 text-center">-</td>
              </tr>
              <tr className="border-t border-legal-border">
                <td className="p-3 legal-text">Billing & Settings</td>
                <td className="p-3 text-center"><Check className="h-4 w-4 text-success mx-auto" /></td>
                <td className="p-3 text-center">-</td>
                <td className="p-3 text-center">-</td>
                <td className="p-3 text-center">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </CardContent>
  </Card>
)

export const Step5Verification = ({ data, updateData }: StepProps) => (
  <Card className="legal-professional-card">
    <CardHeader>
      <CardTitle className="legal-heading flex items-center gap-2">
        <Shield className="text-legal-accent" />
        Verification & Summary
      </CardTitle>
      <p className="legal-text-muted">Review your information and complete setup</p>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-4">
        <h3 className="legal-subheading">Business Information Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-legal-bg-secondary rounded-lg">
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
          <div>
            <p className="legal-text font-semibold">Team Members</p>
            <p className="legal-text-muted">{data.teamMembers.length} members</p>
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
          <Label htmlFor="blockchainHashing" className="legal-text font-semibold">
            Enable blockchain hashing for document verification
          </Label>
        </div>
        <p className="legal-text-muted text-sm">
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
            <Label htmlFor="termsAccepted" className="legal-text font-semibold">
              I accept the terms and conditions
            </Label>
            <p className="legal-text-muted text-sm mt-1">
              By checking this box, you agree to our Terms of Service and Privacy Policy.
              You also confirm that all information provided is accurate and up-to-date.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="legal-text font-semibold text-blue-900">Important Notice</h4>
            <p className="legal-text-muted text-sm text-blue-800">
              Your business information will be verified by our compliance team within 2-3 business days.
              You'll receive an email notification once the verification is complete.
            </p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
)
