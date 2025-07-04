"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
  Code
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock agent commands data
const agentCommands = [
  {
    id: "generate-employment-contract",
    command: "@Generate Employment Contract",
    description: "Create a comprehensive employment contract with all necessary clauses",
    parameters: ["Company Name", "Employee Name", "Position", "Salary"]
  },
  {
    id: "file-gst-return",
    command: "@File GST Return",
    description: "Generate and file GST return with proper documentation",
    parameters: ["Business Name", "GST Number", "Period", "Turnover"]
  },
  {
    id: "draft-legal-notice",
    command: "@Draft Legal Notice",
    description: "Create a formal legal notice for various purposes",
    parameters: ["Notice Type", "Recipient", "Subject", "Deadline"]
  },
  {
    id: "check-compliance-status",
    command: "@Check Compliance Status",
    description: "Verify compliance status across multiple regulations",
    parameters: ["Business Type", "Industry", "Location"]
  }
];

export default function MarkdownEditor() {
  const [editorContent, setEditorContent] = useState(`# Legal Document Draft

Welcome to the LegalEase AI Editor. Use @commands to generate legal documents automatically.

## Getting Started

Type @ to see available commands:

- @Generate Employment Contract
- @File GST Return
- @Draft Legal Notice
- @Check Compliance Status

## Document Structure

This editor supports:
- **Markdown formatting**
- *Rich text editing*
- Tables and lists
- Code blocks
- Real-time preview

## Agent Integration

The AI agent can help you:
1. Generate legal documents
2. Check compliance requirements
3. File official returns
4. Draft notices and contracts

Start typing @ to explore commands...`);

  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState<string | null>(null);
  const [agentStatus, setAgentStatus] = useState("idle");
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [selectedAgent, setSelectedAgent] = useState("legal-assistant");
  const [isProcessing, setIsProcessing] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Calculate word count
  useEffect(() => {
    const words = editorContent.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [editorContent]);

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

  // Insert command into editor
  const insertCommand = (command: string) => {
    const newContent = editorContent.replace(/@$/, command);
    setEditorContent(newContent);
    setShowCommandPalette(false);
    setSelectedCommand(command);

    // Simulate agent processing
    setAgentStatus("processing");
    setIsProcessing(true);
    setTimeout(() => {
      setAgentStatus("completed");
      setIsProcessing(false);
      setLastSaved(new Date());
    }, 2000);
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+P to open command palette
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      // Escape to close command palette
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
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
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate
              <span className="ml-2 text-xs opacity-75">Ctrl+Shift+P</span>
            </Button>
          </div>
        </div>
      </div>

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
                    <div className="flex items-center space-x-2">
                      <Command className="w-4 h-4 text-[#8B4513]" />
                      <span className="text-sm font-medium text-[#2A2A2A]">AI Commands</span>
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {agentCommands.map((cmd) => (
                      <div
                        key={cmd.id}
                        className="p-3 hover:bg-[#F8F3EE] cursor-pointer border-b border-[#D1C4B8] last:border-b-0"
                        onClick={() => insertCommand(cmd.command)}
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
                              {cmd.parameters.map((param, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs bg-[#E8DDD1] text-[#8B7355]">
                                  {param}
                                </Badge>
                              ))}
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
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#8B4513]"></div>
                      <span className="text-sm text-[#8B7355]">AI agent is processing your request...</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Agent Output Logs */}
              {selectedCommand && !isProcessing && (
                <Card className="mt-4 bg-white border-[#D1C4B8] shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Sparkles className="w-4 h-4 text-[#8B4513]" />
                      <span className="text-sm font-medium text-[#2A2A2A]">AI Agent Output</span>
                    </div>
                    <div className="text-sm text-[#8B7355] space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Command executed: {selectedCommand}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileCheck className="w-4 h-4 text-blue-600" />
                        <span>Document generated successfully</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Hash className="w-4 h-4 text-purple-600" />
                        <span>Blockchain hash: 0x1234...abcd</span>
                      </div>
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
              {agentStatus === "processing" && <Clock className="w-4 h-4 animate-spin" />}
              {agentStatus === "completed" && <CheckCircle className="w-4 h-4 text-green-600" />}
              {agentStatus === "saved" && <FileCheck className="w-4 h-4 text-blue-600" />}
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
            <div className="flex items-center space-x-1">
              <Hash className="w-4 h-4" />
              <span>Hash: 0x1234...abcd</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
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
