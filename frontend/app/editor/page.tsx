"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Bold,
  Italic,
  List,
  Table,
  Save,
  FileText,
  Download,
  Plus,
  Hash,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Command,
  Sparkles,
  FileCheck,
  Settings,
  Eye,
  Code,
  Loader2,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

// AI agent commands data
const agentCommands = [
  {
    id: "generate-employment-contract",
    command: "@Generate Employment Contract",
    description: "Create a comprehensive employment contract using the business context and information provided in the editor"
  },
  {
    id: "file-gst-return",
    command: "@File GST Return",
    description: "Generate and file GST return documentation based on the business information and tax details provided"
  },
  {
    id: "draft-legal-notice",
    command: "@Draft Legal Notice",
    description: "Create a formal legal notice using the business context and specific requirements mentioned in the editor"
  },
  {
    id: "check-compliance-status",
    command: "@Check Compliance Status",
    description: "Verify compliance status across multiple regulations based on the business details and operational information provided"
  }
];

export default function MarkdownEditor() {
  const [editorContent, setEditorContent] = useState(`# Legal Document Draft

Welcome to the LegalEase AI Editor. Use @commands to generate legal documents automatically based on the business context below.

## Business Profile & Operational History

**Company Name:** Ashok Enterprises PRIVATE LIMITED  
**CIN:** U72200KA2024PTC987654  
**Date of Incorporation:** 15 April 2024  
**Business Category:** Private Limited Company, Non-Government  
**Registered Office:** #42, 3rd Floor, Innov8 Tower, 123 Silicon Avenue, Electronics City II, Bengaluru – 560100  
**Email ID:** compliance@ashokeneterprises.in  
**Authorised Capital:** ₹10,00,000  
**Paid-up Capital:** ₹5,00,000  
**Nature of Business:** Research and Development in physical and engineering sciences (NIC Code: 72200)

Ashok Enterprises PRIVATE LIMITED was founded in April 2024 by two technocrats, **Rahul Narayan** and **Priya Sharma**, with the vision to provide specialized R&D services in industrial automation, robotics, and control systems. From its inception, the company has focused on high-value engineering development and B2B consulting for manufacturing clients.

The business commenced operations shortly after incorporation, receiving its Certificate of Commencement of Business on 21 April 2024. The company operates from its technology office in Bengaluru and maintains its primary current account with ICICI Bank.

**Shareholding Structure:**
- Rahul Narayan: 60% (30,000 shares) - DIN: 09876543
- Priya Sharma: 40% (20,000 shares) - DIN: 09876544

## Tax & Compliance Summary

**Financial Year 2024–25 (Assessment Year 2025–26):**
- Gross Turnover: ₹3.82 Crores
- Total Taxable Income: ₹1.06 Crores
- Tax Payable: ₹28.04 Lakhs
- GST Registration: Active from 20 April 2024
- All TDS Statements (24Q & 26Q) filed without defaults

**HSN Classification:**
- 84795000 – Industrial Robots
- 85176290 – Control Units

## Available AI Commands

Type @ to see available commands:

- **@Generate Employment Contract** - Create comprehensive employment contracts
- **@File GST Return** - Generate GST return documentation
- **@Draft Legal Notice** - Create formal legal notices
- **@Check Compliance Status** - Verify regulatory compliance

*The AI will automatically use the business information above to generate professional, legally compliant documents.*`);

  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState<any>(null);
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [agentStatus, setAgentStatus] = useState("idle");
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [selectedAgent, setSelectedAgent] = useState("legal-assistant");
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);
  const [blockchainHash, setBlockchainHash] = useState<string | null>(null);
  const [agentOutput, setAgentOutput] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Calculate word count
  useEffect(() => {
    const words = editorContent.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [editorContent]);

  // Get placeholder text for different commands
  const getPlaceholderText = (command?: string) => {
    switch (command) {
      case '@Generate Employment Contract':
        return `For example:
"I need an employment contract for Priya Sharma as Chief Technology Officer. Salary: ₹25 LPA, start date: March 1, 2025, probation: 6 months. Include equity participation, remote work flexibility, and IP assignment clauses. She will report to CEO and work from Bangalore office."

The AI will extract: candidate name, position, salary, start date, probation period, benefits, work location, reporting structure, and special clauses automatically.`;
        
      case '@File GST Return':
        return `For example:
"Generate GST return for Q1 2025 (Jan-Mar). Business: Ashok Enterprises, turnover: ₹95 lakhs, supplies: industrial robots (₹60L) and control units (₹35L), ITC claimed: ₹8 lakhs, interstate sales to Tamil Nadu and Karnataka."

The AI will extract: business name, return period, turnover, taxable supplies, ITC details, HSN codes, and business type automatically.`;
        
      case '@Draft Legal Notice':
        return `For example:
"Draft a payment default notice to TechCorp Solutions for non-payment of ₹12 lakhs for robotics project delivered on Dec 15, 2024. Contract signed on Oct 1, 2024. Give them 21 days to pay or face legal action including interest at 18% per annum."

The AI will extract: sender, recipient, notice type, amount, deadlines, subject matter, legal grounds, and consequences automatically.`;
        
      case '@Check Compliance Status':
        return `For example:
"Review compliance status for FY 2024-25. Focus on GST filings, TDS returns, annual filing due dates, and industry-specific R&D compliance. Highlight any pending actions and upcoming deadlines for Q1 2025."

The AI will extract: business name, review period, compliance areas, business type, industry focus, and specific concerns automatically.`;
        
      default:
        return "Describe in natural language what kind of document you need and any specific requirements...";
    }
  };

  // Handle @ symbol for command palette
  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setEditorContent(value);

    // Check for @ symbol to show command palette
    if (value.endsWith('@')) {
      setShowCommandPalette(true);
    } else if (!value.includes('@')) {
      setShowCommandPalette(false);
    }
  };

  // Insert command into editor and show prompt dialog
  const insertCommand = (command: any) => {
    const newContent = editorContent.replace(/@$/, command.command);
    setEditorContent(newContent);
    setShowCommandPalette(false);
    setSelectedCommand(command);
    setUserPrompt("");
    setShowPromptDialog(true);
  };

  // Handle document generation with natural language processing
  const handleDocumentGeneration = async () => {
    if (!selectedCommand) return;

    setIsProcessing(true);
    setAgentStatus("processing");
    setError(null);
    setShowPromptDialog(false);

    try {
      const response = await fetch('/api/generate-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: selectedCommand.command,
          context: editorContent,
          specificRequest: userPrompt || `Generate a professional ${selectedCommand.command.replace('@', '').toLowerCase()} based on the business information provided.`
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate document');
      }

      // Update editor content with generated document
      setEditorContent(data.document);
      setGeneratedDocument(data.document);
      setBlockchainHash(data.blockchainHash);
      setAgentOutput(data);
      setAgentStatus("completed");
      setLastSaved(new Date());

    } catch (err) {
      console.error('Error generating document:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate document');
      setAgentStatus("error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Format buttons
  const insertFormat = (format: string) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorContent.substring(start, end);

    let replacement = "";
    switch (format) {
      case "bold":
        replacement = `**${selectedText}**`;
        break;
      case "italic":
        replacement = `*${selectedText}*`;
        break;
      case "list":
        replacement = `- ${selectedText}`;
        break;
      case "table":
        replacement = `| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| ${selectedText} | Cell 2 | Cell 3 |
| Cell 4 | Cell 5 | Cell 6 |`;
        break;
    }

    const newContent = editorContent.substring(0, start) + replacement + editorContent.substring(end);
    setEditorContent(newContent);
  };

  // Save document
  const saveDocument = () => {
    setLastSaved(new Date());
    setAgentStatus("saved");
  };

  // Download document
  const downloadDocument = () => {
    const element = document.createElement('a');
    const file = new Blob([editorContent], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = 'legal-document.md';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+P to open command palette
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      // Escape to close command palette and prompt dialog
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
        setShowPromptDialog(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F3EE] font-montserrat">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-[#D1C4B8] shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left side - File operations */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
              onClick={() => {
                setEditorContent(`# Legal Document Draft

Welcome to the LegalEase AI Editor. Use @commands to generate legal documents automatically based on the business context below.

## Business Profile & Operational History

**Company Name:** Ashok Enterprises PRIVATE LIMITED  
**CIN:** U72200KA2024PTC987654  
**Date of Incorporation:** 15 April 2024  
**Business Category:** Private Limited Company, Non-Government  
**Registered Office:** #42, 3rd Floor, Innov8 Tower, 123 Silicon Avenue, Electronics City II, Bengaluru – 560100  
**Email ID:** compliance@ashokeneterprises.in  
**Authorised Capital:** ₹10,00,000  
**Paid-up Capital:** ₹5,00,000  
**Nature of Business:** Research and Development in physical and engineering sciences (NIC Code: 72200)

Ashok Enterprises PRIVATE LIMITED was founded in April 2024 by two technocrats, **Rahul Narayan** and **Priya Sharma**, with the vision to provide specialized R&D services in industrial automation, robotics, and control systems. From its inception, the company has focused on high-value engineering development and B2B consulting for manufacturing clients.

The business commenced operations shortly after incorporation, receiving its Certificate of Commencement of Business on 21 April 2024. The company operates from its technology office in Bengaluru and maintains its primary current account with ICICI Bank.

**Shareholding Structure:**
- Rahul Narayan: 60% (30,000 shares) - DIN: 09876543
- Priya Sharma: 40% (20,000 shares) - DIN: 09876544

## Tax & Compliance Summary

**Financial Year 2024–25 (Assessment Year 2025–26):**
- Gross Turnover: ₹3.82 Crores
- Total Taxable Income: ₹1.06 Crores
- Tax Payable: ₹28.04 Lakhs
- GST Registration: Active from 20 April 2024
- All TDS Statements (24Q & 26Q) filed without defaults

**HSN Classification:**
- 84795000 – Industrial Robots
- 85176290 – Control Units

## Available AI Commands

Type @ to see available commands:

- **@Generate Employment Contract** - Create comprehensive employment contracts
- **@File GST Return** - Generate GST return documentation
- **@Draft Legal Notice** - Create formal legal notices
- **@Check Compliance Status** - Verify regulatory compliance

*The AI will automatically use the business information above to generate professional, legally compliant documents.*`);
                setAgentOutput(null);
                setBlockchainHash(null);
                setGeneratedDocument(null);
                setError(null);
                setAgentStatus("idle");
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              New
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
              onClick={saveDocument}
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
              onClick={downloadDocument}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Center - Format buttons */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormat("bold")}
              className="text-[#8B4513] hover:bg-[#E8DDD1]"
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormat("italic")}
              className="text-[#8B4513] hover:bg-[#E8DDD1]"
            >
              <Italic className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormat("list")}
              className="text-[#8B4513] hover:bg-[#E8DDD1]"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormat("table")}
              className="text-[#8B4513] hover:bg-[#E8DDD1]"
            >
              <Table className="w-4 h-4" />
            </Button>
          </div>

          {/* Right side - Agent controls */}
          <div className="flex items-center space-x-3">
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger className="w-48 border-[#8B4513]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="legal-assistant">Legal Assistant</SelectItem>
                <SelectItem value="compliance-expert">Compliance Expert</SelectItem>
                <SelectItem value="tax-specialist">Tax Specialist</SelectItem>
                <SelectItem value="contract-drafter">Contract Drafter</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="bg-[#8B4513] hover:bg-[#6B3410] text-white"
              onClick={() => setShowCommandPalette(true)}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
              <Sparkles className="w-4 h-4 mr-2" />
              )}
              Generate
              <span className="ml-2 text-xs opacity-75">Ctrl+Shift+P</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Natural Language Prompt Dialog */}
      <Dialog open={showPromptDialog} onOpenChange={setShowPromptDialog}>
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#8B4513] flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              {selectedCommand?.command}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="userPrompt" className="text-sm font-medium text-[#2A2A2A]">
                Describe what you want to generate
              </Label>
              <div className="text-xs text-[#8B7355] mb-2">
                {selectedCommand?.description}
              </div>
              <Textarea
                id="userPrompt"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder={getPlaceholderText(selectedCommand?.command)}
                className="min-h-[120px] border-[#D1C4B8] resize-none"
                rows={5}
              />
              <div className="text-xs text-[#8B7355] mt-2">
                💡 The AI will use the business context from the editor above along with your specific requirements to generate a professional document.
              </div>
            </div>
            {error && (
              <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
                {error}
              </div>
            )}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowPromptDialog(false)}
                className="border-[#8B4513] text-[#8B4513]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDocumentGeneration}
                disabled={isProcessing}
                className="bg-[#8B4513] hover:bg-[#6B3410] text-white"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Document
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Editor Area */}
      <div className="flex h-[calc(100vh-120px)]">
        {/* Left Pane - Editor (60%) */}
        <div className="w-[60%] bg-white border-r border-[#D1C4B8]">
          <div className="h-full flex flex-col">
            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#F8F3EE] border-b border-[#D1C4B8]">
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-[#8B4513]" />
                <span className="text-sm font-medium text-[#2A2A2A]">Editor</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="border-[#8B4513] text-[#8B4513]">
                  Markdown
                </Badge>
              </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 relative flex">
              {/* Line Numbers */}
              <div className="w-12 bg-[#F8F3EE] border-r border-[#D1C4B8] p-2 text-xs text-[#8B7355] font-mono select-none">
                {editorContent.split('\n').map((_, index) => (
                  <div key={index} className="text-right leading-6">
                    {index + 1}
                  </div>
                ))}
              </div>

              {/* Editor Textarea */}
              <textarea
                ref={editorRef}
                value={editorContent}
                onChange={handleEditorChange}
                className="flex-1 p-4 font-mono text-sm text-[#2A2A2A] bg-white resize-none focus:outline-none leading-6"
                placeholder="Start typing your legal document... Use @ to access AI commands"
                style={{ lineHeight: '1.5rem' }}
              />

              {/* Command Palette */}
              {showCommandPalette && (
                <div className="absolute top-4 left-4 w-80 bg-white border border-[#D1C4B8] rounded-lg shadow-lg z-10">
                  <div className="p-3 border-b border-[#D1C4B8]">
                    <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Command className="w-4 h-4 text-[#8B4513]" />
                      <span className="text-sm font-medium text-[#2A2A2A]">AI Commands</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCommandPalette(false)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {agentCommands.map((cmd) => (
                      <div
                        key={cmd.id}
                        className="p-3 hover:bg-[#F8F3EE] cursor-pointer border-b border-[#D1C4B8] last:border-b-0"
                        onClick={() => insertCommand(cmd)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-[#8B4513]">
                              {cmd.command}
                            </div>
                            <div className="text-xs text-[#8B7355] mt-1">
                              {cmd.description}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              <Badge variant="secondary" className="text-xs bg-[#E8DDD1] text-[#8B7355]">
                                AI-Powered
                              </Badge>
                              <Badge variant="secondary" className="text-xs bg-[#E8DDD1] text-[#8B7355]">
                                Context-Aware
                                </Badge>
                            </div>
                          </div>
                          <Sparkles className="w-4 h-4 text-[#8B4513] mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Pane - Preview (40%) */}
        <div className="w-[40%] bg-[#F8F3EE]">
          <div className="h-full flex flex-col">
            {/* Preview Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#E8DDD1] border-b border-[#D1C4B8]">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-[#8B4513]" />
                <span className="text-sm font-medium text-[#2A2A2A]">Preview</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="border-[#8B4513] text-[#8B4513]">
                  Live
                </Badge>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 p-4 overflow-y-auto">
              <Card className="bg-white border-[#D1C4B8] shadow-sm">
                <CardContent className="p-6">
                  <div className="prose prose-sm max-w-none">
                    <div
                      className="text-[#2A2A2A] leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: editorContent
                          // Headers
                          .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-[#8B4513] mb-4 border-b border-[#D1C4B8] pb-2">$1</h1>')
                          .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-[#8B4513] mb-3 mt-6">$1</h2>')
                          .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium text-[#8B4513] mb-2 mt-4">$1</h3>')
                          .replace(/^#### (.*$)/gim, '<h4 class="text-base font-medium text-[#8B4513] mb-2 mt-3">$1</h4>')
                          // Bold and Italic
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                          // Code blocks
                          .replace(/```([\s\S]*?)```/g, '<pre class="bg-[#F8F3EE] p-3 rounded border border-[#D1C4B8] my-3 overflow-x-auto"><code class="text-sm font-mono text-[#8B4513]">$1</code></pre>')
                          .replace(/`([^`]+)`/g, '<code class="bg-[#F8F3EE] px-1 py-0.5 rounded text-sm font-mono text-[#8B4513]">$1</code>')
                          // Lists
                          .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1 flex items-start"><span class="mr-2 text-[#8B4513]">•</span>$1</li>')
                          .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
                          // Links
                          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#8B4513] underline hover:text-[#6B3410]">$1</a>')
                          // Blockquotes
                          .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-[#8B4513] pl-4 my-3 italic text-[#8B7355]">$1</blockquote>')
                          // Tables
                          .replace(/\|(.+)\|/g, '<tr>$1</tr>')
                          .replace(/\|/g, '<td class="border border-[#D1C4B8] px-3 py-2">')
                          .replace(/<tr><td class="border border-\[#D1C4B8\] px-3 py-2">(.+)<\/td>/g, '<tr><th class="border border-[#D1C4B8] px-3 py-2 bg-[#F8F3EE] font-semibold">$1</th>')
                          // Line breaks
                          .replace(/\n\n/g, '<br><br>')
                          .replace(/\n/g, '<br>')
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Processing Indicator */}
              {isProcessing && (
                <Card className="mt-4 bg-white border-[#D1C4B8] shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#8B4513]" />
                      <span className="text-sm text-[#8B7355]">AI agent is processing your request...</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Agent Output Logs */}
              {agentOutput && !isProcessing && (
                <Card className="mt-4 bg-white border-[#D1C4B8] shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-[#8B4513]" />
                      <span className="text-[#2A2A2A]">AI Agent Output</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-sm text-[#8B7355] space-y-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Command executed: {agentOutput.documentType}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileCheck className="w-4 h-4 text-blue-600" />
                        <span>Document generated successfully</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Hash className="w-4 h-4 text-purple-600" />
                        <span>Blockchain hash: {agentOutput.blockchainHash}</span>
                      </div>
                      
                      {/* Extracted Data Display */}
                      {agentOutput.extractedData && Object.keys(agentOutput.extractedData).length > 0 && (
                        <div className="mt-3 pt-3 border-t border-[#D1C4B8]">
                          <div className="flex items-center space-x-2 mb-2">
                            <Search className="w-4 h-4 text-orange-600" />
                            <span className="font-medium text-[#2A2A2A]">Extracted Information:</span>
                          </div>
                          <div className="bg-[#F8F3EE] p-3 rounded border border-[#D1C4B8] max-h-32 overflow-y-auto">
                            <div className="text-xs space-y-1">
                              {Object.entries(agentOutput.extractedData).map(([key, value]) => (
                                value !== 'NOT_PROVIDED' && (
                                  <div key={key} className="flex items-start space-x-2">
                                    <span className="font-medium text-[#8B4513] capitalize min-w-0 flex-shrink-0">
                                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                                    </span>
                                    <span className="text-[#2A2A2A] break-words">{value as string}</span>
                                  </div>
                                )
                              ))}
                              {Object.values(agentOutput.extractedData).every(v => v === 'NOT_PROVIDED') && (
                                <div className="text-[#8B7355] italic">
                                  No specific details extracted - using business context and defaults
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Error Display */}
              {error && !isProcessing && (
                <Card className="mt-4 bg-white border-red-200 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600">{error}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-white border-t border-[#D1C4B8] px-6 py-2">
        <div className="flex items-center justify-between text-sm text-[#8B7355]">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              {agentStatus === "idle" && <AlertCircle className="w-4 h-4" />}
              {agentStatus === "processing" && <Loader2 className="w-4 h-4 animate-spin" />}
              {agentStatus === "completed" && <CheckCircle className="w-4 h-4 text-green-600" />}
              {agentStatus === "saved" && <FileCheck className="w-4 h-4 text-blue-600" />}
              {agentStatus === "error" && <AlertCircle className="w-4 h-4 text-red-600" />}
              <span className="capitalize">{agentStatus}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <span>{wordCount} words</span>
            {lastSaved && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {blockchainHash && (
              <>
            <div className="flex items-center space-x-1">
              <Hash className="w-4 h-4" />
                  <span>Hash: {blockchainHash}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
              </>
            )}
            <div className="flex items-center space-x-1">
              <Settings className="w-4 h-4" />
              <span>Auto-save enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
